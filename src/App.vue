<template>
  <div id="app">
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
  created() {
    window.addEventListener(
        "beforeunload",
        this.leaving
    );
  },
  computed: {
    ...mapState(messageStore, ['player'])
  },
  methods: {
    async leaving() {
      // - supprimer le user du groupe
      if(this.$route.params.id && this.player){
        await pokerPlanningApi.switchPlayer(this.$route.params.id, this.player, PLAYER_ACTION.REMOVE)
      }
      // deconnecter la socket
      pokerPlanningApi.disconnect();
    }
  }
}
</script>
<style>
</style>
