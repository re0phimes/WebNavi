<script setup lang="ts">
import UrlCard from './components/UrlCard.vue';

import UrlManager from './components/UrlManager.vue';


</script>

<template>
    <div class="flex h-screen w-screen overflow-hidden">
        <!-- 侧边栏 -->
        <div class="w-64 bg-gray-800 text-white overflow-y-auto">
            <div class="p-4">
                <h2 class="text-2xl font-bold mb-4">Sidebar</h2>
                <nav>
                    <ul>
                        <li class="mb-2"><a href="#" class="hover:text-gray-300">Home</a></li>
                        <li class="mb-2"><a href="#" class="hover:text-gray-300">About</a></li>
                        <li class="mb-2"><a href="#" class="hover:text-gray-300">Contact</a></li>
                    </ul>
                </nav>
            </div>
        </div>

        <!-- 主内容区域 -->
        <div class="flex-1 overflow-hidden">
            <div class="h-full overflow-y-auto p-8">

                <UrlManager></UrlManager>
            </div>
        </div>
    </div>
</template>

<style>
/* 确保所有内容都适应屏幕宽度 */
img,
a,
div {
    max-width: 100%;
}
</style>