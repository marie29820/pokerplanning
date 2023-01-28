<template>
  <b-button size="sm"
            variant="primary"
            class="my-2 my-sm-0 invitebutton"
            @click="copy">Invite friends
  </b-button>
</template>
<script>
export default {
  name: "invite",
  data() {
    return {
      url: window.location.href,
    }
  },
  methods: {
    copy() {
      navigator.clipboard.writeText(this.url)
      this.$bvToast.toast("L'url a été copiée dans le presse papier", {
        noCloseButton: true,
        autoHideDelay: 5000,
        variant: 'info',
        solid: true
      })
    },
  }
}
</script>
<style scoped>
.invitebutton{
  float: right;
  margin: 10px;
}
</style>