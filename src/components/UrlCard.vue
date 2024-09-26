<template>
    <div class="url-monitor">
      <el-card>
        <template #header>
          <div class="card-header">
            <span v-if="!isEditing">{{ url || '未设置 URL' }}</span>
            <el-button v-if="!isEditing" @click="startEditing" type="primary" text>
              修改
            </el-button>
          </div>
        </template>
        <el-form v-if="isEditing" @submit.prevent="saveUrl">
          <el-form-item>
            <el-input
              v-model="editingUrl"
              placeholder="输入URL"
              :prefix-icon="Document"
            >
              <template #append>
                <el-button @click="saveUrl" type="primary">
                  保存
                </el-button>
              </template>
            </el-input>
          </el-form-item>
        </el-form>
        <div v-if="url && !isEditing" class="url-display">
          <el-tag
            :type="isOnline ? 'success' : 'danger'"
            effect="dark"
            class="ml-2"
          >
            {{ isOnline ? '在线' : '离线' }}
          </el-tag>
          <el-button
            @click="checkStatus"
            type="primary"
            :icon="Refresh"
            circle
            class="ml-2"
          />
        </div>
      </el-card>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, onUnmounted, watch } from 'vue'
  import { Document, Refresh } from '@element-plus/icons-vue'
  import { ElMessage } from 'element-plus'
  
  const props = defineProps({
    initialUrl: {
      type: String,
      default: ''
    }
  })
  
  const emit = defineEmits(['update:url'])
  
  const url = ref(props.initialUrl)
  const editingUrl = ref(props.initialUrl)
  const isEditing = ref(!props.initialUrl)
  const isOnline = ref(false)
  
  const startEditing = () => {
    editingUrl.value = url.value
    isEditing.value = true
  }
  
  const saveUrl = () => {
    if (editingUrl.value) {
      url.value = editingUrl.value
      isEditing.value = false
      emit('update:url', url.value)
      checkStatus()
    } else {
      ElMessage.warning('请输入有效的URL')
    }
  }
  
  const checkStatus = async () => {
    if (url.value) {
      try {
        const response = await fetch(url.value, { mode: 'no-cors' })
        isOnline.value = response.status === 0 || (response.status >= 200 && response.status < 300)
        ElMessage.success(`状态更新成功: ${isOnline.value ? '在线' : '离线'}`)
      } catch (error) {
        isOnline.value = false
        ElMessage.error('检查状态时发生错误')
      }
    }
  }
  
  onMounted(() => {
    if (url.value) {
      checkStatus()
    }
  })
  
  watch(() => props.initialUrl, (newValue) => {
    url.value = newValue
    editingUrl.value = newValue
    isEditing.value = !newValue
  })
  
  // 设置定时器
  const timer = setInterval(checkStatus, 60000) // 每分钟检查一次状态
  
  // 组件卸载时清除定时器
  onUnmounted(() => {
    clearInterval(timer)
  })
  </script>
  
  <style scoped>
  .url-monitor {
    max-width: 500px;
    margin: 20px auto;
  }
  
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .url-display {
    display: flex;
    align-items: center;
    margin-top: 20px;
  }
  
  .ml-2 {
    margin-left: 8px;
  }
  </style>