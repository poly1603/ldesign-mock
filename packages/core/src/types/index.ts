/**
 * Mock 工具核心类型定义
 */

import type { Request, Response, NextFunction } from 'express'

/**
 * HTTP 方法类型
 */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS'

/**
 * Mock 配置
 */
export interface MockConfig {
  /** 服务器配置 */
  server: ServerConfig
  /** Mock 文件路径 */
  files: string[]
  /** 代理配置 */
  proxy?: ProxyConfig
  /** 场景配置 */
  scenarios?: Record<string, string>
  /** 当前场景 */
  currentScenario?: string
  /** 数据库配置 */
  database?: DatabaseConfig
  /** 日志配置 */
  logging?: LoggingConfig
  /** CORS 配置 */
  cors?: CorsConfig
  /** GraphQL 配置 */
  graphql?: GraphQLConfig
}

/**
 * 服务器配置
 */
export interface ServerConfig {
  /** 端口 */
  port: number
  /** 主机 */
  host: string
  /** 全局延迟（毫秒） */
  delay?: number
  /** 是否启用 WebSocket */
  websocket?: boolean
  /** 静态文件目录 */
  static?: string
}

/**
 * 代理配置
 */
export interface ProxyConfig {
  [path: string]: {
    target: string
    changeOrigin?: boolean
    pathRewrite?: Record<string, string>
    onProxyReq?: (proxyReq: any, req: any, res: any) => void
    onProxyRes?: (proxyRes: any, req: any, res: any) => void
  }
}

/**
 * 数据库配置
 */
export interface DatabaseConfig {
  /** 数据库文件路径 */
  path: string
  /** 是否启用 WAL 模式 */
  wal?: boolean
  /** 是否详细日志 */
  verbose?: boolean
}

/**
 * 日志配置
 */
export interface LoggingConfig {
  /** 是否启用请求日志 */
  requests?: boolean
  /** 日志级别 */
  level?: 'debug' | 'info' | 'warn' | 'error'
  /** 日志文件路径 */
  file?: string
}

/**
 * CORS 配置
 */
export interface CorsConfig {
  origin?: string | string[] | boolean
  credentials?: boolean
  methods?: string[]
  allowedHeaders?: string[]
}

/**
 * GraphQL 配置
 */
export interface GraphQLConfig {
  /** 是否启用 */
  enabled: boolean
  /** GraphQL 端点 */
  endpoint?: string
  /** Schema 文件路径 */
  schema?: string
  /** Playground 配置 */
  playground?: boolean
}

/**
 * Mock 路由定义
 */
export interface MockRoute {
  /** 路由路径 */
  path: string
  /** HTTP 方法 */
  method: HttpMethod
  /** 响应数据或处理函数 */
  response: any | MockHandler
  /** 延迟（毫秒） */
  delay?: number
  /** 状态码 */
  status?: number
  /** 响应头 */
  headers?: Record<string, string>
  /** 场景名称 */
  scenario?: string
  /** 描述 */
  description?: string
  /** 是否启用 */
  enabled?: boolean
}

/**
 * Mock 处理函数
 */
export type MockHandler = (req: Request, res: Response, next: NextFunction) => any | Promise<any>

/**
 * Mock 文件定义
 */
export interface MockFileDefinition {
  [key: string]: any | MockHandler | MockRoute
}

/**
 * 场景定义
 */
export interface Scenario {
  /** 场景名称 */
  name: string
  /** 场景描述 */
  description?: string
  /** 场景对应的文件或目录 */
  path: string
  /** 是否为默认场景 */
  default?: boolean
}

/**
 * 数据生成器配置
 */
export interface GeneratorConfig {
  /** 语言环境 */
  locale?: string
  /** 随机种子 */
  seed?: number
  /** 自定义生成器 */
  customGenerators?: Record<string, GeneratorFunction>
}

/**
 * 生成器函数
 */
export type GeneratorFunction = (faker: any, params?: any) => any

/**
 * 请求日志
 */
export interface RequestLog {
  /** ID */
  id: string
  /** 时间戳 */
  timestamp: number
  /** 方法 */
  method: HttpMethod
  /** 路径 */
  path: string
  /** 查询参数 */
  query: Record<string, any>
  /** 请求体 */
  body?: any
  /** 响应状态码 */
  status: number
  /** 响应数据 */
  response?: any
  /** 延迟（毫秒） */
  duration: number
  /** 场景 */
  scenario?: string
}

/**
 * Mock 数据项
 */
export interface MockDataItem {
  /** ID */
  id: string
  /** 路由键 */
  routeKey: string
  /** 方法 */
  method: HttpMethod
  /** 路径 */
  path: string
  /** 数据 */
  data: any
  /** 创建时间 */
  createdAt: number
  /** 更新时间 */
  updatedAt: number
  /** 场景 */
  scenario?: string
}

/**
 * 延迟配置
 */
export interface DelayConfig {
  /** 最小延迟 */
  min?: number
  /** 最大延迟 */
  max?: number
  /** 固定延迟 */
  fixed?: number
}

/**
 * 错误模拟配置
 */
export interface ErrorSimulation {
  /** 错误率（0-1） */
  rate: number
  /** 错误状态码 */
  status?: number
  /** 错误消息 */
  message?: string
  /** 错误类型 */
  type?: 'network' | 'timeout' | 'server' | 'client'
}

/**
 * Mock 服务器选项
 */
export interface MockServerOptions {
  /** 配置 */
  config: MockConfig
  /** 是否监听配置变化 */
  watch?: boolean
  /** 调试模式 */
  debug?: boolean
}

/**
 * WebSocket 消息类型
 */
export type WebSocketMessageType =
  | 'request-log'
  | 'config-update'
  | 'scenario-change'
  | 'server-status'
  | 'error'
  | 'ping'

/**
 * WebSocket 消息
 */
export interface WebSocketMessage<T = any> {
  type: WebSocketMessageType
  data: T
  timestamp: number
}

/**
 * 统计信息
 */
export interface MockStats {
  /** 总请求数 */
  totalRequests: number
  /** 成功请求数 */
  successRequests: number
  /** 失败请求数 */
  failedRequests: number
  /** 平均响应时间 */
  avgResponseTime: number
  /** 按路由统计 */
  byRoute: Record<string, RouteStats>
  /** 按方法统计 */
  byMethod: Record<HttpMethod, number>
  /** 启动时间 */
  startTime: number
  /** 当前场景 */
  currentScenario?: string
}

/**
 * 路由统计
 */
export interface RouteStats {
  /** 请求数 */
  count: number
  /** 平均响应时间 */
  avgTime: number
  /** 最后请求时间 */
  lastRequest: number
}

/**
 * GraphQL Schema 定义
 */
export interface GraphQLSchemaDefinition {
  /** Type definitions */
  typeDefs: string
  /** Resolvers */
  resolvers: Record<string, any>
}

