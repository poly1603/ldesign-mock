import { defineConfig } from 'vitepress'

export default defineConfig({
  title: '@ldesign/mock',
  description: '强大的 Mock 数据管理工具，让前后端并行开发成为可能',
  
  lang: 'zh-CN',
  
  themeConfig: {
    logo: '/logo.svg',
    
    nav: [
      { text: '指南', link: '/guide/introduction' },
      { text: 'API 参考', link: '/api/config' },
      { text: '最佳实践', link: '/guide/best-practices' },
      {
        text: '相关链接',
        items: [
          { text: 'GitHub', link: 'https://github.com/ldesign/mock' },
          { text: '更新日志', link: '/changelog' },
        ],
      },
    ],

    sidebar: {
      '/guide/': [
        {
          text: '开始',
          items: [
            { text: '简介', link: '/guide/introduction' },
            { text: '快速开始', link: '/guide/getting-started' },
          ],
        },
        {
          text: '核心功能',
          items: [
            { text: '数据生成器', link: '/guide/data-generator' },
            { text: '场景管理', link: '/guide/scenario-management' },
            { text: '请求录制', link: '/guide/recording' },
            { text: '模板库', link: '/guide/templates' },
            { text: 'CLI 命令', link: '/guide/cli' },
          ],
        },
        {
          text: '进阶指南',
          items: [
            { text: '最佳实践', link: '/guide/best-practices' },
          ],
        },
      ],
      '/api/': [
        {
          text: 'API 参考',
          items: [
            { text: '配置参考', link: '/api/config' },
            { text: '路由配置', link: '/api/routes' },
          ],
        },
      ],
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/ldesign/mock' },
    ],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2024-present LDesign Team',
    },

    search: {
      provider: 'local',
    },

    editLink: {
      pattern: 'https://github.com/ldesign/mock/edit/main/docs/:path',
      text: '在 GitHub 上编辑此页',
    },

    lastUpdated: {
      text: '最后更新于',
      formatOptions: {
        dateStyle: 'short',
        timeStyle: 'short',
      },
    },

    outline: {
      label: '页面导航',
      level: [2, 3],
    },

    docFooter: {
      prev: '上一页',
      next: '下一页',
    },

    darkModeSwitchLabel: '主题',
    sidebarMenuLabel: '菜单',
    returnToTopLabel: '返回顶部',
  },

  markdown: {
    lineNumbers: true,
    theme: {
      light: 'github-light',
      dark: 'github-dark',
    },
  },
})
