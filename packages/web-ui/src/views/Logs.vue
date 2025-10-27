<template>
  <n-layout has-sider style="height: 100vh">
    <n-layout-sider
      bordered
      show-trigger
      collapse-mode="width"
      :collapsed-width="64"
      :width="240"
    >
      <n-menu
        value="logs"
        :options="menuOptions"
        @update:value="handleMenuClick"
      />
    </n-layout-sider>

    <n-layout>
      <n-layout-header bordered style="height: 64px; padding: 0 24px; display: flex; align-items: center">
        <h1 style="font-size: 20px; margin: 0">请求日志</h1>
      </n-layout-header>

      <n-layout-content content-style="padding: 24px;">
        <n-card title="请求日志">
          <template #header-extra>
            <n-space>
              <n-button @click="loadLogs">刷新</n-button>
              <n-button type="error" @click="handleClearLogs">清空</n-button>
            </n-space>
          </template>

          <n-data-table
            :columns="columns"
            :data="logs"
            :pagination="{ pageSize: 20 }"
          />
        </n-card>
      </n-layout-content>
    </n-layout>
  </n-layout>
</template>

<script setup lang="ts">
import { ref, onMounted, h } from 'vue'
import { useRouter } from 'vue-router'
import { useMessage } from 'naive-ui'
import {
  NLayout,
  NLayoutSider,
  NLayoutHeader,
  NLayoutContent,
  NMenu,
  NCard,
  NButton,
  NDataTable,
  NTag,
  NSpace,
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
const message = useMessage()
const logs = ref([])

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

const columns = [
  {
    title: '时间',
    key: 'timestamp',
    width: 180,
    render: (row: any) => new Date(row.timestamp).toLocaleString(),
  },
  {
    title: '方法',
    key: 'method',
    width: 100,
    render: (row: any) => {
      const typeMap: Record<string, string> = {
        GET: 'info',
        POST: 'success',
        PUT: 'warning',
        DELETE: 'error',
      }
      return h(NTag, { type: typeMap[row.method] || 'default', size: 'small' }, { default: () => row.method })
    },
  },
  {
    title: '路径',
    key: 'path',
  },
  {
    title: '状态',
    key: 'status',
    width: 100,
    render: (row: any) => {
      const type = row.status >= 200 && row.status < 400 ? 'success' : 'error'
      return h(NTag, { type, size: 'small' }, { default: () => row.status })
    },
  },
  {
    title: '耗时',
    key: 'duration',
    width: 100,
    render: (row: any) => `${row.duration}ms`,
  },
]

const handleMenuClick = (key: string) => {
  router.push(`/${key}`)
}

const loadLogs = async () => {
  try {
    const res: any = await api.getLogs({ limit: 100 })
    if (res.success) {
      logs.value = res.data
    }
  } catch (error) {
    console.error('Failed to load logs:', error)
  }
}

const handleClearLogs = async () => {
  try {
    const res: any = await api.clearLogs()
    if (res.success) {
      message.success('日志已清空')
      loadLogs()
    }
  } catch (error: any) {
    message.error('清空失败: ' + error.message)
  }
}

onMounted(() => {
  loadLogs()
})
</script>

