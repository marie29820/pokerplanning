import {defineStore} from 'pinia'

export const messageStore = defineStore('messages', {
  state: () => {
    return {
      room: {},
      player: null,
      loading: false,
    }
  },
  actions: {
    setPlayer(player) {
      this.player = player
    },
    setRoom(room) {
      this.room = room
    },
    setLoading(loading) {
      this.loading = loading
    },
  },
  persist: {
    enabled: true,
  },
})
