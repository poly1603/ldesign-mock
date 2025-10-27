/**
 * Mock 场景管理器
 */

import { existsSync } from 'fs'
import { resolve } from 'path'
import type { Scenario } from '../types/index.js'

/**
 * 场景管理器类
 */
export class ScenarioManager {
  private scenarios: Map<string, Scenario> = new Map()
  private currentScenario?: string
  private watchers: Set<(scenario: string) => void> = new Set()
  private basePath: string

  constructor(basePath: string = process.cwd()) {
    this.basePath = basePath
  }

  /**
   * 注册场景
   */
  registerScenario(scenario: Scenario): void {
    this.scenarios.set(scenario.name, scenario)

    if (scenario.default && !this.currentScenario) {
      this.currentScenario = scenario.name
    }
  }

  /**
   * 批量注册场景
   */
  registerScenarios(scenarios: Scenario[]): void {
    scenarios.forEach(scenario => this.registerScenario(scenario))
  }

  /**
   * 从配置注册场景
   */
  loadFromConfig(scenariosConfig: Record<string, string>): void {
    Object.entries(scenariosConfig).forEach(([name, path]) => {
      this.registerScenario({
        name,
        path: resolve(this.basePath, path),
        default: name === 'default' || name === 'success',
      })
    })
  }

  /**
   * 获取场景
   */
  getScenario(name: string): Scenario | undefined {
    return this.scenarios.get(name)
  }

  /**
   * 获取所有场景
   */
  getAllScenarios(): Scenario[] {
    return Array.from(this.scenarios.values())
  }

  /**
   * 获取场景名称列表
   */
  getScenarioNames(): string[] {
    return Array.from(this.scenarios.keys())
  }

  /**
   * 切换场景
   */
  switchScenario(name: string): boolean {
    const scenario = this.scenarios.get(name)

    if (!scenario) {
      console.warn(`Scenario "${name}" not found`)
      return false
    }

    // 检查场景路径是否存在
    if (!existsSync(scenario.path)) {
      console.warn(`Scenario path does not exist: ${scenario.path}`)
      return false
    }

    const oldScenario = this.currentScenario
    this.currentScenario = name

    if (oldScenario !== name) {
      this.notifyWatchers(name)
    }

    return true
  }

  /**
   * 获取当前场景
   */
  getCurrentScenario(): string | undefined {
    return this.currentScenario
  }

  /**
   * 获取当前场景详情
   */
  getCurrentScenarioDetails(): Scenario | undefined {
    if (!this.currentScenario) {
      return undefined
    }
    return this.scenarios.get(this.currentScenario)
  }

  /**
   * 获取场景路径
   */
  getScenarioPath(name?: string): string | undefined {
    const scenarioName = name || this.currentScenario
    if (!scenarioName) {
      return undefined
    }

    const scenario = this.scenarios.get(scenarioName)
    return scenario?.path
  }

  /**
   * 检查场景是否存在
   */
  hasScenario(name: string): boolean {
    return this.scenarios.has(name)
  }

  /**
   * 移除场景
   */
  removeScenario(name: string): boolean {
    if (this.currentScenario === name) {
      console.warn(`Cannot remove current scenario: ${name}`)
      return false
    }

    return this.scenarios.delete(name)
  }

  /**
   * 清空所有场景
   */
  clear(): void {
    this.scenarios.clear()
    this.currentScenario = undefined
  }

  /**
   * 监听场景切换
   */
  watch(callback: (scenario: string) => void): () => void {
    this.watchers.add(callback)
    return () => {
      this.watchers.delete(callback)
    }
  }

  /**
   * 通知监听者
   */
  private notifyWatchers(scenario: string): void {
    this.watchers.forEach(callback => {
      try {
        callback(scenario)
      } catch (error) {
        console.error('Error in scenario watcher:', error)
      }
    })
  }

  /**
   * 获取场景统计
   */
  getStats() {
    return {
      total: this.scenarios.size,
      current: this.currentScenario,
      scenarios: this.getAllScenarios().map(s => ({
        name: s.name,
        description: s.description,
        default: s.default,
        exists: existsSync(s.path),
      })),
    }
  }

  /**
   * 验证场景路径
   */
  validateScenarios(): { valid: string[]; invalid: string[] } {
    const valid: string[] = []
    const invalid: string[] = []

    this.scenarios.forEach((scenario, name) => {
      if (existsSync(scenario.path)) {
        valid.push(name)
      } else {
        invalid.push(name)
      }
    })

    return { valid, invalid }
  }
}

/**
 * 创建场景管理器
 */
export function createScenarioManager(basePath?: string): ScenarioManager {
  return new ScenarioManager(basePath)
}

