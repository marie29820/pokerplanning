<template>
  <div id="app">
    <RouterView/>
  </div>
</template>

<script>

import {pokerPlanningApi} from "@/service";

export default {
  components: {},
  created() {
    window.addEventListener(
        "beforeunload",
        this.leaving
    );
  },
  methods: {
    leaving() {
      pokerPlanningApi.disconnect();
    }
  }
}
</script>
<style>
</style>
