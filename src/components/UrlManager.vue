<template>
    <div class="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <el-page-header content="URL 卡片管理器" class="mb-8"></el-page-header>

        <div v-for="(row, rowIndex) in rows" :key="rowIndex" class="mb-8">
            <div class="flex justify-between items-center mb-4">
                <el-input v-model="row.title" placeholder="输入行标题" class="text-xl font-semibold"></el-input>
                <el-button type="danger" icon="el-icon-delete" @click="removeRow(rowIndex)" circle></el-button>
            </div>

            <div class="grid grid-cols-4 gap-4">
                <div v-for="(card, cardIndex) in row.cards" :key="cardIndex" class="relative">
                    <div class="group">
                        <UrlCard :initial-url="card.url" @update:url="updateCard(rowIndex, cardIndex, $event)"
                            class="p-0 m-6" />
                        <el-button type="primary" @click="updateCard(rowIndex, cardIndex)" circle
                            class="absolute top-2 right-12 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <el-icon>
                                <edit />
                            </el-icon>
                        </el-button>
                        <el-button type="danger" @click="removeCard(rowIndex, cardIndex)" circle
                            class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <el-icon>
                                <delete />
                            </el-icon>
                        </el-button>
                    </div>
                </div>
                <div v-if="row.cards.length < 100" @click="addCard(rowIndex)"
                    class="flex flex-col items-center justify-center h-32 m-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer transition duration-300 ease-in-out hover:bg-gray-50">
                    <el-icon>
                        <plus />
                    </el-icon>
                    <span class="text-xs text-gray-500">添加卡片</span>
                </div>
            </div>
        </div>

        <el-button @click="addRow" type="primary" class="mt-4">
            添加新行
        </el-button>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { ElButton, ElInput, ElPageHeader, ElIcon } from 'element-plus';
import { Plus, Delete, Edit } from '@element-plus/icons-vue';
import UrlCard from './UrlCard.vue';

const rows = ref([
    { title: '互联网卡片', cards: [] },
    { title: '服务器服务', cards: [] }
]);

const addRow = () => {
    rows.value.push({ title: '', cards: [] });
};

const removeRow = (rowIndex) => {
    rows.value.splice(rowIndex, 1);
};

const addCard = (rowIndex) => {
    if (rows.value[rowIndex].cards.length < 100) {
        rows.value[rowIndex].cards.push({ url: '' });
    }
};

const removeCard = (rowIndex, cardIndex) => {
    rows.value[rowIndex].cards.splice(cardIndex, 1);
};

watch(rows, (newRows) => {
    const lastRow = newRows[newRows.length - 1];
    if (lastRow && lastRow.cards.length === 100) {
        addRow();
    }
}, { deep: true });
</script>