/**
 * @ldesign/mock-core
 * Mock 工具核心功能模块
 */

// 导出类型
export * from './types/index.js'

// 导出配置管理器
export { ConfigManager, createConfigManager } from './config/ConfigManager.js'

// 导出数据生成器
export {
  DataGenerator,
  createDataGenerator,
  defaultGenerator,
} from './generator/DataGenerator.js'

// 导出场景管理器
export { ScenarioManager, createScenarioManager } from './scenario/ScenarioManager.js'

// 导出数据库
export { MockDatabase, createMockDatabase } from './database/MockDatabase.js'

