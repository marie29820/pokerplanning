<template>

  <div v-if="loader" class="text-center">
    <b-spinner variant="primary" label="Text Centered"></b-spinner>
  </div>
  <div id="app" v-if="!loader">
    <RouterView/>
  </div>
</template>

<script>

import {pokerPlanningApi} from "@/service";
import {PLAYER_ACTION} from "@/config/wordings";
import {mapState} from "pinia";
import {messageStore} from "@/store";

export default {
  components: {},
  data() {
    return {
      loader: false
    }
  },
  watch : {
    loading(loading){
      this.loader = loading;
    }
  },
  created() {
    // - reinitialiser l'ensemble des données
    window.addEventListener(
        "beforeunload",
        this.leaving
    );
  },
  computed: {
    ...mapState(messageStore, ['player', 'loading'])
  },
  methods: {
    async leaving() {
      const store = messageStore()
      if (this.$route.params.id && this.player) {
        // - supprimer le user du groupe
        pokerPlanningApi.switchPlayer(this.$route.params.id, this.player, PLAYER_ACTION.REMOVE).then(
            // - se deconencter de la socket
            () => pokerPlanningApi.disconnect()
        )
      }
      // - vider le store
      store.$reset()
    },
  }
}
</script>
<style>
</style>
