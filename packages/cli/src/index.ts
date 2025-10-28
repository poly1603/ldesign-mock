/**
 * @ldesign/mock CLI 入口
 */

import { Command } from 'commander'
import chalk from 'chalk'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { createStartCommand } from './commands/start.js'
import { createInitCommand } from './commands/init.js'
import { createScenarioCommand } from './commands/scenario.js'
import { createExportCommand } from './commands/export.js'
import { createImportCommand } from './commands/import.js'
import { createRecordCommand } from './commands/record.js'

// ESM __dirname
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// 读取 package.json
const packageJsonPath = resolve(__dirname, '../package.json')
let version = '1.0.0'
try {
  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'))
  version = packageJson.version
} catch {
  // 使用默认版本
}

/**
 * 创建 CLI 程序
 */
function createProgram(): Command {
  const program = new Command()

  program
    .name('ldesign-mock')
    .description('🎭 强大的 Mock 数据管理工具')
    .version(version, '-v, --version', '显示版本号')
    .helpOption('-h, --help', '显示帮助信息')

  // 注册命令
  program.addCommand(createStartCommand())
  program.addCommand(createInitCommand())
  program.addCommand(createScenarioCommand())
  program.addCommand(createExportCommand())
  program.addCommand(createImportCommand())
  program.addCommand(createRecordCommand())

  // 错误处理
  program.exitOverride()

  return program
}

/**
 * 主函数
 */
async function main(): Promise<void> {
  const program = createProgram()

  try {
    await program.parseAsync(process.argv)
  } catch (error: any) {
    // 如果是 Commander.js 的帮助或版本请求，正常退出
    if (error.code === 'commander.help' || error.code === 'commander.version') {
      process.exit(0)
    }

    // 其他错误
    console.error(chalk.red('Error:'), error.message)
    if (process.env.DEBUG) {
      console.error(error)
    }
    process.exit(1)
  }
}

// 启动 CLI
main().catch((error) => {
  console.error(chalk.red('Fatal Error:'), error.message)
  process.exit(1)
})

