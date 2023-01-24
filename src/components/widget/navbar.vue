<template>
  <b-navbar variant="faded" type="light">
    <b-img left class="poker" :src="require('@/assets/poker.png')" alt="poker image"></b-img>
    <b-img left class="title" :src="require('@/assets/logotxt.png')" alt="poker image"></b-img>
  </b-navbar>
</template>

<script>

export default {
  name: "navbar",
  data() {
    return {
      openInvite: false
    }
  },
  methods: {
    open() {
      this.openInvite = true
    }
  }
}
</script>

<style scoped>
.poker {
  width: 10%;
}

.title {
  position: absolute;
  margin-left: 7%;
  font-family: Optima, Segoe, Segoe UI, Candara, Calibri, Arial, sans-serif;
}
</style>