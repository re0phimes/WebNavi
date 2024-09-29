<template>
    <el-card class="max-w-md mx-auto my-5 mt-2 mb-0 edit-card" shadow="hover">
        <div class="p-4 relative" @mouseenter="showActions = true" @mouseleave="showActions = false">
            <div v-if="!isEditing" @click="openUrl" class="cursor-pointer">
                <div class="flex items-center url-card">
                    <img v-if="favicon" :src="favicon" alt="Favicon" class="w-6 h-6 mr-3" />
                    <div>
                        <div class="font-bold">{{ url || '未设置 URL' }}</div>
                        <div class="text-gray-600">{{ description || '无描述' }}</div>
                    </div>
                </div>
            </div>

            <form v-if="isEditing" @submit.prevent="saveUrl" class="space-y-4 mt-4">

                <el-select v-model="editingUrl" filterable allow-create default-first-option placeholder="请选择或输入自定义值">
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
                <div>
                    <el-input v-model="editingDescription" placeholder="输入描述" clearable />
                </div>
                <div class="flex space-x-2">
                    <el-button type="primary" native-type="submit">保存</el-button>
                    <el-button @click="cancelEditing">取消</el-button>
                </div>
            </form>

            <div v-if="url && !isEditing" class="mt-4 flex items-center">
                <el-tag :type="isOnline ? 'success' : 'danger'" size="small" effect="dark">
                    {{ isOnline ? '在线' : '离线' }}
                </el-tag>
                <el-button @click="checkStatus" icon="el-icon-refresh" circle class="ml-2" />
            </div>
        </div>
    </el-card>
</template>

<script setup>
import { ElMessage, ElButton, ElInput, ElCard, ElTag } from 'element-plus';
import { ref, onMounted, onUnmounted, watch } from 'vue';

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
});

const emit = defineEmits(['update:url', 'update:description', 'delete']);

const url = ref(props.initialUrl);
const description = ref(props.initialDescription);
const editingUrl = ref(props.initialUrl);
const editingDescription = ref(props.initialDescription);
const isEditing = ref(!props.initialUrl);
const isOnline = ref(false);
const favicon = ref('');
const showActions = ref(false);

const value = ref('')
const options = ref([
    { value: '159.226.192.172:9000', label: '159.226.192.172:9000' },
    { value: '192.168.49.15', label: '192.168.49.15' },
    { value: 'Option3', label: 'Option3' },
])

// 校验 IP 地址
const isValidIpAddress = (ipAddress) => {
    const ipPattern = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (ipPattern.test(ipAddress)) {
        const parts = ipAddress.split('.');
        return parts.every(part => parseInt(part, 10) >= 0 && parseInt(part, 10) <= 255);
    }
    return false;
};

