/**
 * Mock 数据持久化
 * 使用 better-sqlite3
 */

import Database from 'better-sqlite3'
import { existsSync, mkdirSync } from 'fs'
import { dirname, resolve } from 'path'
import type { MockDataItem, RequestLog, HttpMethod } from '../types/index.js'

/**
 * Mock 数据库类
 */
export class MockDatabase {
  private db: Database.Database
  private dbPath: string

  constructor(dbPath: string = '.mock/data.db') {
    this.dbPath = resolve(process.cwd(), dbPath)

    // 确保目录存在
    const dir = dirname(this.dbPath)
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true })
    }

    // 初始化数据库
    this.db = new Database(this.dbPath)
    this.db.pragma('journal_mode = WAL')
    this.initialize()
  }

  /**
   * 初始化数据库表
   */
  private initialize(): void {
    // Mock 数据表
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS mock_data (
        id TEXT PRIMARY KEY,
        route_key TEXT NOT NULL,
        method TEXT NOT NULL,
        path TEXT NOT NULL,
        data TEXT NOT NULL,
        scenario TEXT,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
      )
    `)

    // 请求日志表
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS request_logs (
        id TEXT PRIMARY KEY,
        timestamp INTEGER NOT NULL,
        method TEXT NOT NULL,
        path TEXT NOT NULL,
        query TEXT,
        body TEXT,
        status INTEGER NOT NULL,
        response TEXT,
        duration INTEGER NOT NULL,
        scenario TEXT
      )
    `)

    // 创建索引
    this.db.exec(`
      CREATE INDEX IF NOT EXISTS idx_mock_data_route ON mock_data(route_key, scenario);
      CREATE INDEX IF NOT EXISTS idx_request_logs_timestamp ON request_logs(timestamp DESC);
      CREATE INDEX IF NOT EXISTS idx_request_logs_path ON request_logs(path);
    `)
  }

  /**
   * 保存 Mock 数据
   */
  saveMockData(item: MockDataItem): void {
    const stmt = this.db.prepare(`
      INSERT OR REPLACE INTO mock_data 
      (id, route_key, method, path, data, scenario, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `)

    stmt.run(
      item.id,
      item.routeKey,
      item.method,
      item.path,
      JSON.stringify(item.data),
      item.scenario || null,
      item.createdAt,
      item.updatedAt
    )
  }

  /**
   * 获取 Mock 数据
   */
  getMockData(routeKey: string, scenario?: string): MockDataItem | undefined {
    const stmt = this.db.prepare(`
      SELECT * FROM mock_data 
      WHERE route_key = ? AND (scenario = ? OR scenario IS NULL)
      ORDER BY scenario DESC
      LIMIT 1
    `)

    const row = stmt.get(routeKey, scenario || null) as any

    if (!row) {
      return undefined
    }

    return this.rowToMockDataItem(row)
  }

  /**
   * 获取所有 Mock 数据
   */
  getAllMockData(scenario?: string): MockDataItem[] {
    const stmt = scenario
      ? this.db.prepare('SELECT * FROM mock_data WHERE scenario = ? OR scenario IS NULL')
      : this.db.prepare('SELECT * FROM mock_data')

    const rows = (scenario ? stmt.all(scenario) : stmt.all()) as any[]

    return rows.map(row => this.rowToMockDataItem(row))
  }

  /**
   * 删除 Mock 数据
   */
  deleteMockData(id: string): boolean {
    const stmt = this.db.prepare('DELETE FROM mock_data WHERE id = ?')
    const result = stmt.run(id)
    return result.changes > 0
  }

  /**
   * 清空 Mock 数据
   */
  clearMockData(scenario?: string): number {
    const stmt = scenario
      ? this.db.prepare('DELETE FROM mock_data WHERE scenario = ?')
      : this.db.prepare('DELETE FROM mock_data')

    const result = scenario ? stmt.run(scenario) : stmt.run()
    return result.changes
  }

  /**
   * 保存请求日志
   */
  saveRequestLog(log: RequestLog): void {
    const stmt = this.db.prepare(`
      INSERT INTO request_logs 
      (id, timestamp, method, path, query, body, status, response, duration, scenario)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)

    stmt.run(
      log.id,
      log.timestamp,
      log.method,
      log.path,
      JSON.stringify(log.query),
      log.body ? JSON.stringify(log.body) : null,
      log.status,
      log.response ? JSON.stringify(log.response) : null,
      log.duration,
      log.scenario || null
    )
  }

  /**
   * 获取请求日志
   */
  getRequestLogs(options: {
    limit?: number
    offset?: number
    method?: HttpMethod
    path?: string
    scenario?: string
  } = {}): RequestLog[] {
    const { limit = 100, offset = 0, method, path, scenario } = options

    let query = 'SELECT * FROM request_logs WHERE 1=1'
    const params: any[] = []

    if (method) {
      query += ' AND method = ?'
      params.push(method)
    }

    if (path) {
      query += ' AND path LIKE ?'
      params.push(`%${path}%`)
    }

    if (scenario) {
      query += ' AND scenario = ?'
      params.push(scenario)
    }

    query += ' ORDER BY timestamp DESC LIMIT ? OFFSET ?'
    params.push(limit, offset)

    const stmt = this.db.prepare(query)
    const rows = stmt.all(...params) as any[]

    return rows.map(row => this.rowToRequestLog(row))
  }

  /**
   * 获取请求统计
   */
  getRequestStats(scenario?: string) {
    const whereClause = scenario ? 'WHERE scenario = ?' : ''
    const params = scenario ? [scenario] : []

    const totalStmt = this.db.prepare(`
      SELECT COUNT(*) as total FROM request_logs ${whereClause}
    `)
    const total = (totalStmt.get(...params) as any).total

    const successStmt = this.db.prepare(`
      SELECT COUNT(*) as count FROM request_logs 
      ${whereClause}${whereClause ? ' AND' : 'WHERE'} status >= 200 AND status < 400
    `)
    const success = (successStmt.get(...params) as any).count

    const avgTimeStmt = this.db.prepare(`
      SELECT AVG(duration) as avg FROM request_logs ${whereClause}
    `)
    const avgTime = (avgTimeStmt.get(...params) as any).avg || 0

    const byMethodStmt = this.db.prepare(`
      SELECT method, COUNT(*) as count 
      FROM request_logs ${whereClause}
      GROUP BY method
    `)
    const byMethod = byMethodStmt.all(...params) as any[]

    return {
      total,
      success,
      failed: total - success,
      avgResponseTime: Math.round(avgTime),
      byMethod: byMethod.reduce((acc, row) => {
        acc[row.method] = row.count
        return acc
      }, {} as Record<string, number>),
    }
  }

  /**
   * 清空请求日志
   */
  clearRequestLogs(olderThan?: number): number {
    const stmt = olderThan
      ? this.db.prepare('DELETE FROM request_logs WHERE timestamp < ?')
      : this.db.prepare('DELETE FROM request_logs')

    const result = olderThan ? stmt.run(olderThan) : stmt.run()
    return result.changes
  }

  /**
   * 转换行数据为 MockDataItem
   */
  private rowToMockDataItem(row: any): MockDataItem {
    return {
      id: row.id,
      routeKey: row.route_key,
      method: row.method,
      path: row.path,
      data: JSON.parse(row.data),
      scenario: row.scenario,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }
  }

  /**
   * 转换行数据为 RequestLog
   */
  private rowToRequestLog(row: any): RequestLog {
    return {
      id: row.id,
      timestamp: row.timestamp,
      method: row.method,
      path: row.path,
      query: JSON.parse(row.query || '{}'),
      body: row.body ? JSON.parse(row.body) : undefined,
      status: row.status,
      response: row.response ? JSON.parse(row.response) : undefined,
      duration: row.duration,
      scenario: row.scenario,
    }
  }

  /**
   * 关闭数据库
   */
  close(): void {
    this.db.close()
  }

  /**
   * 获取数据库路径
   */
  getPath(): string {
    return this.dbPath
  }

  /**
   * 执行数据库备份
   */
  backup(destPath: string): void {
    this.db.backup(destPath)
  }
}

/**
 * 创建 Mock 数据库
 */
export function createMockDatabase(dbPath?: string): MockDatabase {
  return new MockDatabase(dbPath)
}

