/**
 * 电商业务 Mock 模板
 * 包含商品、订单、购物车、支付等常见场景
 */

export default {
  metadata: {
    id: 'ecommerce',
    name: '电商系统',
    description: '包含商品管理、订单、购物车、支付等电商核心功能',
    category: 'business',
    tags: ['电商', 'ecommerce', '订单', '商品', '购物车'],
    author: 'LDesign Team',
    version: '1.0.0',
  },

  routes: {
    // ==================== 商品相关 ====================
    
    // 商品列表（支持分页和筛选）
    'GET /api/products': (req, res) => {
      const { page = 1, pageSize = 20, category, minPrice, maxPrice, keyword } = req.query
      
      res.json({
        success: true,
        data: {
          items: Array.from({ length: Number(pageSize) }, (_, i) => ({
            id: `@uuid`,
            name: `@word 商品`,
            description: `@sentence`,
            price: `@float(10, 9999, 2)`,
            originalPrice: `@float(20, 10000, 2)`,
            stock: `@int(0, 1000)`,
            sales: `@int(0, 10000)`,
            category: category || `@word`,
            categoryId: `@uuid`,
            brand: `@company`,
            brandId: `@uuid`,
            images: [
              `@image`,
              `@image`,
              `@image`,
            ],
            thumbnail: `@image`,
            rating: `@float(3, 5, 1)`,
            reviewCount: `@int(0, 1000)`,
            tags: [`@word`, `@word`, `@word`],
            specifications: {
              color: ['红色', '蓝色', '黑色'],
              size: ['S', 'M', 'L', 'XL'],
              material: `@word`,
            },
            createdAt: `@past`,
            updatedAt: `@date`,
          })),
          pagination: {
            page: Number(page),
            pageSize: Number(pageSize),
            total: `@int(100, 1000)`,
            totalPages: `@int(5, 50)`,
          },
        },
      })
    },

    // 商品详情
    'GET /api/products/:id': {
      response: {
        success: true,
        data: {
          id: '@uuid',
          name: '@word 旗舰商品',
          description: '@paragraph',
          price: '@float(100, 9999, 2)',
          originalPrice: '@float(200, 10000, 2)',
          discount: 0.85,
          stock: '@int(10, 500)',
          sales: '@int(100, 10000)',
          category: '电子产品',
          categoryId: '@uuid',
          brand: '@company',
          brandId: '@uuid',
          images: [
            '@image',
            '@image',
            '@image',
            '@image',
          ],
          thumbnail: '@image',
          rating: '@float(4, 5, 1)',
          reviewCount: '@int(100, 5000)',
          tags: ['热销', '新品', '推荐'],
          specifications: {
            color: ['红色', '蓝色', '黑色', '白色'],
            size: ['64GB', '128GB', '256GB'],
            warranty: '1年质保',
          },
          details: '@paragraph',
          shipping: {
            free: true,
            estimatedDays: '@int(1, 7)',
          },
          seller: {
            id: '@uuid',
            name: '@company',
            rating: '@float(4, 5, 1)',
          },
          createdAt: '@past',
          updatedAt: '@date',
        },
      },
    },

    // 商品分类列表
    'GET /api/categories': {
      response: {
        success: true,
        data: [
          {
            id: '@uuid',
            name: '电子产品',
            icon: '@imageUrl',
            parentId: null,
            children: [
              { id: '@uuid', name: '手机', icon: '@imageUrl' },
              { id: '@uuid', name: '电脑', icon: '@imageUrl' },
              { id: '@uuid', name: '平板', icon: '@imageUrl' },
            ],
          },
          {
            id: '@uuid',
            name: '服装鞋包',
            icon: '@imageUrl',
            parentId: null,
            children: [
              { id: '@uuid', name: '男装', icon: '@imageUrl' },
              { id: '@uuid', name: '女装', icon: '@imageUrl' },
              { id: '@uuid', name: '童装', icon: '@imageUrl' },
            ],
          },
          {
            id: '@uuid',
            name: '食品生鲜',
            icon: '@imageUrl',
            parentId: null,
            children: [
              { id: '@uuid', name: '水果', icon: '@imageUrl' },
              { id: '@uuid', name: '蔬菜', icon: '@imageUrl' },
              { id: '@uuid', name: '肉类', icon: '@imageUrl' },
            ],
          },
        ],
      },
    },

    // ==================== 购物车相关 ====================

    // 获取购物车
    'GET /api/cart': {
      response: {
        success: true,
        data: {
          items: [
            {
              id: '@uuid',
              productId: '@uuid',
              productName: '@word 商品',
              productImage: '@image',
              price: '@float(10, 999, 2)',
              quantity: '@int(1, 5)',
              selected: true,
              stock: '@int(10, 500)',
              specifications: {
                color: '黑色',
                size: '128GB',
              },
            },
            {
              id: '@uuid',
              productId: '@uuid',
              productName: '@word 商品',
              productImage: '@image',
              price: '@float(10, 999, 2)',
              quantity: '@int(1, 5)',
              selected: true,
              stock: '@int(10, 500)',
              specifications: {
                color: '红色',
                size: '256GB',
              },
            },
          ],
          totalPrice: '@float(100, 5000, 2)',
          totalQuantity: '@int(2, 10)',
          selectedCount: '@int(1, 10)',
        },
      },
    },

    // 添加到购物车
    'POST /api/cart': {
      delay: 300,
      response: {
        success: true,
        message: '已添加到购物车',
        data: {
          cartId: '@uuid',
          quantity: '@int(1, 10)',
        },
      },
    },

    // 更新购物车商品数量
    'PUT /api/cart/:id': {
      response: {
        success: true,
        message: '更新成功',
      },
    },

    // 删除购物车商品
    'DELETE /api/cart/:id': {
      response: {
        success: true,
        message: '删除成功',
      },
    },

    // ==================== 订单相关 ====================

    // 订单列表
    'GET /api/orders': (req, res) => {
      const { page = 1, pageSize = 10, status } = req.query
      
      res.json({
        success: true,
        data: {
          items: Array.from({ length: Number(pageSize) }, () => ({
            id: '@uuid',
            orderNo: `@uuid`,
            status: status || ['pending', 'paid', 'shipped', 'delivered', 'cancelled'][Math.floor(Math.random() * 5)],
            totalAmount: '@float(100, 5000, 2)',
            paymentAmount: '@float(100, 5000, 2)',
            shippingFee: '@float(0, 20, 2)',
            items: [
              {
                productId: '@uuid',
                productName: '@word 商品',
                productImage: '@image',
                quantity: '@int(1, 3)',
                price: '@float(100, 999, 2)',
              },
            ],
            address: {
              name: '@name',
              phone: '@phone',
              province: '@city',
              city: '@city',
              district: '@city',
              detail: '@address',
            },
            createdAt: '@past',
            updatedAt: '@date',
          })),
          pagination: {
            page: Number(page),
            pageSize: Number(pageSize),
            total: '@int(20, 100)',
            totalPages: '@int(2, 10)',
          },
        },
      })
    },

    // 订单详情
    'GET /api/orders/:id': {
      response: {
        success: true,
        data: {
          id: '@uuid',
          orderNo: '@uuid',
          status: 'paid',
          statusText: '已支付',
          totalAmount: '@float(500, 5000, 2)',
          paymentAmount: '@float(500, 5000, 2)',
          shippingFee: '@float(0, 20, 2)',
          discount: '@float(0, 100, 2)',
          items: [
            {
              productId: '@uuid',
              productName: '@word 高端商品',
              productImage: '@image',
              quantity: '@int(1, 3)',
              price: '@float(200, 999, 2)',
              specifications: {
                color: '黑色',
                size: '256GB',
              },
            },
          ],
          address: {
            name: '@name',
            phone: '@phone',
            province: '广东省',
            city: '深圳市',
            district: '南山区',
            detail: '@address',
          },
          payment: {
            method: 'wechat',
            methodText: '微信支付',
            transactionId: '@uuid',
            paidAt: '@past',
          },
          logistics: {
            company: '顺丰速运',
            trackingNo: '@uuid',
            status: '运输中',
            timeline: [
              { time: '@past', status: '已下单', description: '订单已创建' },
              { time: '@past', status: '已支付', description: '支付成功' },
              { time: '@past', status: '已发货', description: '商品已发货' },
            ],
          },
          createdAt: '@past',
          updatedAt: '@date',
        },
      },
    },

    // 创建订单
    'POST /api/orders': {
      delay: 500,
      response: {
        success: true,
        message: '订单创建成功',
        data: {
          orderId: '@uuid',
          orderNo: '@uuid',
          totalAmount: '@float(100, 5000, 2)',
        },
      },
    },

    // 取消订单
    'POST /api/orders/:id/cancel': {
      response: {
        success: true,
        message: '订单已取消',
      },
    },

    // ==================== 支付相关 ====================

    // 创建支付
    'POST /api/payment/create': {
      delay: 800,
      response: {
        success: true,
        data: {
          paymentId: '@uuid',
          orderId: '@uuid',
          amount: '@float(100, 5000, 2)',
          qrCode: '@imageUrl',
          expireTime: '@future',
        },
      },
    },

    // 查询支付状态
    'GET /api/payment/:id/status': {
      response: {
        success: true,
        data: {
          paymentId: '@uuid',
          status: 'success',
          paidAt: '@date',
          transactionId: '@uuid',
        },
      },
    },

    // ==================== 地址相关 ====================

    // 收货地址列表
    'GET /api/addresses': {
      response: {
        success: true,
        data: [
          {
            id: '@uuid',
            name: '@name',
            phone: '@phone',
            province: '广东省',
            city: '深圳市',
            district: '南山区',
            detail: '@address',
            isDefault: true,
            tag: '家',
          },
          {
            id: '@uuid',
            name: '@name',
            phone: '@phone',
            province: '北京市',
            city: '北京市',
            district: '朝阳区',
            detail: '@address',
            isDefault: false,
            tag: '公司',
          },
        ],
      },
    },

    // 添加收货地址
    'POST /api/addresses': {
      response: {
        success: true,
        message: '地址添加成功',
        data: {
          id: '@uuid',
        },
      },
    },

    // 更新收货地址
    'PUT /api/addresses/:id': {
      response: {
        success: true,
        message: '地址更新成功',
      },
    },

    // 删除收货地址
    'DELETE /api/addresses/:id': {
      response: {
        success: true,
        message: '地址删除成功',
      },
    },

    // 设置默认地址
    'POST /api/addresses/:id/default': {
      response: {
        success: true,
        message: '已设置为默认地址',
      },
    },
  },
}
