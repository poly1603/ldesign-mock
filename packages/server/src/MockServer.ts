/**
 * Mock 服务器核心
 */

import express, { type Express } from 'express'
import cors from 'cors'
import { createServer, type Server } from 'http'
import { WebSocketServer } from 'ws'
import chalk from 'chalk'
import type { MockConfig, MockServerOptions } from '@ldesign/mock-core'
import {
  ConfigManager,
  DataGenerator,
  ScenarioManager,
  MockDatabase,
} from '@ldesign/mock-core'
import { RESTfulHandler } from './handlers/RESTfulHandler.js'
import { GraphQLHandler } from './handlers/GraphQLHandler.js'
import { RequestInterceptor } from './middleware/RequestInterceptor.js'
import { HotReloadWatcher } from './utils/HotReloadWatcher.js'
import { ConnectionManager } from './websocket/ConnectionManager.js'
import { setupApiRoutes } from './routes/index.js'

/**
 * Mock 服务器类
 */
export class MockServer {
  private app: Express
  private server?: Server
  private wss?: WebSocketServer
  private configManager: ConfigManager
  private dataGenerator: DataGenerator
  private scenarioManager: ScenarioManager
  private database: MockDatabase
  private restfulHandler: RESTfulHandler
  private graphqlHandler?: GraphQLHandler
  private requestInterceptor: RequestInterceptor
  private hotReloadWatcher?: HotReloadWatcher
  private connectionManager?: ConnectionManager
  private config: MockConfig
  private debug: boolean

  constructor(options: MockServerOptions) {
    this.config = options.config
    this.debug = options.debug || false

    // 初始化管理器
    this.configManager = new ConfigManager(options.config)
    this.dataGenerator = new DataGenerator({
      locale: 'zh_CN',
    })
    this.scenarioManager = new ScenarioManager()
    this.database = new MockDatabase(options.config.database?.path)

    // 加载场景
    if (options.config.scenarios) {
      this.scenarioManager.loadFromConfig(options.config.scenarios)
    }

    // 设置当前场景
    if (options.config.currentScenario) {
      this.scenarioManager.switchScenario(options.config.currentScenario)
    }

    // 初始化处理器
    this.restfulHandler = new RESTfulHandler({
      dataGenerator: this.dataGenerator,
      database: this.database,
      scenarioManager: this.scenarioManager,
    })

    this.requestInterceptor = new RequestInterceptor({
      database: this.database,
      scenarioManager: this.scenarioManager,
      delay: options.config.server.delay || 0,
    })

    // 创建 Express 应用
    this.app = express()
    this.setupMiddleware()

    // 启用热重载
    if (options.watch) {
      this.setupHotReload()
    }
  }

