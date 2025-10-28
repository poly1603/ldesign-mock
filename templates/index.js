/**
 * Mock 模板索引
 * 导出所有可用的模板
 */

import ecommerce from './ecommerce.template.js'
import cms from './cms.template.js'
import user from './user.template.js'
import product from './product.template.js'

/**
 * 所有可用模板
 */
export const templates = {
  ecommerce,
  cms,
  user,
  product,
}

/**
 * 模板分类
 */
export const categories = {
  business: {
    name: '业务系统',
    description: '常见的业务系统模板',
    templates: ['ecommerce', 'cms'],
  },
  basic: {
    name: '基础模块',
    description: '基础功能模块模板',
    templates: ['user', 'product'],
  },
}

/**
 * 获取模板列表
 */
export function getTemplateList() {
  return Object.entries(templates).map(([id, template]) => ({
    id,
    ...template.metadata,
  }))
}

/**
 * 获取模板详情
 */
export function getTemplate(id) {
  return templates[id]
}

/**
 * 按分类获取模板
 */
export function getTemplatesByCategory(category) {
  const categoryInfo = categories[category]
  if (!categoryInfo) return []
  
  return categoryInfo.templates.map(id => ({
    id,
    ...templates[id].metadata,
  }))
}

/**
 * 搜索模板
 */
export function searchTemplates(keyword) {
  const lowerKeyword = keyword.toLowerCase()
  
  return Object.entries(templates)
    .filter(([id, template]) => {
      const { name, description, tags } = template.metadata
      return (
        name.toLowerCase().includes(lowerKeyword) ||
        description.toLowerCase().includes(lowerKeyword) ||
        tags.some(tag => tag.toLowerCase().includes(lowerKeyword))
      )
    })
    .map(([id, template]) => ({
      id,
      ...template.metadata,
    }))
}

export default templates
