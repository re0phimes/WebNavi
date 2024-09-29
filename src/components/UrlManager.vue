<template>
    <div class="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <el-page-header content="URL 卡片管理器" class="mb-8"></el-page-header>

        <div v-for="(row, rowIndex) in store.rows" :key="rowIndex" class="mb-8">
            <div class="flex justify-between items-center mb-4">
                <el-input v-model="row.title" placeholder="输入行标题" class="text-xl font-semibold"
                    @input="store.setRowTitle(rowIndex, row.title)"></el-input>
                <el-button type="danger" icon="Delete" @click="store.removeRow(rowIndex)" circle></el-button>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                <div v-for="(card, cardIndex) in row.cards" :key="cardIndex" class="relative">
                    <div class="group">
                        <UrlCard :row-index="rowIndex" :card-index="cardIndex" class="p-0" />
                        <el-button type="primary" @click="store.updateCard(rowIndex, cardIndex, { isEditing: true })"
                            circle
                            class="absolute items-center justify-center top-0 right-12 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <el-icon>
                                <edit />
                            </el-icon>
                        </el-button>
                        <el-button type="danger" @click="store.removeCard(rowIndex, cardIndex)" circle
                            class="absolute items-center justify-center top-0 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <el-icon>
                                <delete />
                            </el-icon>
                        </el-button>

                    </div>
                </div>
                <div v-if="row.cards.length < 100" @click="store.addCard(rowIndex)"
                    class="flex flex-col items-center justify-center m-2 mt-2 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer transition duration-300 ease-in-out hover:bg-gray-50 url-card h-44">
                    <el-icon>
                        <Plus />
                    </el-icon>
                    <span class="text-xs text-gray-500">添加卡片</span>
                </div>
            </div>
        </div>

        <el-button @click="store.addRow" type="primary" class="mt-4">
            添加新行
        </el-button>
    </div>
</template>

<script setup>
import { ElButton, ElInput, ElPageHeader, ElIcon } from 'element-plus';
import { Plus, Delete, Edit } from '@element-plus/icons-vue';
import UrlCard from './UrlCard.vue';
import { useUrlCardStore } from '../stores';

const store = useUrlCardStore();

</script>