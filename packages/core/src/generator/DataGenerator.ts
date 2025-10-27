/**
 * Mock 数据生成器
 * 基于 @faker-js/faker
 */

import { faker, type Faker } from '@faker-js/faker'
import type { GeneratorConfig, GeneratorFunction } from '../types/index.js'

/**
 * 数据生成器类
 */
export class DataGenerator {
  private faker: Faker
  private customGenerators: Map<string, GeneratorFunction> = new Map()

  constructor(config: GeneratorConfig = {}) {
    // 使用默认 faker 实例
    this.faker = faker

    // 设置语言环境（可选）
    // 注意：@faker-js/faker 的本地化需要导入对应的 locale
    // 如 import { fakerZH_CN } from '@faker-js/faker'
    if (config.locale) {
      // 留给将来扩展，目前使用默认英文
      // this.faker = fakerZH_CN
    }

    // 设置随机种子
    if (config.seed !== undefined) {
      this.faker.seed(config.seed)
    }

    // 注册自定义生成器
    if (config.customGenerators) {
      Object.entries(config.customGenerators).forEach(([name, fn]) => {
        this.registerGenerator(name, fn)
      })
    }
  }

  /**
   * 注册自定义生成器
   */
  registerGenerator(name: string, generator: GeneratorFunction): void {
    this.customGenerators.set(name, generator)
  }

  /**
   * 生成数据
   */
  generate(template: any): any {
    if (typeof template === 'string') {
      return this.generateFromString(template)
    }

    if (Array.isArray(template)) {
      return template.map(item => this.generate(item))
    }

    if (template && typeof template === 'object') {
      const result: any = {}
      for (const [key, value] of Object.entries(template)) {
        result[key] = this.generate(value)
      }
      return result
    }

    return template
  }

  /**
   * 从字符串生成数据
   */
  private generateFromString(template: string): any {
    // 处理 @placeholder 语法
    const placeholderRegex = /@(\w+)(?:\(([^)]*)\))?/g

    if (!template.match(placeholderRegex)) {
      return template
    }

    return template.replace(placeholderRegex, (match, method, params) => {
      try {
        return String(this.callGenerator(method, params))
      } catch (error) {
        console.warn(`Failed to generate data for ${match}:`, error)
        return match
      }
    })
  }

  /**
   * 调用生成器
   */
  private callGenerator(method: string, params?: string): any {
    // 检查自定义生成器
    if (this.customGenerators.has(method)) {
      const generator = this.customGenerators.get(method)!
      const parsedParams = params ? this.parseParams(params) : undefined
      return generator(this.faker, parsedParams)
    }

    // 解析 faker 方法路径
    const parts = method.split('.')
    let current: any = this.faker

    // 处理简写方法
    const methodMap: Record<string, string> = {
      // 基础
      'id': 'string.uuid',
      'guid': 'string.uuid',
      'uuid': 'string.uuid',

      // 人物
      'name': 'person.fullName',
      'firstName': 'person.firstName',
      'lastName': 'person.lastName',
      'email': 'internet.email',
      'phone': 'phone.number',
      'avatar': 'image.avatar',

      // 地址
      'address': 'location.streetAddress',
      'city': 'location.city',
      'country': 'location.country',
      'zipCode': 'location.zipCode',

      // 公司
      'company': 'company.name',
      'companyName': 'company.name',
      'jobTitle': 'person.jobTitle',

      // 互联网
      'url': 'internet.url',
      'domain': 'internet.domainName',
      'ip': 'internet.ip',
      'mac': 'internet.mac',
      'username': 'internet.userName',
      'password': 'internet.password',

      // 日期
      'date': 'date.recent',
      'past': 'date.past',
      'future': 'date.future',
      'timestamp': 'date.recent',

      // 数字
      'number': 'number.int',
      'int': 'number.int',
      'float': 'number.float',
      'boolean': 'datatype.boolean',
      'bool': 'datatype.boolean',

      // 文本
      'title': 'lorem.sentence',
      'sentence': 'lorem.sentence',
      'paragraph': 'lorem.paragraph',
      'text': 'lorem.text',
      'word': 'lorem.word',
      'words': 'lorem.words',

      // 图片
      'image': 'image.url',
      'imageUrl': 'image.url',

      // 颜色
      'color': 'color.human',
      'hexColor': 'color.hex',
    }

    // 如果是简写，转换为完整路径
    const fullPath = methodMap[method] || method
    const pathParts = fullPath.split('.')

    for (const part of pathParts) {
      if (current && typeof current === 'object' && part in current) {
        current = current[part]
      } else {
        throw new Error(`Unknown generator method: ${method}`)
      }
    }

    if (typeof current === 'function') {
      const parsedParams = params ? this.parseParams(params) : undefined
      return current.call(this.faker, parsedParams)
    }

    return current
  }

  /**
   * 解析参数
   */
  private parseParams(params: string): any {
    try {
      // 尝试解析为 JSON
      return JSON.parse(`[${params}]`)[0]
    } catch {
      // 如果失败，按逗号分割
      return params.split(',').map(p => {
        const trimmed = p.trim()
        // 尝试转换为数字
        const num = Number(trimmed)
        if (!isNaN(num)) {
          return num
        }
        // 移除引号
        return trimmed.replace(/^["']|["']$/g, '')
      })
    }
  }

  /**
   * 生成数组数据
   */
  generateArray<T = any>(template: any, count: number | [number, number]): T[] {
    const actualCount = Array.isArray(count)
      ? this.faker.number.int({ min: count[0], max: count[1] })
      : count

    return Array.from({ length: actualCount }, () => this.generate(template))
  }

  /**
   * 生成分页数据
   */
  generatePaginated<T = any>(
    template: any,
    options: {
      page?: number
      pageSize?: number
      total?: number
    } = {}
  ) {
    const page = options.page || 1
    const pageSize = options.pageSize || 10
    const total = options.total || this.faker.number.int({ min: 50, max: 200 })

    const items = this.generateArray(template, pageSize)

    return {
      data: items,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    }
  }

  /**
   * 获取 Faker 实例
   */
  getFaker(): Faker {
    return this.faker
  }

  /**
   * 重置随机种子
   */
  resetSeed(seed?: number): void {
    if (seed !== undefined) {
      this.faker.seed(seed)
    } else {
      this.faker.seed()
    }
  }
}

/**
 * 创建数据生成器
 */
export function createDataGenerator(config?: GeneratorConfig): DataGenerator {
  return new DataGenerator(config)
}

/**
 * 默认数据生成器实例
 */
export const defaultGenerator = new DataGenerator()

