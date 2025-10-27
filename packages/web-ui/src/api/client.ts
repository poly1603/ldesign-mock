import axios from 'axios'

const client = axios.create({
  baseURL: '/api',
  timeout: 10000,
})

// 请求拦截
client.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截
client.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    console.error('API Error:', error)
    return Promise.reject(error)
  }
)

export const api = {
  // 统计信息
  getStats: () => client.get('/stats'),

  // 请求日志
  getLogs: (params?: { limit?: number; offset?: number }) =>
    client.get('/logs', { params }),
  clearLogs: () => client.delete('/logs'),

  // 场景
  getScenarios: () => client.get('/scenarios'),
  switchScenario: (name: string) => client.post(`/scenarios/${name}`),

  // Mock 路由
  getMocks: () => client.get('/mocks'),
  addMock: (data: { method: string; path: string; response: any }) =>
    client.post('/mocks', data),
  deleteMock: (data: { method: string; path: string }) =>
    client.delete('/mocks', { data }),

  // 配置
  getConfig: () => client.get('/config'),
  updateConfig: (data: any) => client.patch('/config', data),
}

export default client

