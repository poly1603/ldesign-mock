/**
 * 请求录制器
 * 用于录制真实 API 请求并转换为 Mock 配置
 */

import { EventEmitter } from 'events'
import type {
  RecordConfig,
  RecordSession,
  RecordedRequest,
  RecordFilter,
  HttpMethod,
} from '../types/index.js'

/**
 * 请求录制器类
 */
export class RequestRecorder extends EventEmitter {
  private sessions: Map<string, RecordSession> = new Map()
  private currentSessionId?: string

  constructor() {
    super()
  }

  /**
   * 开始录制
   */
  startRecording(config: RecordConfig): string {
    const sessionId = this.generateSessionId()
    const session: RecordSession = {
      id: sessionId,
      target: config.target,
      startTime: Date.now(),
      requests: [],
      status: 'recording',
    }

    this.sessions.set(sessionId, session)
    this.currentSessionId = sessionId

    this.emit('recording-started', session)

    // 如果设置了录制时长，自动停止
    if (config.duration) {
      setTimeout(() => {
        this.stopRecording(sessionId)
      }, config.duration)
    }

    return sessionId
  }

  /**
   * 停止录制
   */
  stopRecording(sessionId?: string): RecordSession | null {
    const id = sessionId || this.currentSessionId
    if (!id) return null

    const session = this.sessions.get(id)
    if (!session) return null

    session.status = 'stopped'
    session.endTime = Date.now()

    this.emit('recording-stopped', session)

    if (id === this.currentSessionId) {
      this.currentSessionId = undefined
    }

    return session
  }

  /**
   * 记录请求
   */
  recordRequest(
    sessionId: string,
    request: Omit<RecordedRequest, 'id' | 'timestamp'>,
    filter?: RecordFilter
  ): void {
    const session = this.sessions.get(sessionId)
    if (!session || session.status !== 'recording') {
      return
    }

    // 应用过滤规则
    if (filter && !this.shouldRecordRequest(request, filter)) {
      return
    }

    const recordedRequest: RecordedRequest = {
      id: this.generateRequestId(),
      timestamp: Date.now(),
      ...request,
    }

    session.requests.push(recordedRequest)

    this.emit('request-recorded', recordedRequest)
  }

  /**
   * 判断是否应该录制请求
   */
  private shouldRecordRequest(
    request: Omit<RecordedRequest, 'id' | 'timestamp'>,
    filter: RecordFilter
  ): boolean {
    // 检查方法过滤
    if (filter.methods && !filter.methods.includes(request.method)) {
      return false
    }

    // 检查状态码过滤
    if (filter.statusCodes && !filter.statusCodes.includes(request.status)) {
      return false
    }

    // 检查排除路径
    if (filter.excludePaths) {
      for (const pattern of filter.excludePaths) {
        if (this.matchPath(request.path, pattern)) {
          return false
        }
      }
    }

    // 检查包含路径
    if (filter.paths && filter.paths.length > 0) {
      let matched = false
      for (const pattern of filter.paths) {
        if (this.matchPath(request.path, pattern)) {
          matched = true
          break
        }
      }
      if (!matched) return false
    }

    return true
  }

  /**
   * 路径匹配
   */
  private matchPath(path: string, pattern: string): boolean {
    // 简单的通配符匹配
    const regex = new RegExp(
      '^' + pattern.replace(/\*/g, '.*').replace(/\?/g, '.') + '$'
    )
    return regex.test(path)
  }

  /**
   * 获取会话
   */
  getSession(sessionId: string): RecordSession | undefined {
    return this.sessions.get(sessionId)
  }

  /**
   * 获取当前会话
   */
  getCurrentSession(): RecordSession | undefined {
    if (!this.currentSessionId) return undefined
    return this.sessions.get(this.currentSessionId)
  }

  /**
   * 获取所有会话
   */
  getAllSessions(): RecordSession[] {
    return Array.from(this.sessions.values())
  }

  /**
   * 清除会话
   */
  clearSession(sessionId: string): boolean {
    return this.sessions.delete(sessionId)
  }

  /**
   * 清除所有会话
   */
  clearAllSessions(): void {
    this.sessions.clear()
    this.currentSessionId = undefined
  }

  /**
   * 将会话转换为 Mock 路由配置
   */
  convertToMockRoutes(sessionId: string): Record<string, any> {
    const session = this.sessions.get(sessionId)
    if (!session) {
      throw new Error(`Session not found: ${sessionId}`)
    }

    const routes: Record<string, any> = {}

    for (const request of session.requests) {
      const key = `${request.method} ${request.path}`
      
      // 如果路由已存在，跳过（使用第一次录制的数据）
      if (routes[key]) {
        continue
      }

      routes[key] = {
        status: request.status,
        response: request.response,
        delay: request.duration,
        headers: this.filterResponseHeaders(request.responseHeaders),
      }
    }

    return routes
  }

  /**
   * 过滤响应头（移除不需要的头）
   */
  private filterResponseHeaders(headers: Record<string, string>): Record<string, string> {
    const filtered: Record<string, string> = {}
    const keepHeaders = ['content-type', 'cache-control', 'x-']

    for (const [key, value] of Object.entries(headers)) {
      const lowerKey = key.toLowerCase()
      if (keepHeaders.some(prefix => lowerKey.startsWith(prefix))) {
        filtered[key] = value
      }
    }

    return filtered
  }

  /**
   * 导出会话为 Mock 文件内容
   */
  exportSession(sessionId: string, format: 'json' | 'js' | 'ts' = 'js'): string {
    const routes = this.convertToMockRoutes(sessionId)
    const session = this.sessions.get(sessionId)

    if (format === 'json') {
      return JSON.stringify(routes, null, 2)
    }

    // JavaScript/TypeScript 格式
    const isTypescript = format === 'ts'
    const lines: string[] = []

    lines.push('/**')
    lines.push(` * Mock routes - Recorded from ${session?.target}`)
    lines.push(` * Recorded at: ${new Date(session?.startTime || Date.now()).toISOString()}`)
    lines.push(` * Total requests: ${session?.requests.length || 0}`)
    lines.push(' */')
    lines.push('')

    if (isTypescript) {
      lines.push("import type { MockFileDefinition } from '@ldesign/mock-core'")
      lines.push('')
      lines.push('const routes: MockFileDefinition = {')
    } else {
      lines.push('export default {')
    }

    for (const [key, value] of Object.entries(routes)) {
      lines.push(`  '${key}': ${JSON.stringify(value, null, 4).replace(/\n/g, '\n  ')},`)
      lines.push('')
    }

    if (isTypescript) {
      lines.push('}')
      lines.push('')
      lines.push('export default routes')
    } else {
      lines.push('}')
    }

    return lines.join('\n')
  }

  /**
   * 生成会话 ID
   */
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
  }

  /**
   * 生成请求 ID
   */
  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
  }
}

/**
 * 创建请求录制器
 */
export function createRequestRecorder(): RequestRecorder {
  return new RequestRecorder()
}
