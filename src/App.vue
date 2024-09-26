<script setup lang="ts">
import HelloWorld from './components/HelloWorld.vue'
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
        <h1 class="text-3xl font-bold mb-6">Main Content Area</h1>
        
        <div class="flex flex-wrap justify-center gap-4 mb-8">
          <a href="https://vitejs.dev" target="_blank">
            <img src="/vite.svg" class="h-24 w-auto transition-all duration-300 hover:drop-shadow-lg" alt="Vite logo" />
          </a>
          <a href="https://vuejs.org/" target="_blank">
            <img src="./assets/vue.svg" class="h-24 w-auto transition-all duration-300 hover:drop-shadow-lg" alt="Vue logo" />
          </a>
        </div>

        <HelloWorld msg="Vite + Vue" />

        <!-- 添加一些额外的内容以演示滚动 -->
        <div class="mt-8">
          <h2 class="text-2xl font-bold mb-4">Additional Content</h2>
          <p class="mb-4">This is some additional content to demonstrate scrolling in the main area.</p>
          <p class="mb-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
          <!-- 重复多次以确保有足够的内容来滚动 -->
          <!-- ... -->
        </div>
      </div>
    </div>
  </div>
</template>

<style>
@layer base {
  html, body, #app {
    @apply h-full w-full m-0 p-0;
  }
}

body {
  @apply overflow-hidden;
}

/* 确保所有内容都适应屏幕宽度 */
img, a, div {
  max-width: 100%;
}
</style>