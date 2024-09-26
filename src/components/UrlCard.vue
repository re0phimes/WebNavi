<template>
    <div class="max-w-md mx-auto my-5">
        <div class="bg-white shadow-md rounded-lg overflow-hidden">
            <div class="p-5 relative" @mouseenter="showActions = true" @mouseleave="showActions = false">
                <div v-if="!isEditing" @click="openUrl" class="cursor-pointer">
                    <div class="flex items-center">
                        <img v-if="favicon" :src="favicon" alt="Favicon" class="w-6 h-6 mr-3">
                        <div>
                            <div class="font-bold text-lg">{{ url || '未设置 URL' }}</div>
                            <div class="text-sm text-gray-600">{{ description || '无描述' }}</div>
                        </div>
                    </div>
                </div>

                <form v-if="isEditing" @submit.prevent="saveUrl" class="space-y-4 mt-4">
                    <div>
                        <input v-model="editingUrl" placeholder="输入URL"
                            class="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                        <input v-model="editingDescription" placeholder="输入描述"
                            class="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div class="flex space-x-2">
                        <el-button type="primary" native-type="submit">保存</el-button>
                        <el-button @click="cancelEditing" type="default">取消</el-button>
                    </div>
                </form>

                <div v-if="url && !isEditing" class="mt-4 flex items-center">
                    <span :class="[
                        'px-2 py-1 text-xs font-bold rounded-full',
                        isOnline ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                    ]">
                        {{ isOnline ? '在线' : '离线' }}
                    </span>
                    <el-button @click="checkStatus" class="ml-2" icon="el-icon-refresh" circle></el-button>
                </div>

            </div>
        </div>
    </div>
</template>

<script setup>
import { ElMessage, ElButton } from 'element-plus';
import { ref, onMounted, onUnmounted, watch } from 'vue'

const props = defineProps({
    initialUrl: {
        type: String,
        default: ''
    },
    initialDescription: {
        type: String,
        default: ''
    },
    id: {
        type: [String, Number],
        required: true
    }
})

const emit = defineEmits(['update:url', 'update:description', 'delete'])

const url = ref(props.initialUrl)
const description = ref(props.initialDescription)
const editingUrl = ref(props.initialUrl)
const editingDescription = ref(props.initialDescription)
const isEditing = ref(!props.initialUrl)
const isOnline = ref(false)
const favicon = ref('')
const showActions = ref(false)

const isValidIpAddress = (ipAddress) => {
    const ipPattern = /^(\d{1,3}\.){3}\d{1,3}$/
    if (ipPattern.test(ipAddress)) {
        const parts = ipAddress.split('.')
        return parts.every(part => parseInt(part) >= 0 && parseInt(part) <= 255)
    }
    return false
}

const startEditing = () => {
    editingUrl.value = url.value
    editingDescription.value = description.value
    isEditing.value = true
}

const saveUrl = async () => {
    if (editingUrl.value) {
        try {
            await updateUrl(props.id, editingUrl.value, editingDescription.value)
            url.value = editingUrl.value
            description.value = editingDescription.value
            isEditing.value = false
            emit('update:url', url.value)
            emit('update:description', description.value)
            checkStatus()
            fetchFavicon()
            ElMessage.success('URL 更新成功')
        } catch (error) {
            ElMessage.error('URL 更新失败')
        }
    } else {
        ElMessage.error('请输入有效的URL')
    }
}

const cancelEditing = () => {
    isEditing.value = false
    editingUrl.value = url.value
    editingDescription.value = description.value
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

const fetchFavicon = () => {
    if (url.value) {
        let faviconUrl
        if (isValidIpAddress(url.value)) {
            faviconUrl = `http://${url.value}/favicon.ico`
        } else {
            try {
                const urlObject = new URL(url.value)
                faviconUrl = `${urlObject.protocol}//${urlObject.hostname}/favicon.ico`
            } catch (error) {
                faviconUrl = `http://${url.value}/favicon.ico`
            }
        }
        favicon.value = faviconUrl
    } else {
        favicon.value = ''
    }
}

const openUrl = () => {
    if (url.value) {
        let fullUrl = url.value
        if (!fullUrl.startsWith('http://') && !fullUrl.startsWith('https://') && !isValidIpAddress(fullUrl)) {
            fullUrl = `http://${fullUrl}`
        } else if (isValidIpAddress(fullUrl)) {
            fullUrl = `http://${fullUrl}`
        }
        window.open(fullUrl, '_blank', 'noopener,noreferrer')
    }
}

const deleteCard = async () => {
    try {
        await deleteUrl(props.id)
        emit('delete', props.id)
        ElMessage.success('URL 删除成功')
    } catch (error) {
        ElMessage.error('URL 删除失败')
    }
}

onMounted(() => {
    if (url.value) {
        checkStatus()
        fetchFavicon()
    }
})

watch(() => props.initialUrl, (newValue) => {
    url.value = newValue
    editingUrl.value = newValue
    isEditing.value = !newValue
    fetchFavicon()
})

watch(() => props.initialDescription, (newValue) => {
    description.value = newValue
    editingDescription.value = newValue
})

const timer = setInterval(checkStatus, 60000)

onUnmounted(() => {
    clearInterval(timer)
})
</script>