import { defineStore } from 'pinia'

export const useUrlCardStore = defineStore('urlCard', {
  state: () => ({
    rows: [
      { title: '互联网卡片', cards: [] },
      { title: '服务器服务', cards: [] }
    ]
  }),
  actions: {
    addRow() {
      this.rows.push({ title: '', cards: [] });
    },
    removeRow(rowIndex) {
      this.rows.splice(rowIndex, 1);
    },
    addCard(rowIndex) {
      if (this.rows[rowIndex].cards.length < 100) {
        this.rows[rowIndex].cards.push({ url: '', description: '', isEditing: true });
      }
    },
    removeCard(rowIndex, cardIndex) {
      this.rows[rowIndex].cards.splice(cardIndex, 1);
    },
    updateCard(rowIndex, cardIndex, { url, description, isEditing }) {
      const card = this.rows[rowIndex].cards[cardIndex];
      if (url !== undefined) card.url = url;
      if (description !== undefined) card.description = description;
      if (isEditing !== undefined) card.isEditing = isEditing;
    },
    setRowTitle(rowIndex, title) {
      this.rows[rowIndex].title = title;
    }
  }
})