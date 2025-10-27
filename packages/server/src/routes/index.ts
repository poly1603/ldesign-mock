/**
 * API 路由
 */

import type { Express, Request, Response } from 'express'
import type {
  MockDatabase,
  ScenarioManager,
  ConfigManager,
} from '@ldesign/mock-core'
import type { RESTfulHandler } from '../handlers/RESTfulHandler.js'

interface RouteSetupOptions {
  database: MockDatabase
  scenarioManager: ScenarioManager
  configManager: ConfigManager
  restfulHandler: RESTfulHandler
}

/**
 * 设置 API 路由
 */
export function setupApiRoutes(app: Express, options: RouteSetupOptions): void {
  const { database, scenarioManager, configManager, restfulHandler } = options

  // 健康检查
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({
      success: true,
      data: {
        status: 'ok',
        timestamp: Date.now(),
      },
    })
  })

  // 获取统计信息
  app.get('/api/stats', (req: Request, res: Response) => {
    try {
      const stats = database.getRequestStats(scenarioManager.getCurrentScenario())
      const routes = restfulHandler.getRoutes()

      res.json({
        success: true,
        data: {
          ...stats,
          routes: routes.length,
          scenario: scenarioManager.getCurrentScenario(),
        },
      })
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      })
    }
  })

  // 获取请求日志
  app.get('/api/logs', (req: Request, res: Response) => {
    try {
      const limit = parseInt(req.query.limit as string) || 100
      const offset = parseInt(req.query.offset as string) || 0
      const logs = database.getRequestLogs({ limit, offset })

      res.json({
        success: true,
        data: logs,
      })
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      })
    }
  })

  // 清空请求日志
  app.delete('/api/logs', (req: Request, res: Response) => {
    try {
      const count = database.clearRequestLogs()
      res.json({
        success: true,
        data: { deleted: count },
      })
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      })
    }
  })

  // 获取所有场景
  app.get('/api/scenarios', (req: Request, res: Response) => {
    try {
      const scenarios = scenarioManager.getAllScenarios()
      const current = scenarioManager.getCurrentScenario()

      res.json({
        success: true,
        data: {
          scenarios,
          current,
        },
      })
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      })
    }
  })

  // 切换场景
  app.post('/api/scenarios/:name', (req: Request, res: Response) => {
    try {
      const { name } = req.params
      const success = scenarioManager.switchScenario(name)

      if (success) {
        configManager.setCurrentScenario(name)
        res.json({
          success: true,
          data: { scenario: name },
        })
      } else {
        res.status(404).json({
          success: false,
          message: `Scenario "${name}" not found`,
        })
      }
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      })
    }
  })

  // 获取配置
  app.get('/api/config', (req: Request, res: Response) => {
    try {
      const config = configManager.getConfig()
      res.json({
        success: true,
        data: config,
      })
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      })
    }
  })

  // 更新配置
  app.patch('/api/config', (req: Request, res: Response) => {
    try {
      configManager.updateConfig(req.body)
      res.json({
        success: true,
        data: configManager.getConfig(),
      })
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      })
    }
  })

  // 获取所有 Mock 路由
  app.get('/api/mocks', (req: Request, res: Response) => {
    try {
      const routes = restfulHandler.getRoutes()
      res.json({
        success: true,
        data: routes,
      })
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      })
    }
  })

  // 添加 Mock 路由
  app.post('/api/mocks', (req: Request, res: Response) => {
    try {
      const { method, path, response } = req.body
      restfulHandler.addRoute(method, path, response)

      res.json({
        success: true,
        message: 'Mock route added',
      })
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      })
    }
  })

  // 删除 Mock 路由
  app.delete('/api/mocks', (req: Request, res: Response) => {
    try {
      const { method, path } = req.body
      const success = restfulHandler.removeRoute(method, path)

      res.json({
        success,
        message: success ? 'Mock route deleted' : 'Mock route not found',
      })
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      })
    }
  })
}

