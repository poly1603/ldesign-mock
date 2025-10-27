<template>
  <n-layout has-sider style="height: 100vh">
    <n-layout-sider
      bordered
      show-trigger
      collapse-mode="width"
      :collapsed-width="64"
      :width="240"
      :native-scrollbar="false"
    >
      <n-menu
        :value="activeKey"
        :options="menuOptions"
        @update:value="handleMenuClick"
      />
    </n-layout-sider>

    <n-layout>
      <n-layout-header bordered style="height: 64px; padding: 0 24px; display: flex; align-items: center">
        <h1 style="font-size: 20px; margin: 0">🎭 LDesign Mock</h1>
        <div style="flex: 1"></div>
        <n-tag :type="serverStatus === 'running' ? 'success' : 'error'">
          {{ serverStatus === 'running' ? '运行中' : '已停止' }}
        </n-tag>
      </n-layout-header>

      <n-layout-content content-style="padding: 24px;" :native-scrollbar="false">
        <n-space vertical size="large">
          <n-card title="服务状态">
            <n-space vertical>
              <n-statistic label="总请求数" :value="stats.total" />
              <n-statistic label="成功请求" :value="stats.success" />
              <n-statistic label="失败请求" :value="stats.failed" />
              <n-statistic label="平均响应时间" :value="`${stats.avgResponseTime}ms`" />
              <n-statistic label="路由数量" :value="stats.routes" />
            </n-space>
          </n-card>

          <n-card title="当前场景">
            <n-tag v-if="stats.scenario" type="info" size="large">
              {{ stats.scenario }}
            </n-tag>
            <n-text v-else type="warning">未设置场景</n-text>
          </n-card>

          <n-card title="快捷操作">
            <n-space>
              <n-button type="primary" @click="refreshStats">刷新统计</n-button>
              <n-button @click="$router.push('/mocks')">管理 Mock</n-button>
              <n-button @click="$router.push('/logs')">查看日志</n-button>
            </n-space>
          </n-card>
        </n-space>
      </n-layout-content>
    </n-layout>
  </n-layout>
</template>

<script setup lang="ts">
import { ref, onMounted, h } from 'vue'
import { useRouter } from 'vue-router'
import {
  NLayout,
  NLayoutSider,
  NLayoutHeader,
  NLayoutContent,
  NMenu,
  NCard,
  NSpace,
  NStatistic,
  NTag,
  NText,
  NButton,
  NIcon,
} from 'naive-ui'
import {
  DashboardOutline,
  CodeSlashOutline,
  DocumentTextOutline,
  GitBranchOutline,
} from '@vicons/ionicons5'
import { api } from '../api/client'

const router = useRouter()
const activeKey = ref('dashboard')
const serverStatus = ref<'running' | 'stopped'>('running')
const stats = ref({
  total: 0,
  success: 0,
  failed: 0,
  avgResponseTime: 0,
  routes: 0,
  scenario: '',
})

const menuOptions = [
  {
    label: '仪表盘',
    key: 'dashboard',
    icon: () => h(NIcon, null, { default: () => h(DashboardOutline) }),
  },
  {
    label: 'Mock 管理',
    key: 'mocks',
    icon: () => h(NIcon, null, { default: () => h(CodeSlashOutline) }),
  },
  {
    label: '请求日志',
    key: 'logs',
    icon: () => h(NIcon, null, { default: () => h(DocumentTextOutline) }),
  },
  {
    label: '场景管理',
    key: 'scenarios',
    icon: () => h(NIcon, null, { default: () => h(GitBranchOutline) }),
  },
]

const handleMenuClick = (key: string) => {
  activeKey.value = key
  router.push(`/${key}`)
}

const refreshStats = async () => {
  try {
    const res: any = await api.getStats()
    if (res.success) {
      stats.value = res.data
    }
  } catch (error) {
    console.error('Failed to fetch stats:', error)
  }
}

onMounted(() => {
  refreshStats()
  setInterval(refreshStats, 5000)
})
</script>

