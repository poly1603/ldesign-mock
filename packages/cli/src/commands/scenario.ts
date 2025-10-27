/**
 * Scenario 命令 - 场景管理
 */

import { Command } from 'commander'
import inquirer from 'inquirer'
import chalk from 'chalk'
import ora from 'ora'
import { ConfigManager, ScenarioManager } from '@ldesign/mock-core'

/**
 * Scenario 命令
 */
export function createScenarioCommand(): Command {
  const command = new Command('scenario')
    .description('场景管理')
    .alias('s')

  // 列出所有场景
  command
    .command('list')
    .alias('ls')
    .description('列出所有场景')
    .action(async () => {
      try {
        const configManager = new ConfigManager()
        await configManager.loadConfig()
        const config = configManager.getConfig()

        const scenarioManager = new ScenarioManager()
        scenarioManager.loadFromConfig(config.scenarios || {})

        const scenarios = scenarioManager.getAllScenarios()
        const current = scenarioManager.getCurrentScenario()

        console.log(chalk.blue.bold('\n📋 可用场景:\n'))

        if (scenarios.length === 0) {
          console.log(chalk.gray('  没有配置场景'))
          return
        }

        scenarios.forEach((scenario) => {
          const isCurrent = scenario.name === current
          const marker = isCurrent ? chalk.green('●') : chalk.gray('○')
          const name = isCurrent
            ? chalk.green.bold(scenario.name)
            : chalk.white(scenario.name)
          const desc = scenario.description
            ? chalk.gray(` - ${scenario.description}`)
            : ''

          console.log(`  ${marker} ${name}${desc}`)
        })

        console.log()
      } catch (error: any) {
        console.error(chalk.red('获取场景列表失败:'), error.message)
        process.exit(1)
      }
    })

  // 切换场景
  command
    .command('switch [name]')
    .alias('use')
    .description('切换到指定场景')
    .action(async (name?: string) => {
      try {
        const configManager = new ConfigManager()
        await configManager.loadConfig()
        const config = configManager.getConfig()

        const scenarioManager = new ScenarioManager()
        scenarioManager.loadFromConfig(config.scenarios || {})

        const scenarios = scenarioManager.getScenarioNames()

        if (scenarios.length === 0) {
          console.log(chalk.yellow('⚠ 没有配置场景'))
          return
        }

        // 如果没有指定场景名，交互式选择
        if (!name) {
          const { selectedScenario } = await inquirer.prompt([
            {
              type: 'list',
              name: 'selectedScenario',
              message: '选择场景:',
              choices: scenarios,
            },
          ])
          name = selectedScenario
        }

        const spinner = ora(`正在切换到场景 "${name}"...`).start()

        // 切换场景
        const success = scenarioManager.switchScenario(name)

        if (success) {
          configManager.setCurrentScenario(name)
          spinner.succeed(chalk.green(`已切换到场景 "${name}"`))
        } else {
          spinner.fail(chalk.red(`场景 "${name}" 不存在`))
          process.exit(1)
        }
      } catch (error: any) {
        console.error(chalk.red('切换场景失败:'), error.message)
        process.exit(1)
      }
    })

  // 获取当前场景
  command
    .command('current')
    .description('显示当前场景')
    .action(async () => {
      try {
        const configManager = new ConfigManager()
        await configManager.loadConfig()
        const config = configManager.getConfig()

        const scenarioManager = new ScenarioManager()
        scenarioManager.loadFromConfig(config.scenarios || {})

        const current = scenarioManager.getCurrentScenario()

        if (current) {
          console.log(chalk.green(`当前场景: ${current}`))
        } else {
          console.log(chalk.gray('未设置场景'))
        }
      } catch (error: any) {
        console.error(chalk.red('获取当前场景失败:'), error.message)
        process.exit(1)
      }
    })

  return command
}

