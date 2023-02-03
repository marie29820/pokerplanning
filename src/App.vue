<template>
  <div v-show="loader" class="overlay">
    <b-spinner variant="primary" class="spinner" label="Text Centered"></b-spinner>
  </div>
  <RouterView/>
</template>

<script>

import {pokerPlanningApi} from "@/service";
import {mapState} from "pinia";
import {messageStore} from "@/store";

export default {
  components: {},
  data() {
    return {
      loader: false
    }
  },
  watch: {
    loading(loading) {
      this.loader = loading;
    }
  },
  created() {
    // - reinitialiser l'ensemble des données
    window.addEventListener("beforeunload", this.leaving);
  },
  computed: {
    ...mapState(messageStore, ['player', 'loading'])
  },
  methods: {
    async leaving() {
      // - vider le store et se deconnecter
      pokerPlanningApi.disconnect()
      messageStore().$reset()
    },
  }
}
</script>
<style>
.overlay {
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: 1000;
  opacity: 0.7;
  filter: alpha(opacity=50);
  background-color: black;
}

.spinner {
  margin-top: 25%;
  margin-left: 50%;
}
</style>
