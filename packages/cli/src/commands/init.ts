/**
 * Init 命令 - 初始化 Mock 配置
 */

import { Command } from 'commander'
import inquirer from 'inquirer'
import chalk from 'chalk'
import ora from 'ora'
import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import { resolve } from 'path'
import boxen from 'boxen'

/**
 * Init 命令
 */
export function createInitCommand(): Command {
  const command = new Command('init')
    .description('初始化 Mock 配置文件')
    .option('-f, --force', '强制覆盖已存在的配置文件', false)
    .action(async (options) => {
      console.log(chalk.blue.bold('\n🎭 LDesign Mock 初始化\n'))

      // 检查是否已存在配置文件
      const configPath = resolve(process.cwd(), 'mock.config.js')
      if (existsSync(configPath) && !options.force) {
        console.log(chalk.yellow('⚠ 配置文件已存在: mock.config.js'))
        const { overwrite } = await inquirer.prompt([
          {
            type: 'confirm',
            name: 'overwrite',
            message: '是否覆盖现有配置文件？',
            default: false,
          },
        ])

        if (!overwrite) {
          console.log(chalk.gray('操作已取消'))
          return
        }
      }

      // 交互式配置
      const answers = await inquirer.prompt([
        {
          type: 'number',
          name: 'port',
          message: '服务器端口:',
          default: 3001,
        },
        {
          type: 'input',
          name: 'host',
          message: '服务器主机:',
          default: 'localhost',
        },
        {
          type: 'number',
          name: 'delay',
          message: '全局延迟（毫秒）:',
          default: 0,
        },
        {
          type: 'confirm',
          name: 'websocket',
          message: '启用 WebSocket？',
          default: true,
        },
        {
          type: 'confirm',
          name: 'graphql',
          message: '启用 GraphQL？',
          default: false,
        },
        {
          type: 'confirm',
          name: 'createExamples',
          message: '创建示例 Mock 文件？',
          default: true,
        },
      ])

      const spinner = ora('正在生成配置文件...').start()

      try {
        // 生成配置内容
        const configContent = `/**
 * Mock 配置文件
 */

export default {
  // 服务器配置
  server: {
    port: ${answers.port},
    host: '${answers.host}',
    delay: ${answers.delay},
    websocket: ${answers.websocket},
  },

  // Mock 文件
  files: ['mock/**/*.js', 'mock/**/*.ts'],

  // 代理配置
  proxy: {
    // '/api': {
    //   target: 'http://localhost:8080',
    //   changeOrigin: true,
    // },
  },

  // 场景切换
  scenarios: {
    success: 'mock/scenarios/success',
    error: 'mock/scenarios/error',
  },

  // 数据库配置
  database: {
    path: '.mock/data.db',
    wal: true,
  },

  // 日志配置
  logging: {
    requests: true,
    level: 'info',
  },

  // CORS 配置
  cors: {
    origin: true,
    credentials: true,
  },

  // GraphQL 配置
  graphql: {
    enabled: ${answers.graphql},
    endpoint: '/graphql',
    playground: true,
  },
}
`

        // 写入配置文件
        await writeFile(configPath, configContent, 'utf-8')

        // 创建示例文件
        if (answers.createExamples) {
          await createExampleFiles()
        }

        spinner.succeed(chalk.green('初始化完成！'))

        // 显示成功信息
        console.log(
          boxen(
            chalk.green.bold('✓ 初始化成功！\n\n') +
            chalk.white('配置文件: ') + chalk.cyan('mock.config.js\n') +
            (answers.createExamples ? chalk.white('示例文件: ') + chalk.cyan('mock/user.js\n') : '') +
            '\n' +
            chalk.white('启动服务器:\n') +
            chalk.cyan('  npx ldesign-mock start\n') +
            chalk.cyan('  或\n') +
            chalk.cyan('  pnpm lmock start'),
            {
              padding: 1,
              margin: 1,
              borderStyle: 'round',
              borderColor: 'green',
            }
          )
        )
      } catch (error: any) {
        spinner.fail(chalk.red('初始化失败'))
        console.error(chalk.red(error.message))
        process.exit(1)
      }
    })

  return command
}

/**
 * 创建示例文件
 */
async function createExampleFiles(): Promise<void> {
  const mockDir = resolve(process.cwd(), 'mock')

  if (!existsSync(mockDir)) {
    await mkdir(mockDir, { recursive: true })
  }

  // 创建用户 Mock 文件
  const userMockContent = `/**
 * 用户相关 Mock 数据
 */

export default {
  // 获取用户列表
  'GET /api/users': {
    response: {
      success: true,
      data: [
        {
          id: '@uuid',
          name: '@name',
          email: '@email',
          avatar: '@avatar',
          createdAt: '@date',
        },
      ],
    },
  },

  // 获取用户详情
  'GET /api/user/:id': (req, res) => {
    res.json({
      success: true,
      data: {
        id: req.params.id,
        name: '@name',
        email: '@email',
        phone: '@phone',
        avatar: '@avatar',
        address: '@address',
        createdAt: '@date',
      },
    })
  },

  // 创建用户
  'POST /api/user': {
    delay: 1000,
    response: {
      success: true,
      data: {
        id: '@uuid',
        name: '@name',
        email: '@email',
        createdAt: '@date',
      },
      message: '创建成功',
    },
  },

  // 更新用户
  'PUT /api/user/:id': {
    response: {
      success: true,
      message: '更新成功',
    },
  },

  // 删除用户
  'DELETE /api/user/:id': {
    response: {
      success: true,
      message: '删除成功',
    },
  },
}
`

  await writeFile(resolve(mockDir, 'user.js'), userMockContent, 'utf-8')
}

