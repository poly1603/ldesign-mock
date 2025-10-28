/**
 * CMS 内容管理系统 Mock 模板
 * 包含文章、分类、标签、评论、媒体库等功能
 */

export default {
  metadata: {
    id: 'cms',
    name: 'CMS内容管理',
    description: '包含文章管理、分类、标签、评论、媒体库等CMS核心功能',
    category: 'business',
    tags: ['CMS', '内容管理', '博客', '文章'],
    author: 'LDesign Team',
    version: '1.0.0',
  },

  routes: {
    // ==================== 文章相关 ====================

    // 文章列表
    'GET /api/articles': (req, res) => {
      const { page = 1, pageSize = 10, status, category, keyword } = req.query
      
      res.json({
        success: true,
        data: {
          items: Array.from({ length: Number(pageSize) }, () => ({
            id: '@uuid',
            title: '@sentence',
            summary: '@paragraph',
            content: '@paragraph',
            cover: '@image',
            author: {
              id: '@uuid',
              name: '@name',
              avatar: '@avatar',
            },
            category: {
              id: '@uuid',
              name: category || '@word',
            },
            tags: ['@word', '@word', '@word'],
            status: status || ['draft', 'published', 'archived'][Math.floor(Math.random() * 3)],
            views: '@int(0, 10000)',
            likes: '@int(0, 1000)',
            comments: '@int(0, 500)',
            publishedAt: '@past',
            createdAt: '@past',
            updatedAt: '@date',
          })),
          pagination: {
            page: Number(page),
            pageSize: Number(pageSize),
            total: '@int(50, 500)',
            totalPages: '@int(5, 50)',
          },
        },
      })
    },

    // 文章详情
    'GET /api/articles/:id': {
      response: {
        success: true,
        data: {
          id: '@uuid',
          title: '@sentence',
          summary: '@paragraph',
          content: '@paragraph',
          cover: '@image',
          author: {
            id: '@uuid',
            name: '@name',
            avatar: '@avatar',
            bio: '@sentence',
          },
          category: {
            id: '@uuid',
            name: '@word',
            slug: '@word',
          },
          tags: [
            { id: '@uuid', name: '@word', slug: '@word' },
            { id: '@uuid', name: '@word', slug: '@word' },
          ],
          status: 'published',
          seo: {
            title: '@sentence',
            description: '@paragraph',
            keywords: '@words',
          },
          views: '@int(100, 10000)',
          likes: '@int(10, 1000)',
          commentsCount: '@int(5, 500)',
          publishedAt: '@past',
          createdAt: '@past',
          updatedAt: '@date',
        },
      },
    },

    // 创建文章
    'POST /api/articles': {
      delay: 500,
      response: {
        success: true,
        message: '文章创建成功',
        data: {
          id: '@uuid',
          status: 'draft',
        },
      },
    },

    // 更新文章
    'PUT /api/articles/:id': {
      response: {
        success: true,
        message: '文章更新成功',
      },
    },

    // 删除文章
    'DELETE /api/articles/:id': {
      response: {
        success: true,
        message: '文章删除成功',
      },
    },

    // 发布文章
    'POST /api/articles/:id/publish': {
      response: {
        success: true,
        message: '文章已发布',
      },
    },

    // ==================== 分类相关 ====================

    // 分类列表
    'GET /api/categories': {
      response: {
        success: true,
        data: [
          {
            id: '@uuid',
            name: '技术',
            slug: 'tech',
            description: '@sentence',
            icon: '@imageUrl',
            parentId: null,
            articleCount: '@int(10, 100)',
            children: [
              {
                id: '@uuid',
                name: '前端开发',
                slug: 'frontend',
                articleCount: '@int(5, 50)',
              },
              {
                id: '@uuid',
                name: '后端开发',
                slug: 'backend',
                articleCount: '@int(5, 50)',
              },
            ],
          },
          {
            id: '@uuid',
            name: '生活',
            slug: 'life',
            description: '@sentence',
            icon: '@imageUrl',
            parentId: null,
            articleCount: '@int(10, 100)',
            children: [
              {
                id: '@uuid',
                name: '旅行',
                slug: 'travel',
                articleCount: '@int(5, 30)',
              },
              {
                id: '@uuid',
                name: '美食',
                slug: 'food',
                articleCount: '@int(5, 30)',
              },
            ],
          },
        ],
      },
    },

    // 创建分类
    'POST /api/categories': {
      response: {
        success: true,
        message: '分类创建成功',
        data: {
          id: '@uuid',
        },
      },
    },

    // 更新分类
    'PUT /api/categories/:id': {
      response: {
        success: true,
        message: '分类更新成功',
      },
    },

    // 删除分类
    'DELETE /api/categories/:id': {
      response: {
        success: true,
        message: '分类删除成功',
      },
    },

    // ==================== 标签相关 ====================

    // 标签列表
    'GET /api/tags': {
      response: {
        success: true,
        data: [
          {
            id: '@uuid',
            name: 'JavaScript',
            slug: 'javascript',
            color: '#f7df1e',
            articleCount: '@int(10, 100)',
          },
          {
            id: '@uuid',
            name: 'Vue.js',
            slug: 'vue',
            color: '#42b883',
            articleCount: '@int(10, 100)',
          },
          {
            id: '@uuid',
            name: 'React',
            slug: 'react',
            color: '#61dafb',
            articleCount: '@int(10, 100)',
          },
          {
            id: '@uuid',
            name: 'Node.js',
            slug: 'nodejs',
            color: '#339933',
            articleCount: '@int(10, 100)',
          },
        ],
      },
    },

    // 创建标签
    'POST /api/tags': {
      response: {
        success: true,
        message: '标签创建成功',
        data: {
          id: '@uuid',
        },
      },
    },

    // ==================== 评论相关 ====================

    // 评论列表
    'GET /api/comments': (req, res) => {
      const { page = 1, pageSize = 10, articleId, status } = req.query
      
      res.json({
        success: true,
        data: {
          items: Array.from({ length: Number(pageSize) }, () => ({
            id: '@uuid',
            content: '@sentence',
            author: {
              id: '@uuid',
              name: '@name',
              avatar: '@avatar',
              email: '@email',
            },
            articleId: articleId || '@uuid',
            articleTitle: '@sentence',
            parentId: null,
            replies: '@int(0, 10)',
            likes: '@int(0, 100)',
            status: status || ['pending', 'approved', 'rejected'][Math.floor(Math.random() * 3)],
            createdAt: '@past',
          })),
          pagination: {
            page: Number(page),
            pageSize: Number(pageSize),
            total: '@int(50, 500)',
            totalPages: '@int(5, 50)',
          },
        },
      })
    },

    // 审核评论
    'POST /api/comments/:id/approve': {
      response: {
        success: true,
        message: '评论已通过',
      },
    },

    // 拒绝评论
    'POST /api/comments/:id/reject': {
      response: {
        success: true,
        message: '评论已拒绝',
      },
    },

    // 删除评论
    'DELETE /api/comments/:id': {
      response: {
        success: true,
        message: '评论删除成功',
      },
    },

    // ==================== 媒体库相关 ====================

    // 媒体文件列表
    'GET /api/media': (req, res) => {
      const { page = 1, pageSize = 20, type } = req.query
      
      res.json({
        success: true,
        data: {
          items: Array.from({ length: Number(pageSize) }, () => ({
            id: '@uuid',
            name: '@word',
            url: '@image',
            thumbnail: '@image',
            type: type || ['image', 'video', 'document'][Math.floor(Math.random() * 3)],
            size: '@int(1024, 10485760)',
            mimeType: 'image/jpeg',
            width: '@int(800, 1920)',
            height: '@int(600, 1080)',
            uploadedBy: {
              id: '@uuid',
              name: '@name',
            },
            uploadedAt: '@past',
          })),
          pagination: {
            page: Number(page),
            pageSize: Number(pageSize),
            total: '@int(100, 1000)',
            totalPages: '@int(5, 50)',
          },
        },
      })
    },

    // 上传媒体文件
    'POST /api/media/upload': {
      delay: 1000,
      response: {
        success: true,
        message: '文件上传成功',
        data: {
          id: '@uuid',
          url: '@image',
          thumbnail: '@image',
        },
      },
    },

    // 删除媒体文件
    'DELETE /api/media/:id': {
      response: {
        success: true,
        message: '文件删除成功',
      },
    },

    // ==================== 菜单相关 ====================

    // 菜单列表
    'GET /api/menus': {
      response: {
        success: true,
        data: [
          {
            id: '@uuid',
            name: '主菜单',
            location: 'primary',
            items: [
              {
                id: '@uuid',
                label: '首页',
                url: '/',
                target: '_self',
                order: 1,
                children: [],
              },
              {
                id: '@uuid',
                label: '文章',
                url: '/articles',
                target: '_self',
                order: 2,
                children: [
                  {
                    id: '@uuid',
                    label: '技术',
                    url: '/articles/tech',
                    order: 1,
                  },
                  {
                    id: '@uuid',
                    label: '生活',
                    url: '/articles/life',
                    order: 2,
                  },
                ],
              },
              {
                id: '@uuid',
                label: '关于',
                url: '/about',
                target: '_self',
                order: 3,
                children: [],
              },
            ],
          },
        ],
      },
    },

    // ==================== 统计相关 ====================

    // 仪表盘统计
    'GET /api/dashboard/stats': {
      response: {
        success: true,
        data: {
          articles: {
            total: '@int(100, 1000)',
            published: '@int(80, 900)',
            draft: '@int(10, 100)',
            archived: '@int(10, 50)',
          },
          comments: {
            total: '@int(500, 5000)',
            pending: '@int(10, 100)',
            approved: '@int(400, 4500)',
            rejected: '@int(10, 100)',
          },
          users: {
            total: '@int(100, 1000)',
            active: '@int(80, 900)',
            inactive: '@int(10, 100)',
          },
          views: {
            total: '@int(10000, 100000)',
            today: '@int(100, 1000)',
            yesterday: '@int(100, 1000)',
            thisWeek: '@int(500, 5000)',
            thisMonth: '@int(2000, 20000)',
          },
          trends: {
            articles: [
              { date: '@past', count: '@int(0, 50)' },
              { date: '@past', count: '@int(0, 50)' },
              { date: '@past', count: '@int(0, 50)' },
              { date: '@past', count: '@int(0, 50)' },
              { date: '@past', count: '@int(0, 50)' },
              { date: '@past', count: '@int(0, 50)' },
              { date: '@past', count: '@int(0, 50)' },
            ],
            views: [
              { date: '@past', count: '@int(0, 1000)' },
              { date: '@past', count: '@int(0, 1000)' },
              { date: '@past', count: '@int(0, 1000)' },
              { date: '@past', count: '@int(0, 1000)' },
              { date: '@past', count: '@int(0, 1000)' },
              { date: '@past', count: '@int(0, 1000)' },
              { date: '@past', count: '@int(0, 1000)' },
            ],
          },
        },
      },
    },

    // 热门文章
    'GET /api/articles/popular': {
      response: {
        success: true,
        data: Array.from({ length: 10 }, () => ({
          id: '@uuid',
          title: '@sentence',
          views: '@int(1000, 10000)',
          likes: '@int(100, 1000)',
          cover: '@image',
        })),
      },
    },
  },
}
