/**
 * Import 命令 - 导入 Mock 数据
 */

import { Command } from 'commander'
import chalk from 'chalk'
import ora from 'ora'
import inquirer from 'inquirer'
import { resolve } from 'path'
import { existsSync } from 'fs'
import { DataImportExport } from '@ldesign/mock-core'

/**
 * Import 命令
 */
export function createImportCommand(): Command {
  const command = new Command('import')
    .description('导入 Mock 数据')
    .argument('<input>', '输入文件路径')
    .option('-o, --overwrite', '覆盖已存在的数据', false)
    .option('-m, --merge', '合并到现有数据', false)
    .option('-s, --scenario <name>', '导入到指定场景')
    .action(async (input, options) => {
      const spinner = ora('正在导入数据...').start()

      try {
        const inputPath = resolve(process.cwd(), input)

        if (!existsSync(inputPath)) {
          spinner.fail(chalk.red('文件不存在'))
          console.error(chalk.red(`找不到文件: ${inputPath}`))
          process.exit(1)
        }

        // 如果设置了覆盖，需要确认
        if (options.overwrite && !options.merge) {
          spinner.stop()
          const { confirm } = await inquirer.prompt([
            {
              type: 'confirm',
              name: 'confirm',
              message: chalk.yellow('⚠ 这将覆盖现有数据，确定继续吗？'),
              default: false,
            },
          ])

          if (!confirm) {
            console.log(chalk.gray('操作已取消'))
            return
          }
          spinner.start('正在导入数据...')
        }

        const importer = new DataImportExport()
        
        const data = await importer.importData({
          input: inputPath,
          overwrite: options.overwrite,
          merge: options.merge,
          targetScenario: options.scenario,
        })

        spinner.succeed(chalk.green('导入成功！'))
        console.log(chalk.white('导入路由数: '), chalk.cyan(data.routes.length))
        if (data.metadata.scenario) {
          console.log(chalk.white('场景: '), chalk.cyan(data.metadata.scenario))
        }
        if (options.scenario) {
          console.log(chalk.white('目标场景: '), chalk.cyan(options.scenario))
        }
        console.log(chalk.white('导入版本: '), chalk.cyan(data.metadata.version))
      } catch (error: any) {
        spinner.fail(chalk.red('导入失败'))
        console.error(chalk.red(error.message))
        if (process.env.DEBUG) {
          console.error(error)
        }
        process.exit(1)
      }
    })

  return command
}
