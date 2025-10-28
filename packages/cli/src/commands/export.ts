/**
 * Export 命令 - 导出 Mock 数据
 */

import { Command } from 'commander'
import chalk from 'chalk'
import ora from 'ora'
import { resolve } from 'path'
import { DataImportExport, type ExportFormat } from '@ldesign/mock-core'

/**
 * Export 命令
 */
export function createExportCommand(): Command {
  const command = new Command('export')
    .description('导出 Mock 数据')
    .argument('<output>', '输出文件路径')
    .option('-f, --format <format>', '导出格式 (json|yaml|typescript|javascript)', 'json')
    .option('-s, --scenario <name>', '指定场景名称')
    .option('-c, --compress', '压缩输出', false)
    .option('-m, --metadata', '包含元数据和日志', false)
    .action(async (output, options) => {
      const spinner = ora('正在导出数据...').start()

      try {
        const format = options.format as ExportFormat
        if (!['json', 'yaml', 'typescript', 'javascript'].includes(format)) {
          spinner.fail(chalk.red('不支持的导出格式'))
          console.error(chalk.red(`支持的格式: json, yaml, typescript, javascript`))
          process.exit(1)
        }

        const exporter = new DataImportExport()
        const outputPath = resolve(process.cwd(), output)

        // 这里需要从当前运行的 Mock 服务器或配置文件中获取数据
        // 为了演示，我们提供一个简化版本
        
        const data = {
          routes: [], // 需要从实际源获取
          logs: options.metadata ? [] : undefined,
          config: {},
        }

        await exporter.exportData(data, {
          format,
          output: outputPath,
          scenario: options.scenario,
          compress: options.compress,
          includeMetadata: options.metadata,
        })

        spinner.succeed(chalk.green('导出成功！'))
        console.log(chalk.white('输出文件: '), chalk.cyan(outputPath))
        console.log(chalk.white('格式: '), chalk.cyan(format))
        if (options.scenario) {
          console.log(chalk.white('场景: '), chalk.cyan(options.scenario))
        }
      } catch (error: any) {
        spinner.fail(chalk.red('导出失败'))
        console.error(chalk.red(error.message))
        if (process.env.DEBUG) {
          console.error(error)
        }
        process.exit(1)
      }
    })

  return command
}
