/**
 * 数据导入导出
 * 支持 JSON/YAML 格式的导入导出
 */

import { readFileSync, writeFileSync, existsSync } from 'fs'
import { resolve, dirname, extname } from 'path'
import { ensureDirSync } from 'fs-extra'
import type {
  ExportConfig,
  ImportConfig,
  ExportedData,
  MockRoute,
  RequestLog,
  MockConfig,
} from '../types/index.js'

/**
 * 数据导入导出类
 */
export class DataImportExport {
  private version = '1.0.0'

  /**
   * 导出数据
   */
  async exportData(
    data: {
      routes: MockRoute[]
      logs?: RequestLog[]
      config?: Partial<MockConfig>
    },
    config: ExportConfig
  ): Promise<void> {
    const exportedData: ExportedData = {
      metadata: {
        exportedAt: Date.now(),
        version: this.version,
        scenario: config.scenario,
        description: `Exported Mock data at ${new Date().toISOString()}`,
      },
      config: data.config,
      routes: data.routes,
      logs: config.includeMetadata ? data.logs : undefined,
    }

    // 确保输出目录存在
    const outputPath = resolve(config.output)
    ensureDirSync(dirname(outputPath))

    let content: string

    switch (config.format) {
      case 'json':
        content = this.exportToJSON(exportedData, config.compress)
        break
      case 'yaml':
        content = this.exportToYAML(exportedData)
        break
      case 'typescript':
        content = this.exportToTypeScript(exportedData)
        break
      case 'javascript':
        content = this.exportToJavaScript(exportedData)
        break
      default:
        throw new Error(`Unsupported export format: ${config.format}`)
    }

    writeFileSync(outputPath, content, 'utf-8')
  }

  /**
   * 导入数据
   */
  async importData(config: ImportConfig): Promise<ExportedData> {
    const inputPath = resolve(config.input)

    if (!existsSync(inputPath)) {
      throw new Error(`Import file not found: ${inputPath}`)
    }

    const content = readFileSync(inputPath, 'utf-8')
    const ext = extname(inputPath).toLowerCase()

    let data: ExportedData

    switch (ext) {
      case '.json':
        data = this.importFromJSON(content)
        break
      case '.yaml':
      case '.yml':
        data = this.importFromYAML(content)
        break
      case '.js':
      case '.ts':
        throw new Error('JavaScript/TypeScript imports require using jiti loader')
      default:
        throw new Error(`Unsupported import format: ${ext}`)
    }

    return data
  }

  /**
   * 导出为 JSON
   */
  private exportToJSON(data: ExportedData, compress?: boolean): string {
    return compress 
      ? JSON.stringify(data)
      : JSON.stringify(data, null, 2)
  }

  /**
   * 导出为 YAML
   */
  private exportToYAML(data: ExportedData): string {
    // 简单的 YAML 序列化（用于基本场景）
    const lines: string[] = []
    
    lines.push('# Mock Data Export')
    lines.push(`# Exported at: ${new Date(data.metadata.exportedAt).toISOString()}`)
    lines.push(`# Version: ${data.metadata.version}`)
    lines.push('')
    
    lines.push('metadata:')
    lines.push(`  exportedAt: ${data.metadata.exportedAt}`)
    lines.push(`  version: "${data.metadata.version}"`)
    if (data.metadata.scenario) {
      lines.push(`  scenario: "${data.metadata.scenario}"`)
    }
    lines.push('')
    
    lines.push('routes:')
    for (const route of data.routes) {
      lines.push(`  - path: "${route.path}"`)
      lines.push(`    method: ${route.method}`)
      if (route.status) {
        lines.push(`    status: ${route.status}`)
      }
      if (route.delay) {
        lines.push(`    delay: ${route.delay}`)
      }
      lines.push(`    response: ${JSON.stringify(route.response)}`)
      lines.push('')
    }
    
    return lines.join('\n')
  }

  /**
   * 导出为 TypeScript
   */
  private exportToTypeScript(data: ExportedData): string {
    const lines: string[] = []
    
    lines.push("import type { MockRoute, ExportedData } from '@ldesign/mock-core'")
    lines.push('')
    lines.push('/**')
    lines.push(' * Mock Data Export')
    lines.push(` * Exported at: ${new Date(data.metadata.exportedAt).toISOString()}`)
    lines.push(` * Version: ${data.metadata.version}`)
    if (data.metadata.scenario) {
      lines.push(` * Scenario: ${data.metadata.scenario}`)
    }
    lines.push(' */')
    lines.push('')
    lines.push('const data: ExportedData = {')
    lines.push(`  metadata: ${JSON.stringify(data.metadata, null, 4).replace(/\n/g, '\n  ')},`)
    lines.push('')
    
    if (data.config) {
      lines.push(`  config: ${JSON.stringify(data.config, null, 4).replace(/\n/g, '\n  ')},`)
      lines.push('')
    }
    
    lines.push(`  routes: ${JSON.stringify(data.routes, null, 4).replace(/\n/g, '\n  ')},`)
    
    if (data.logs) {
      lines.push('')
      lines.push(`  logs: ${JSON.stringify(data.logs, null, 4).replace(/\n/g, '\n  ')},`)
    }
    
    lines.push('}')
    lines.push('')
    lines.push('export default data')
    
    return lines.join('\n')
  }