  /**
   * 设置中间件
   */
  private setupMiddleware(): void {
    // CORS
    this.app.use(cors(this.config.cors || {}))

    // Body parser
    this.app.use(express.json({ limit: '10mb' }))
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }))

    // 请求拦截器
    this.app.use(this.requestInterceptor.middleware())

    // 静态文件
    if (this.config.server.static) {
      this.app.use(express.static(this.config.server.static))
    }
  }

  /**
   * 设置热重载
   */
  private setupHotReload(): void {
    this.hotReloadWatcher = new HotReloadWatcher({
      files: this.config.files,
      onChange: async () => {
        this.log('检测到文件变化，重新加载 Mock 配置...')
        await this.reload()
        this.broadcast({
          type: 'config-update',
          data: { message: 'Mock 配置已重新加载' },
          timestamp: Date.now(),
        })
      },
    })
  }

  /**
   * 启动服务器
   */
  async start(): Promise<void> {
    const { host, port, websocket } = this.config.server

    // 加载 Mock 路由
    await this.restfulHandler.loadRoutes(this.config.files)

    // 设置 API 路由
    setupApiRoutes(this.app, {
      database: this.database,
      scenarioManager: this.scenarioManager,
      configManager: this.configManager,
      restfulHandler: this.restfulHandler,
    })

    // 设置 RESTful Mock 路由
    this.app.use(this.restfulHandler.middleware())

    // 设置 GraphQL（如果启用）
    if (this.config.graphql?.enabled) {
      this.graphqlHandler = new GraphQLHandler({
        dataGenerator: this.dataGenerator,
        endpoint: this.config.graphql.endpoint || '/graphql',
        playground: this.config.graphql.playground,
      })
      await this.graphqlHandler.setup(this.app)
    }

    // 错误处理
    this.app.use(this.errorHandler.bind(this))

    // 创建 HTTP 服务器
    this.server = createServer(this.app)

    // 设置 WebSocket（如果启用）
    if (websocket) {
      this.wss = new WebSocketServer({ server: this.server })
      this.connectionManager = new ConnectionManager(this.wss)
      this.setupWebSocketHandlers()
    }

    // 启动热重载监听
    if (this.hotReloadWatcher) {
      this.hotReloadWatcher.start()
    }

    // 启动服务器
    await new Promise<void>((resolve, reject) => {
      this.server!.listen(port, host, () => {
        this.printStartupInfo()
        resolve()
      })
      this.server!.on('error', reject)
    })
  }

  /**
   * 设置 WebSocket 处理器
   */
  private setupWebSocketHandlers(): void {
    if (!this.connectionManager) return

    // 监听场景切换
    this.scenarioManager.watch((scenario) => {
      this.broadcast({
        type: 'scenario-change',
        data: { scenario },
        timestamp: Date.now(),
      })
    })

    // 监听配置变化
    this.configManager.watch((config) => {
      this.broadcast({
        type: 'config-update',
        data: { config },
        timestamp: Date.now(),
      })
    })
  }

  /**
   * 广播消息
   */
  private broadcast(message: any): void {
    if (this.connectionManager) {
      this.connectionManager.broadcast(message)
    }
  }

  /**
   * 重新加载配置
   */
  async reload(): Promise<void> {
    await this.configManager.reload()
    await this.restfulHandler.loadRoutes(this.config.files)
    this.log('配置已重新加载')
  }

  /**
   * 错误处理中间件
   */
  private errorHandler(err: any, req: any, res: any, next: any): void {
    console.error('Mock Server Error:', err)

    res.status(err.status || 500).json({
      success: false,
      message: err.message || 'Internal Server Error',
      error: this.debug ? err.stack : undefined,
      timestamp: Date.now(),
    })
  }

  /**
   * 打印启动信息
   */
  private printStartupInfo(): void {
    const { host, port } = this.config.server
    const url = `http://${host}:${port}`

    console.log()
    console.log(chalk.green('✓'), chalk.bold('Mock Server started!'))
    console.log()
    console.log(chalk.gray('  Server:  '), chalk.cyan(url))

    if (this.config.graphql?.enabled) {
      const graphqlUrl = `${url}${this.config.graphql.endpoint || '/graphql'}`
      console.log(chalk.gray('  GraphQL: '), chalk.cyan(graphqlUrl))
    }

    if (this.config.server.websocket) {
      console.log(chalk.gray('  WebSocket:'), chalk.cyan(`ws://${host}:${port}`))
    }

    const scenario = this.scenarioManager.getCurrentScenario()
    if (scenario) {
      console.log(chalk.gray('  Scenario:'), chalk.yellow(scenario))
    }

    console.log()
    console.log(chalk.gray('  Press'), chalk.cyan('Ctrl+C'), chalk.gray('to stop'))
    console.log()
  }

  /**
   * 停止服务器
   */
  async stop(): Promise<void> {
    this.log('正在停止服务器...')

    // 停止热重载监听
    if (this.hotReloadWatcher) {
      this.hotReloadWatcher.stop()
    }

    // 关闭 WebSocket
    if (this.wss) {
      this.wss.close()
    }

    // 关闭数据库
    this.database.close()

    // 关闭服务器
    if (this.server) {
      await new Promise<void>((resolve) => {
        this.server!.close(() => resolve())
      })
    }

    this.log('服务器已停止')
  }

  /**
   * 获取服务器实例
   */
  getApp(): Express {
    return this.app
  }

  /**
   * 获取配置管理器
   */
  getConfigManager(): ConfigManager {
    return this.configManager
  }

  /**
   * 获取数据生成器
   */
  getDataGenerator(): DataGenerator {
    return this.dataGenerator
  }

  /**
   * 获取场景管理器
   */
  getScenarioManager(): ScenarioManager {
    return this.scenarioManager
  }

  /**
   * 获取数据库
   */
  getDatabase(): MockDatabase {
    return this.database
  }

  /**
   * 日志输出
   */
  private log(message: string): void {
    if (this.debug) {
      console.log(chalk.blue('[MockServer]'), message)
    }
  }
}

/**
 * 创建 Mock 服务器
 */
export function createMockServer(options: MockServerOptions): MockServer {
  return new MockServer(options)
}

