import {defineStore} from 'pinia'

export const messageStore = defineStore('messages', {
  state: () => {
    return {
      room: Object,
      player: null,
    }
  },
  actions: {
    setPlayer(player) {
      this.player = player
    },
  },
  persist: {
    enabled: {
      storage: sessionStorage,
      paths: ['message'],
    },
  },
})