// 校验带协议的 URL
const isValidUrlWithProtocol = (inputUrl) => {
    try {
        const parsedUrl = new URL(inputUrl);
        return (parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:') && !!parsedUrl.hostname;
    } catch (e) {
        return false;
    }
};


// 校验不带协议的IP地址
const isValidHostWithoutProtocol = (inputHost) => {
  // 分离主机名和端口
  const [host, port] = inputHost.split(':');

  // 检查端口（如果存在）
  if (port !== undefined) {
    const portNumber = parseInt(port, 10);
    if (isNaN(portNumber) || portNumber < 1 || portNumber > 65535) {
      return false;
    }
  }

  // 检查是否为 'localhost'
  if (host === 'localhost') {
    return true;
  }

  // 检查是否为有效的 IPv4 地址
  const ipv4Pattern = /^(\d{1,3}\.){3}\d{1,3}$/;
  if (ipv4Pattern.test(host)) {
    const parts = host.split('.');
    return parts.every(part => {
      const num = parseInt(part, 10);
      return num >= 0 && num <= 255;
    });
  }

  // 检查是否为有效的 IPv6 地址
  const ipv6Pattern = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
  if (ipv6Pattern.test(host)) {
    return true;
  }

  // 如果既不是 localhost，也不是有效的 IP 地址，则返回 false
  return false;
};


// 综合的 URL 校验函数
const isValidUrl = (inputUrl) => {
    if (!inputUrl) return false;

    if (inputUrl.startsWith('http://') || inputUrl.startsWith('https://')) {
        return isValidUrlWithProtocol(inputUrl);
    } else {
        return isValidHostWithoutProtocol(inputUrl);
    }
};

const startEditing = () => {
    editingUrl.value = url.value;
    editingDescription.value = description.value;
    isEditing.value = true;
};

const saveUrl = async () => {
    if (editingUrl.value) {
        if (!isValidUrl(editingUrl.value)) {
            ElMessage.error('请输入有效的URL，必须以 http:// 或 https:// 开头，或为有效的IP地址或localhost');
            return;
        }
        try {
            // 这里你可以调用实际的更新URL逻辑，例如：
            // await updateUrl(props.id, editingUrl.value, editingDescription.value);
            url.value = editingUrl.value;
            description.value = editingDescription.value;
            isEditing.value = false;
            emit('update:url', url.value);
            emit('update:description', description.value);
            checkStatus();
            fetchFavicon();
            ElMessage.success('URL 更新成功');
        } catch (error) {
            ElMessage.error('URL 更新失败');
        }
    } else {
        console.log("请输入有效URL")
        ElMessage.error('请输入有效的URL');
    }
};

const cancelEditing = () => {
    isEditing.value = false;
    editingUrl.value = url.value;
    editingDescription.value = description.value;
};

const checkStatus = async () => {
    if (url.value) {
        try {
            const response = await fetch(url.value, { mode: 'no-cors' });
            isOnline.value = response.status === 0 || (response.status >= 200 && response.status < 300);
            ElMessage.success(`状态更新成功: ${isOnline.value ? '在线' : '离线'}`);
        } catch (error) {
            isOnline.value = false;
            ElMessage.error('检查状态时发生错误');
        }
    }
};

const fetchFavicon = () => {
    if (url.value) {
        let faviconUrl;
        if (isValidIpAddress(getHostWithoutProtocol(url.value)) || getHostWithoutProtocol(url.value) === 'localhost') {
            faviconUrl = `http://${getHostWithoutProtocol(url.value)}/favicon.ico`;
        } else {
            try {
                const urlObject = new URL(url.value);
                faviconUrl = `${urlObject.protocol}//${urlObject.hostname}/favicon.ico`;
            } catch (error) {
                faviconUrl = '';
            }
        }
        favicon.value = faviconUrl;
    } else {
        favicon.value = '';
    }
};

// 获取不带协议的主机部分
const getHostWithoutProtocol = (inputUrl) => {
    if (inputUrl.startsWith('http://') || inputUrl.startsWith('https://')) {
        try {
            const urlObject = new URL(inputUrl);
            return urlObject.hostname;
        } catch (e) {
            return inputUrl;
        }
    }
    return inputUrl;
};

const openUrl = () => {
    if (url.value) {
        let fullUrl = url.value;
        if (!fullUrl.startsWith('http://') && !fullUrl.startsWith('https://')) {
            if (isValidIpAddress(fullUrl) || fullUrl === 'localhost') {
                fullUrl = `http://${fullUrl}`;
            }
        }
        window.open(fullUrl, '_blank', 'noopener,noreferrer');
    }
};

const deleteCard = async () => {
    try {
        // 这里你可以调用实际的删除URL逻辑，例如：
        // await deleteUrl(props.id);
        emit('delete', props.id);
        ElMessage.success('URL 删除成功');
    } catch (error) {
        ElMessage.error('URL 删除失败');
    }
};

onMounted(() => {
    if (url.value) {
        checkStatus();
        fetchFavicon();
    }
});

watch(() => props.initialUrl, (newValue) => {
    url.value = newValue;
    editingUrl.value = newValue;
    isEditing.value = !newValue;
    fetchFavicon();
});

watch(() => props.initialDescription, (newValue) => {
    description.value = newValue;
    editingDescription.value = newValue;
});

const timer = setInterval(checkStatus, 60000);

onUnmounted(() => {
    clearInterval(timer);
});
</script>


<style scoped>
.edit-card :deep(.el-card__body) {
    padding: 0 !important;
}
</style>
