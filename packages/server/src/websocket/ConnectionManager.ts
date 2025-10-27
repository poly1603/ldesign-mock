/**
 * WebSocket 连接管理器
 */

import type { WebSocketServer, WebSocket } from 'ws'
import type { WebSocketMessage } from '@ldesign/mock-core'

/**
 * WebSocket 连接管理器类
 */
export class ConnectionManager {
  private wss: WebSocketServer
  private connections: Set<WebSocket> = new Set()

  constructor(wss: WebSocketServer) {
    this.wss = wss
    this.setupHandlers()
  }

  /**
   * 设置处理器
   */
  private setupHandlers(): void {
    this.wss.on('connection', (ws: WebSocket) => {
      console.log('[WebSocket] New connection')
      this.connections.add(ws)

      // 发送欢迎消息
      this.send(ws, {
        type: 'server-status',
        data: { status: 'connected' },
        timestamp: Date.now(),
      })

      // 处理消息
      ws.on('message', (data: Buffer) => {
        try {
          const message = JSON.parse(data.toString())
          this.handleMessage(ws, message)
        } catch (error) {
          console.error('[WebSocket] Failed to parse message:', error)
        }
      })

      // 处理关闭
      ws.on('close', () => {
        console.log('[WebSocket] Connection closed')
        this.connections.delete(ws)
      })

      // 处理错误
      ws.on('error', (error) => {
        console.error('[WebSocket] Error:', error)
        this.connections.delete(ws)
      })

      // 设置心跳
      this.setupHeartbeat(ws)
    })
  }

  /**
   * 处理消息
   */
  private handleMessage(ws: WebSocket, message: any): void {
    // 处理 ping
    if (message.type === 'ping') {
      this.send(ws, {
        type: 'ping',
        data: { pong: true },
        timestamp: Date.now(),
      })
    }
  }

  /**
   * 设置心跳
   */
  private setupHeartbeat(ws: WebSocket): void {
    const interval = setInterval(() => {
      if (ws.readyState === ws.OPEN) {
        this.send(ws, {
          type: 'ping',
          data: {},
          timestamp: Date.now(),
        })
      } else {
        clearInterval(interval)
      }
    }, 30000) // 30 秒

    ws.on('close', () => {
      clearInterval(interval)
    })
  }

  /**
   * 发送消息到指定连接
   */
  send(ws: WebSocket, message: WebSocketMessage): void {
    if (ws.readyState === ws.OPEN) {
      ws.send(JSON.stringify(message))
    }
  }

  /**
   * 广播消息
   */
  broadcast(message: WebSocketMessage): void {
    const data = JSON.stringify(message)

    this.connections.forEach((ws) => {
      if (ws.readyState === ws.OPEN) {
        ws.send(data)
      }
    })
  }

  /**
   * 获取连接数
   */
  getConnectionCount(): number {
    return this.connections.size
  }

  /**
   * 关闭所有连接
   */
  closeAll(): void {
    this.connections.forEach((ws) => {
      ws.close()
    })
    this.connections.clear()
  }
}

