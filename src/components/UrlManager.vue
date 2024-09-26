<template>
  <div class="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <h1 class="text-3xl font-bold text-gray-900 mb-8">URL 卡片管理器</h1>
    
    <div v-for="(row, rowIndex) in rows" :key="rowIndex" class="mb-8">
      <div class="flex justify-between items-center mb-4">
        <input 
          v-model="row.title" 
          class="text-xl font-semibold text-gray-700 bg-transparent border-b-2 border-gray-300 focus:border-blue-500 outline-none"
          placeholder="输入行标题"
        />
        <button 
          @click="removeRow(rowIndex)"
          class="text-red-500 hover:text-red-600 transition duration-300 ease-in-out"
        >
          删除行
        </button>
      </div>
      
      <div class="grid grid-cols-6 gap-4">
        <div v-for="(card, cardIndex) in row.cards" :key="cardIndex" class="relative">
          <UrlCard
            :initial-url="card.url"
            @update:url="updateCard(rowIndex, cardIndex, $event)"
            class="h-full"
          />
          <button 
            @click="removeCard(rowIndex, cardIndex)" 
            class="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 transition duration-300 ease-in-out"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
        <div 
          v-if="row.cards.length < 100" 
          @click="addCard(rowIndex)"
          class="flex flex-col items-center justify-center h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer transition duration-300 ease-in-out hover:bg-gray-50"
        >
          <svg class="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          <span class="text-xs text-gray-500">添加卡片</span>
        </div>
      </div>
    </div>
    
    <button 
      @click="addRow"
      class="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300 ease-in-out"
    >
      添加新行
    </button>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import UrlCard from './UrlCard.vue'

const rows = ref([
  { title: '互联网卡片', cards: [] },
  { title: '服务器服务', cards: [] }
])

const addRow = () => {
  rows.value.push({ title: '', cards: [] })
}

const removeRow = (rowIndex) => {
  rows.value.splice(rowIndex, 1)
}

const addCard = (rowIndex) => {
  if (rows.value[rowIndex].cards.length < 100) {
    rows.value[rowIndex].cards.push({ url: '' })
  }
}

const updateCard = (rowIndex, cardIndex, newUrl) => {
  rows.value[rowIndex].cards[cardIndex].url = newUrl
}

const removeCard = (rowIndex, cardIndex) => {
  rows.value[rowIndex].cards.splice(cardIndex, 1)
}

// 监视所有行，当某一行填满时自动添加新行
watch(rows, (newRows) => {
  const lastRow = newRows[newRows.length - 1]
  if (lastRow && lastRow.cards.length === 100) {
    addRow()
  }
}, { deep: true })
</script>