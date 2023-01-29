<template>
  <div class="clearfix">
    <b-img left class="poker" :src="require('@/assets/coollogo_com-12545707.png')" alt="Left image"></b-img>
  </div>
</template>

<script>

export default {
  name: "navbar",
}
</script>

<style scoped>
.poker {
  width: 15%;
}
.title {
  position: absolute;
  margin-left: 7%;
  font-family: Optima, Segoe, Segoe UI, Candara, Calibri, Arial, sans-serif;
}
</style>