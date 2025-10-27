/**
 * 产品相关 Mock 模板
 */

export default {
  // 获取产品列表
  'GET /api/products': {
    response: {
      success: true,
      data: [
        {
          id: '@uuid',
          name: '@word',
          description: '@sentence',
          price: '@float(10, 1000, 2)',
          image: '@image',
          category: '@word',
          stock: '@int(0, 100)',
          createdAt: '@date',
        },
      ],
    },
  },

  // 获取产品详情
  'GET /api/product/:id': (req, res) => {
    res.json({
      success: true,
      data: {
        id: req.params.id,
        name: '@word',
        description: '@paragraph',
        price: '@float(10, 1000, 2)',
        image: '@image',
        images: ['@image', '@image', '@image'],
        category: '@word',
        stock: '@int(0, 100)',
        rating: '@float(0, 5, 1)',
        reviews: '@int(0, 1000)',
        createdAt: '@date',
      },
    })
  },

  // 创建产品
  'POST /api/product': {
    delay: 800,
    response: {
      success: true,
      data: {
        id: '@uuid',
        name: '@word',
        price: '@float(10, 1000, 2)',
        createdAt: '@date',
      },
      message: '产品创建成功',
    },
  },

  // 更新产品
  'PUT /api/product/:id': {
    response: {
      success: true,
      message: '产品更新成功',
    },
  },

  // 删除产品
  'DELETE /api/product/:id': {
    response: {
      success: true,
      message: '产品删除成功',
    },
  },
}

