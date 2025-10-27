/**
 * 请求拦截器
 */

import type { Request, Response, NextFunction } from 'express'
import { randomUUID } from 'crypto'
import type { MockDatabase, ScenarioManager, RequestLog, HttpMethod } from '@ldesign/mock-core'

interface RequestInterceptorOptions {
  database: MockDatabase
  scenarioManager: ScenarioManager
  delay?: number
}

/**
 * 请求拦截器类
 */
export class RequestInterceptor {
  private database: MockDatabase
  private scenarioManager: ScenarioManager
  private globalDelay: number

  constructor(options: RequestInterceptorOptions) {
    this.database = options.database
    this.scenarioManager = options.scenarioManager
    this.globalDelay = options.delay || 0
  }

  /**
   * 中间件
   */
  middleware() {
    return async (req: Request, res: Response, next: NextFunction) => {
      const startTime = Date.now()
      const requestId = randomUUID()
      const database = this.database
      const scenarioManager = this.scenarioManager

      // 记录原始的 res.json 方法
      const originalJson = res.json.bind(res)

      // 重写 res.json 以捕获响应
      res.json = function (body: any) {
        const duration = Date.now() - startTime

        // 保存请求日志
        const log: RequestLog = {
          id: requestId,
          timestamp: startTime,
          method: req.method as HttpMethod,
          path: req.path,
          query: req.query as Record<string, any>,
          body: req.body,
          status: res.statusCode,
          response: body,
          duration,
          scenario: scenarioManager.getCurrentScenario(),
        }

        database.saveRequestLog(log)

        return originalJson(body)
      }

      // 应用全局延迟
      if (this.globalDelay > 0) {
        await this.delay(this.globalDelay)
      }

      next()
    }
  }

  /**
   * 延迟
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  /**
   * 更新全局延迟
   */
  setGlobalDelay(delay: number): void {
    this.globalDelay = delay
  }

  /**
   * 获取全局延迟
   */
  getGlobalDelay(): number {
    return this.globalDelay
  }
}

