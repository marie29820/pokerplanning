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
    setRoom(room) {
      this.room = room
    },
    reset(){
      this.player = null
      this.room = {}
    }
  },
  persist: {
    enabled: {
      storage: sessionStorage,
      paths: ['message'],
    },
  },
})
