/**
 * Start 命令 - 启动 Mock 服务器
 */

import { Command } from 'commander'
import chalk from 'chalk'
import ora from 'ora'
import { ConfigManager } from '@ldesign/mock-core'
import { createMockServer } from '@ldesign/mock-server'

/**
 * Start 命令
 */
export function createStartCommand(): Command {
  const command = new Command('start')
    .description('启动 Mock 服务器')
    .option('-p, --port <port>', '服务器端口', '3001')
    .option('-h, --host <host>', '服务器主机', 'localhost')
    .option('-c, --config <path>', '配置文件路径')
    .option('-w, --watch', '监听文件变化并热重载', false)
    .option('-d, --debug', '调试模式', false)
    .option('--no-websocket', '禁用 WebSocket')
    .option('--delay <ms>', '全局延迟（毫秒）')
    .action(async (options) => {
      const spinner = ora('正在启动 Mock 服务器...').start()

      try {
        // 加载配置
        const configManager = new ConfigManager()
        await configManager.loadConfig(options.config)
        const config = configManager.getConfig()

        // 覆盖命令行选项
        if (options.port) {
          config.server.port = parseInt(options.port)
        }
        if (options.host) {
          config.server.host = options.host
        }
        if (options.delay) {
          config.server.delay = parseInt(options.delay)
        }
        if (options.websocket === false) {
          config.server.websocket = false
        }

        spinner.text = '正在初始化服务器...'

        // 创建并启动服务器
        const server = createMockServer({
          config,
          watch: options.watch,
          debug: options.debug,
        })

        await server.start()

        spinner.succeed(chalk.green('Mock 服务器启动成功！'))

        // 处理退出信号
        const shutdown = async () => {
          console.log()
          spinner.start('正在停止服务器...')
          await server.stop()
          spinner.succeed('服务器已停止')
          process.exit(0)
        }

        process.on('SIGINT', shutdown)
        process.on('SIGTERM', shutdown)
      } catch (error: any) {
        spinner.fail(chalk.red('启动失败'))
        console.error(chalk.red(error.message))
        if (options.debug) {
          console.error(error)
        }
        process.exit(1)
      }
    })

  return command
}

