/**
 * Record 命令 - 录制真实 API 请求
 */

import { Command } from 'commander'
import chalk from 'chalk'
import ora from 'ora'
import inquirer from 'inquirer'
import { resolve } from 'path'
import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import { RequestRecorder, type RecordConfig, type HttpMethod } from '@ldesign/mock-core'

/**
 * Record 命令
 */
export function createRecordCommand(): Command {
  const command = new Command('record')
    .description('录制真实 API 请求并生成 Mock 配置')
    .argument('<target>', '目标 API URL')
    .option('-o, --output <path>', '输出文件路径', 'mock/recorded.js')
    .option('-f, --format <format>', '输出格式 (js|ts|json)', 'js')
    .option('-d, --duration <ms>', '录制时长（毫秒）')
    .option('-m, --max <count>', '最大录制请求数')
    .option('--methods <methods>', '只录制指定方法（逗号分隔）', 'GET,POST,PUT,DELETE')
    .option('--paths <patterns>', '只录制匹配的路径（逗号分隔）')
    .option('--exclude <patterns>', '排除的路径（逗号分隔）')
    .action(async (target, options) => {
      console.log(chalk.blue.bold('\n🎬 开始录制 API 请求\n'))
      console.log(chalk.white('目标: '), chalk.cyan(target))
      console.log(chalk.white('输出: '), chalk.cyan(options.output))
      console.log(chalk.white('格式: '), chalk.cyan(options.format))
      console.log()

      const spinner = ora('准备录制...').start()

      try {
        const recorder = new RequestRecorder()

        // 解析过滤选项
        const methods = options.methods ? options.methods.split(',').map((m: string) => m.trim() as HttpMethod) : undefined
        const paths = options.paths ? options.paths.split(',').map((p: string) => p.trim()) : undefined
        const excludePaths = options.exclude ? options.exclude.split(',').map((p: string) => p.trim()) : undefined

        const recordConfig: RecordConfig = {
          target,
          output: options.output,
          duration: options.duration ? Number(options.duration) : undefined,
          maxRequests: options.max ? Number(options.max) : undefined,
          filter: {
            methods,
            paths,
            excludePaths,
          },
        }

        // 开始录制
        const sessionId = recorder.startRecording(recordConfig)
        spinner.succeed(chalk.green('录制已开始！'))

        console.log(chalk.yellow('\n⚠ 请在另一个终端中发送请求到目标 API'))
        console.log(chalk.gray('  或使用浏览器访问目标 URL 并进行操作\n'))

        if (recordConfig.duration) {
          console.log(chalk.white(`⏱ 将在 ${recordConfig.duration}ms 后自动停止`))
        }
        if (recordConfig.maxRequests) {
          console.log(chalk.white(`📊 最多录制 ${recordConfig.maxRequests} 个请求`))
        }
        
        console.log(chalk.gray('\n按 Ctrl+C 停止录制\n'))

        // 监听录制事件
        let requestCount = 0
        recorder.on('request-recorded', (request) => {
          requestCount++
          console.log(
            chalk.green('✓'),
            chalk.cyan(request.method),
            chalk.white(request.path),
            chalk.gray(`(${request.duration}ms)`)
          )

          // 检查是否达到最大请求数
          if (recordConfig.maxRequests && requestCount >= recordConfig.maxRequests) {
            stopRecording(recorder, sessionId, options)
          }
        })

        // 如果没有设置duration，等待用户手动停止
        if (!recordConfig.duration) {
          // 监听 Ctrl+C
          process.on('SIGINT', () => {
            console.log(chalk.yellow('\n\n⚠ 收到停止信号\n'))
            stopRecording(recorder, sessionId, options)
          })

          // 保持进程运行
          await new Promise(() => {})
        } else {
          // 等待自动停止
          await new Promise<void>((resolve) => {
            recorder.on('recording-stopped', () => {
              resolve()
            })
          })

          await stopRecording(recorder, sessionId, options)
        }
      } catch (error: any) {
        spinner.fail(chalk.red('录制失败'))
        console.error(chalk.red(error.message))
        if (process.env.DEBUG) {
          console.error(error)
        }
        process.exit(1)
      }
    })

  return command
}

/**
 * 停止录制并保存
 */
async function stopRecording(
  recorder: RequestRecorder,
  sessionId: string,
  options: any
): Promise<void> {
  const spinner = ora('正在停止录制...').start()

  try {
    const session = recorder.stopRecording(sessionId)
    
    if (!session) {
      spinner.fail(chalk.red('未找到录制会话'))
      process.exit(1)
      return
    }

    spinner.text = '正在生成 Mock 文件...'

    // 导出为文件
    const format = options.format === 'ts' ? 'ts' : options.format === 'json' ? 'json' : 'js'
    const content = recorder.exportSession(sessionId, format)

    // 确保输出目录存在
    const outputPath = resolve(process.cwd(), options.output)
    const outputDir = outputPath.substring(0, outputPath.lastIndexOf('/') || outputPath.lastIndexOf('\\'))
    
    if (!existsSync(outputDir)) {
      await mkdir(outputDir, { recursive: true })
    }

    // 写入文件
    await writeFile(outputPath, content, 'utf-8')

    spinner.succeed(chalk.green('录制完成！'))

    // 显示统计信息
    console.log()
    console.log(chalk.white('录制统计:'))
    console.log(chalk.gray('  请求总数: '), chalk.cyan(session.requests.length))
    console.log(chalk.gray('  录制时长: '), chalk.cyan(`${((session.endTime || Date.now()) - session.startTime) / 1000}s`))
    console.log(chalk.gray('  输出文件: '), chalk.cyan(outputPath))
    console.log()
    console.log(chalk.green('✓'), chalk.white('Mock 文件已生成，可以在配置中使用了！'))
    console.log()

    process.exit(0)
  } catch (error: any) {
    spinner.fail(chalk.red('保存失败'))
    console.error(chalk.red(error.message))
    if (process.env.DEBUG) {
      console.error(error)
    }
    process.exit(1)
  }
}
