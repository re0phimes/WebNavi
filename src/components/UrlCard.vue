<template>
    <el-card class="max-w-md mx-auto my-5 mt-2 mb-0 edit-card url-card" shadow="hover">
        <div class="p-4 relative" @mouseenter="showActions = true" @mouseleave="showActions = false">
            <div v-if="!card.isEditing" @click="openUrl" class="cursor-pointer">
                <div class="flex items-center">
                    <img v-if="favicon" :src="favicon" alt="Favicon" class="w-6 h-6 mr-3" />
                    <div>
                        <div class="font-bold">{{ card.url || '未设置 URL' }}</div>
                        <div class="text-gray-600">{{ card.description || '无描述' }}</div>
                    </div>
                </div>
            </div>

            <form v-if="card.isEditing" @submit.prevent="saveUrl" class="space-y-4 mt-4">
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
            <div v-if="card.url && !card.isEditing" class="flex items-center mt-2">
                <el-tag :type="isOnline ? 'success' : 'danger'" size="small" effect="dark">
                    {{ isOnline ? '在线' : '离线' }}
                </el-tag>
                <el-button @click="checkStatus" icon="Refresh" circle class="ml-2" />
            </div>
        </div>
    </el-card>
</template>

<script setup>
import { ElMessage, ElButton, ElInput, ElCard, ElTag, ElSelect, ElOption } from 'element-plus';
import { Edit, Refresh } from '@element-plus/icons-vue';
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { useUrlCardStore } from '../stores';

const props = defineProps({
    rowIndex: {
        type: Number,
        required: true
    },
    cardIndex: {
        type: Number,
        required: true
    }
});

const store = useUrlCardStore();
const card = store.rows[props.rowIndex].cards[props.cardIndex];

const editingUrl = ref(card.url);
const editingDescription = ref(card.description);
const isOnline = ref(false);
const favicon = ref('');
const showActions = ref(false);

const options = ref([
    { value: 'http://159.226.192.172:9000', label: '159.226.192.172:9000' },
    { value: 'http://192.168.49.15', label: '192.168.49.15' },
    { value: 'http://example.com', label: 'example.com' },
]);

const isValidUrl = (url) => {
    const pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
    return !!pattern.test(url);
};

const openUrl = () => {
    if (card.url) {
        window.open(card.url, '_blank');
    }
};

const startEditing = () => {
    store.updateCard(props.rowIndex, props.cardIndex, { isEditing: true });
};

const saveUrl = async () => {
    if (editingUrl.value) {
        if (!isValidUrl(editingUrl.value)) {
            ElMessage.error('请输入有效的URL，必须以 http:// 或 https:// 开头，或为有效的IP地址或localhost');
            return;
        }
        try {
            store.updateCard(props.rowIndex, props.cardIndex, {
                url: editingUrl.value,
                description: editingDescription.value,
                isEditing: false
            });
            checkStatus();
            fetchFavicon();
            ElMessage.success('URL 更新成功');
        } catch (error) {
            ElMessage.error('URL 更新失败');
        }
    } else {
        ElMessage.error('请输入有效的URL');
    }
};

const cancelEditing = () => {
    store.updateCard(props.rowIndex, props.cardIndex, { isEditing: false });
    editingUrl.value = card.url;
    editingDescription.value = card.description;
};

const checkStatus = async () => {
    if (card.url) {
        try {
            const response = await fetch(card.url, { mode: 'no-cors' });
            isOnline.value = response.ok;
        } catch (error) {
            isOnline.value = false;
        }
    }
};

const fetchFavicon = () => {
    if (card.url) {
        const url = new URL(card.url);
        favicon.value = `${url.protocol}//${url.hostname}/favicon.ico`;
    }
};

onMounted(() => {
    if (card.url) {
        checkStatus();
        fetchFavicon();
    }
});

watch(() => card.url, (newValue) => {
    editingUrl.value = newValue;
    fetchFavicon();
});

watch(() => card.description, (newValue) => {
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