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
        value="scenarios"
        :options="menuOptions"
        @update:value="handleMenuClick"
      />
    </n-layout-sider>

    <n-layout>
      <n-layout-header bordered style="height: 64px; padding: 0 24px; display: flex; align-items: center">
        <h1 style="font-size: 20px; margin: 0">场景管理</h1>
      </n-layout-header>

      <n-layout-content content-style="padding: 24px;">
        <n-card title="可用场景">
          <template #header-extra>
            <n-button @click="loadScenarios">刷新</n-button>
          </template>

          <n-space vertical size="large">
            <n-alert v-if="currentScenario" type="info">
              当前场景: <strong>{{ currentScenario }}</strong>
            </n-alert>

            <n-list bordered>
              <n-list-item v-for="scenario in scenarios" :key="scenario.name">
                <n-thing :title="scenario.name" :description="scenario.description || '无描述'">
                  <template #action>
                    <n-space>
                      <n-tag v-if="scenario.name === currentScenario" type="success">
                        当前
                      </n-tag>
                      <n-button
                        v-else
                        size="small"
                        type="primary"
                        @click="handleSwitch(scenario.name)"
                      >
                        切换
                      </n-button>
                    </n-space>
                  </template>
                </n-thing>
              </n-list-item>
            </n-list>
          </n-space>
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
  NSpace,
  NAlert,
  NList,
  NListItem,
  NThing,
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
const message = useMessage()
const scenarios = ref<any[]>([])
const currentScenario = ref('')

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
  router.push(`/${key}`)
}

const loadScenarios = async () => {
  try {
    const res: any = await api.getScenarios()
    if (res.success) {
      scenarios.value = res.data.scenarios
      currentScenario.value = res.data.current
    }
  } catch (error) {
    console.error('Failed to load scenarios:', error)
  }
}

const handleSwitch = async (name: string) => {
  try {
    const res: any = await api.switchScenario(name)
    if (res.success) {
      message.success(`已切换到场景: ${name}`)
      loadScenarios()
    }
  } catch (error: any) {
    message.error('切换失败: ' + error.message)
  }
}

onMounted(() => {
  loadScenarios()
})
</script>

