/**
 * Mock 配置管理器
 */

import { existsSync } from 'fs'
import { resolve, dirname } from 'path'
import { pathToFileURL } from 'url'
import type { MockConfig } from '../types/index.js'

/**
 * 默认配置
 */
const DEFAULT_CONFIG: MockConfig = {
  server: {
    port: 3001,
    host: 'localhost',
    delay: 0,
    websocket: true,
  },
  files: ['mock/**/*.js', 'mock/**/*.ts'],
  scenarios: {},
  database: {
    path: '.mock/data.db',
    wal: true,
  },
  logging: {
    requests: true,
    level: 'info',
  },
  cors: {
    origin: true,
    credentials: true,
  },
  graphql: {
    enabled: false,
    endpoint: '/graphql',
    playground: true,
  },
}

/**
 * 配置管理器类
 */
export class ConfigManager {
  private config: MockConfig
  private configPath?: string
  private watchers: Set<(config: MockConfig) => void> = new Set()

  constructor(config?: Partial<MockConfig>) {
    this.config = this.mergeConfig(DEFAULT_CONFIG, config || {})
  }

  /**
   * 加载配置文件
   */
  async loadConfig(configPath?: string): Promise<MockConfig> {
    const cwd = process.cwd()

    // 查找配置文件
    const possiblePaths = configPath
      ? [resolve(cwd, configPath)]
      : [
        resolve(cwd, 'mock.config.js'),
        resolve(cwd, 'mock.config.ts'),
        resolve(cwd, 'mock.config.mjs'),
        resolve(cwd, '.mockrc.js'),
        resolve(cwd, '.mockrc'),
      ]

    for (const path of possiblePaths) {
      if (existsSync(path)) {
        this.configPath = path
        const loadedConfig = await this.importConfig(path)
        this.config = this.mergeConfig(DEFAULT_CONFIG, loadedConfig)
        return this.config
      }
    }

    // 没有找到配置文件，使用默认配置
    return this.config
  }

  /**
   * 导入配置文件
   */
  private async importConfig(path: string): Promise<Partial<MockConfig>> {
    try {
      // 使用 jiti 支持 TypeScript 和 ESM
      const { createJiti } = await import('jiti')
      const jiti = createJiti(import.meta.url, {
        interopDefault: true,
        esmResolve: true,
      })

      const module = jiti(path)
      return module.default || module
    } catch (error) {
      console.warn(`Failed to load config from ${path}:`, error)
      return {}
    }
  }

  /**
   * 合并配置
   */
  private mergeConfig(base: MockConfig, override: Partial<MockConfig>): MockConfig {
    return {
      ...base,
      ...override,
      server: {
        ...base.server,
        ...override.server,
      },
      database: {
        ...base.database,
        ...override.database,
      },
      logging: {
        ...base.logging,
        ...override.logging,
      },
      cors: {
        ...base.cors,
        ...override.cors,
      },
      graphql: {
        ...base.graphql,
        ...override.graphql,
      },
    }
  }

  /**
   * 获取配置
   */
  getConfig(): MockConfig {
    return { ...this.config }
  }

  /**
   * 更新配置
   */
  updateConfig(updates: Partial<MockConfig>): void {
    this.config = this.mergeConfig(this.config, updates)
    this.notifyWatchers()
  }

  /**
   * 获取服务器配置
   */
  getServerConfig() {
    return { ...this.config.server }
  }

  /**
   * 获取数据库配置
   */
  getDatabaseConfig() {
    return { ...this.config.database }
  }

  /**
   * 获取日志配置
   */
  getLoggingConfig() {
    return { ...this.config.logging }
  }

  /**
   * 获取 CORS 配置
   */
  getCorsConfig() {
    return { ...this.config.cors }
  }

  /**
   * 获取 GraphQL 配置
   */
  getGraphQLConfig() {
    return { ...this.config.graphql }
  }

  /**
   * 获取当前场景
   */
  getCurrentScenario(): string | undefined {
    return this.config.currentScenario
  }

  /**
   * 设置当前场景
   */
  setCurrentScenario(scenario: string): void {
    this.config.currentScenario = scenario
    this.notifyWatchers()
  }

  /**
   * 获取场景配置
   */
  getScenarios(): Record<string, string> {
    return { ...this.config.scenarios }
  }

  /**
   * 监听配置变化
   */
  watch(callback: (config: MockConfig) => void): () => void {
    this.watchers.add(callback)
    return () => {
      this.watchers.delete(callback)
    }
  }

  /**
   * 通知监听者
   */
  private notifyWatchers(): void {
    const config = this.getConfig()
    this.watchers.forEach(callback => {
      try {
        callback(config)
      } catch (error) {
        console.error('Error in config watcher:', error)
      }
    })
  }

  /**
   * 获取配置文件路径
   */
  getConfigPath(): string | undefined {
    return this.configPath
  }

  /**
   * 重新加载配置
   */
  async reload(): Promise<MockConfig> {
    if (this.configPath) {
      return this.loadConfig(this.configPath)
    }
    return this.config
  }
}

/**
 * 创建配置管理器
 */
export function createConfigManager(config?: Partial<MockConfig>): ConfigManager {
  return new ConfigManager(config)
}

