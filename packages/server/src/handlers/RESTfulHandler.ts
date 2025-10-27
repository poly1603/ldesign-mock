/**
 * RESTful API 处理器
 */

import type { Request, Response, NextFunction } from 'express'
import { pathToRegexp, match as pathMatch } from 'path-to-regexp'
import fg from 'fast-glob'
import { resolve, dirname } from 'path'
import { pathToFileURL } from 'url'
import type {
  MockRoute,
  MockHandler,
  HttpMethod,
  MockFileDefinition,
} from '@ldesign/mock-core'
import type { DataGenerator, MockDatabase, ScenarioManager } from '@ldesign/mock-core'

interface RESTfulHandlerOptions {
  dataGenerator: DataGenerator
  database: MockDatabase
  scenarioManager: ScenarioManager
}

/**
 * RESTful 处理器类
 */
export class RESTfulHandler {
  private routes: Map<string, MockRoute> = new Map()
  private dataGenerator: DataGenerator
  private database: MockDatabase
  private scenarioManager: ScenarioManager

  constructor(options: RESTfulHandlerOptions) {
    this.dataGenerator = options.dataGenerator
    this.database = options.database
    this.scenarioManager = options.scenarioManager
  }

  /**
   * 加载 Mock 路由文件
   */
  async loadRoutes(patterns: string[]): Promise<void> {
    this.routes.clear()

    const files = await fg(patterns, {
      cwd: process.cwd(),
      absolute: true,
      ignore: ['**/node_modules/**'],
    })

    for (const file of files) {
      await this.loadFile(file)
    }

    console.log(`Loaded ${this.routes.size} mock routes`)
  }

  /**
   * 加载单个文件
   */
  private async loadFile(filePath: string): Promise<void> {
    try {
      // 使用动态 import
      const module = await import(pathToFileURL(filePath).href)
      const definitions: MockFileDefinition = module.default || module

      for (const [key, value] of Object.entries(definitions)) {
        this.parseRoute(key, value)
      }
    } catch (error) {
      console.warn(`Failed to load mock file ${filePath}:`, error)
    }
  }

  /**
   * 解析路由定义
   */
  private parseRoute(key: string, value: any): void {
    // 解析 "METHOD /path" 格式
    const parts = key.trim().split(/\s+/)

    if (parts.length < 2) {
      console.warn(`Invalid route key: ${key}`)
      return
    }

    const method = parts[0].toUpperCase() as HttpMethod
    const path = parts.slice(1).join(' ')

    // 如果是完整的 MockRoute 对象
    if (value && typeof value === 'object' && 'response' in value) {
      const route: MockRoute = {
        method,
        path,
        ...value,
      }
      this.routes.set(this.getRouteKey(method, path), route)
    } else {
      // 简单的响应数据或函数
      const route: MockRoute = {
        method,
        path,
        response: value,
        status: 200,
        enabled: true,
      }
      this.routes.set(this.getRouteKey(method, path), route)
    }
  }

  /**
   * 获取路由键
   */
  private getRouteKey(method: HttpMethod, path: string): string {
    return `${method}:${path}`
  }

  /**
   * 中间件
   */
  middleware() {
    return async (req: Request, res: Response, next: NextFunction) => {
      // 跳过 API 路由
      if (req.path.startsWith('/api/')) {
        return next()
      }

      const method = req.method as HttpMethod
      const matchedRoute = this.matchRoute(method, req.path)

      if (!matchedRoute) {
        return next()
      }

      const { route, params } = matchedRoute

      // 检查路由是否启用
      if (route.enabled === false) {
        return next()
      }

      // 检查场景
      const currentScenario = this.scenarioManager.getCurrentScenario()
      if (route.scenario && route.scenario !== currentScenario) {
        return next()
      }

      // 设置路由参数
      req.params = { ...req.params, ...params }

      // 处理延迟
      if (route.delay) {
        await this.delay(route.delay)
      }

      // 处理响应
      try {
        const response = await this.handleResponse(route, req, res)

        // 设置响应头
        if (route.headers) {
          Object.entries(route.headers).forEach(([key, value]) => {
            res.setHeader(key, value)
          })
        }

        // 设置状态码
        res.status(route.status || 200)

        // 发送响应
        if (response !== undefined) {
          res.json(response)
        }
      } catch (error: any) {
        console.error('Error handling mock route:', error)
        res.status(500).json({
          success: false,
          message: error.message || 'Internal Server Error',
        })
      }
    }
  }

  /**
   * 匹配路由
   */
  private matchRoute(
    method: HttpMethod,
    path: string
  ): { route: MockRoute; params: Record<string, any> } | null {
    for (const [key, route] of this.routes.entries()) {
      if (route.method !== method) {
        continue
      }

      // 精确匹配
      if (route.path === path) {
        return { route, params: {} }
      }

      // 动态路由匹配
      try {
        const matchFn = pathMatch(route.path, { decode: decodeURIComponent })
        const matched = matchFn(path)

        if (matched) {
          return {
            route,
            params: matched.params as Record<string, any>,
          }
        }
      } catch (error) {
        // 忽略无效的路径模式
      }
    }

    return null
  }

  /**
   * 处理响应
   */
  private async handleResponse(
    route: MockRoute,
    req: Request,
    res: Response
  ): Promise<any> {
    const { response } = route

    // 如果是函数，执行它
    if (typeof response === 'function') {
      const result = await response(req, res, () => { })
      return result
    }

    // 如果是对象或数组，生成数据
    if (typeof response === 'object') {
      return this.dataGenerator.generate(response)
    }

    // 其他情况直接返回
    return response
  }

  /**
   * 延迟
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  /**
   * 获取所有路由
   */
  getRoutes(): MockRoute[] {
    return Array.from(this.routes.values())
  }

  /**
   * 获取路由数量
   */
  getRouteCount(): number {
    return this.routes.size
  }

  /**
   * 添加路由
   */
  addRoute(method: HttpMethod, path: string, response: any): void {
    const route: MockRoute = {
      method,
      path,
      response,
      status: 200,
      enabled: true,
    }
    this.routes.set(this.getRouteKey(method, path), route)
  }

  /**
   * 删除路由
   */
  removeRoute(method: HttpMethod, path: string): boolean {
    return this.routes.delete(this.getRouteKey(method, path))
  }

  /**
   * 清空所有路由
   */
  clearRoutes(): void {
    this.routes.clear()
  }
}

