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
        value="mocks"
        :options="menuOptions"
        @update:value="handleMenuClick"
      />
    </n-layout-sider>

    <n-layout>
      <n-layout-header bordered style="height: 64px; padding: 0 24px; display: flex; align-items: center">
        <h1 style="font-size: 20px; margin: 0">Mock 管理</h1>
      </n-layout-header>

      <n-layout-content content-style="padding: 24px;">
        <n-card title="Mock 路由列表">
          <template #header-extra>
            <n-button type="primary" @click="loadMocks">刷新</n-button>
          </template>

          <n-data-table
            :columns="columns"
            :data="mocks"
            :pagination="{ pageSize: 10 }"
          />
        </n-card>
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
  NButton,
  NDataTable,
  NTag,
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
const mocks = ref([])

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
      return h(NTag, { type: typeMap[row.method] || 'default' }, { default: () => row.method })
    },
  },
  {
    title: '路径',
    key: 'path',
  },
  {
    title: '延迟',
    key: 'delay',
    width: 100,
    render: (row: any) => row.delay ? `${row.delay}ms` : '-',
  },
  {
    title: '状态码',
    key: 'status',
    width: 100,
  },
  {
    title: '场景',
    key: 'scenario',
    width: 120,
    render: (row: any) => row.scenario || '-',
  },
]

const handleMenuClick = (key: string) => {
  router.push(`/${key}`)
}

const loadMocks = async () => {
  try {
    const res: any = await api.getMocks()
    if (res.success) {
      mocks.value = res.data
    }
  } catch (error) {
    console.error('Failed to load mocks:', error)
  }
}

onMounted(() => {
  loadMocks()
})
</script>