  /**
   * 导出为 JavaScript
   */
  private exportToJavaScript(data: ExportedData): string {
    const lines: string[] = []
    
    lines.push('/**')
    lines.push(' * Mock Data Export')
    lines.push(` * Exported at: ${new Date(data.metadata.exportedAt).toISOString()}`)
    lines.push(` * Version: ${data.metadata.version}`)
    if (data.metadata.scenario) {
      lines.push(` * Scenario: ${data.metadata.scenario}`)
    }
    lines.push(' */')
    lines.push('')
    lines.push('export default {')
    lines.push(`  metadata: ${JSON.stringify(data.metadata, null, 4).replace(/\n/g, '\n  ')},`)
    lines.push('')
    
    if (data.config) {
      lines.push(`  config: ${JSON.stringify(data.config, null, 4).replace(/\n/g, '\n  ')},`)
      lines.push('')
    }
    
    lines.push(`  routes: ${JSON.stringify(data.routes, null, 4).replace(/\n/g, '\n  ')},`)
    
    if (data.logs) {
      lines.push('')
      lines.push(`  logs: ${JSON.stringify(data.logs, null, 4).replace(/\n/g, '\n  ')},`)
    }
    
    lines.push('}')
    
    return lines.join('\n')
  }

  /**
   * 从 JSON 导入
   */
  private importFromJSON(content: string): ExportedData {
    try {
      const data = JSON.parse(content)
      this.validateImportData(data)
      return data
    } catch (error: any) {
      throw new Error(`Failed to parse JSON: ${error.message}`)
    }
  }

  /**
   * 从 YAML 导入
   */
  private importFromYAML(content: string): ExportedData {
    // 注意：实际生产环境应该使用专业的 YAML 解析库（如 js-yaml）
    // 这里提供一个简化版本
    throw new Error('YAML import requires js-yaml package. Please install it first.')
  }

  /**
   * 验证导入数据
   */
  private validateImportData(data: any): void {
    if (!data.metadata) {
      throw new Error('Invalid import data: missing metadata')
    }
    
    if (!data.routes || !Array.isArray(data.routes)) {
      throw new Error('Invalid import data: routes must be an array')
    }
    
    // 验证版本兼容性
    if (data.metadata.version && !this.isVersionCompatible(data.metadata.version)) {
      console.warn(`Warning: Imported data version (${data.metadata.version}) may not be compatible with current version (${this.version})`)
    }
  }

  /**
   * 检查版本兼容性
   */
  private isVersionCompatible(version: string): boolean {
    // 简单的版本检查：主版本号必须相同
    const [major] = version.split('.')
    const [currentMajor] = this.version.split('.')
    return major === currentMajor
  }

  /**
   * 合并路由数据
   */
  mergeRoutes(existing: MockRoute[], imported: MockRoute[]): MockRoute[] {
    const routeMap = new Map<string, MockRoute>()
    
    // 添加已存在的路由
    for (const route of existing) {
      const key = `${route.method} ${route.path}`
      routeMap.set(key, route)
    }
    
    // 添加或更新导入的路由
    for (const route of imported) {
      const key = `${route.method} ${route.path}`
      routeMap.set(key, route)
    }
    
    return Array.from(routeMap.values())
  }

  /**
   * 批量导出多个场景
   */
  async exportScenarios(
    scenarios: Record<string, { routes: MockRoute[], config?: Partial<MockConfig> }>,
    outputDir: string,
    format: ExportConfig['format'] = 'json'
  ): Promise<void> {
    ensureDirSync(outputDir)
    
    for (const [scenarioName, data] of Object.entries(scenarios)) {
      const extension = format === 'typescript' ? 'ts' : format === 'javascript' ? 'js' : format
      const outputPath = resolve(outputDir, `${scenarioName}.${extension}`)
      
      await this.exportData(data, {
        format,
        output: outputPath,
        scenario: scenarioName,
        includeMetadata: true,
      })
    }
  }

  /**
   * 批量导入场景
   */
  async importScenarios(inputDir: string): Promise<Record<string, ExportedData>> {
    const fs = await import('fs')
    const path = await import('path')
    
    if (!fs.existsSync(inputDir)) {
      throw new Error(`Input directory not found: ${inputDir}`)
    }
    
    const scenarios: Record<string, ExportedData> = {}
    const files = fs.readdirSync(inputDir)
    
    for (const file of files) {
      const ext = path.extname(file)
      if (['.json', '.yaml', '.yml'].includes(ext)) {
        const scenarioName = path.basename(file, ext)
        const filePath = path.resolve(inputDir, file)
        
        try {
          const data = await this.importData({ input: filePath })
          scenarios[scenarioName] = data
        } catch (error: any) {
          console.error(`Failed to import ${file}:`, error.message)
        }
      }
    }
    
    return scenarios
  }
}

/**
 * 创建数据导入导出实例
 */
export function createDataImportExport(): DataImportExport {
  return new DataImportExport()
}
