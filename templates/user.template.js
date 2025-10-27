/**
 * 用户相关 Mock 模板
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
          role: '@word',
          status: '@boolean',
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
        company: '@company',
        bio: '@paragraph',
        createdAt: '@date',
        updatedAt: '@date',
      },
    })
  },

  // 创建用户
  'POST /api/user': {
    delay: 500,
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
    delay: 300,
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

  // 用户分页列表
  'GET /api/users/paginated': (req, res) => {
    const page = parseInt(req.query.page) || 1
    const pageSize = parseInt(req.query.pageSize) || 10

    // 使用数据生成器生成分页数据
    res.json({
      success: true,
      data: Array.from({ length: pageSize }, () => ({
        id: '@uuid',
        name: '@name',
        email: '@email',
        avatar: '@avatar',
        createdAt: '@date',
      })),
      pagination: {
        page,
        pageSize,
        total: 100,
        totalPages: Math.ceil(100 / pageSize),
      },
    })
  },
}

