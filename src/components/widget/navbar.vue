<template>
  <b-navbar variant="faded" type="light">
    <b-img left class="poker" :src="require('@/assets/poker.png')" alt="poker image"></b-img>
    <b-img left class="title" :src="require('@/assets/logotxt.png')" alt="poker image"></b-img>
    <b-navbar-nav class="ml-auto">
      <b-button size="sm"
                variant="primary"
                class="my-2 my-sm-0"
                @click="open">Invite friends
      </b-button>
    </b-navbar-nav>
  </b-navbar>
  <invite :open-invite="openInvite"></invite>
</template>

<script>
import Invite from "@/components/widget/invite.vue";

export default {
  name: "navbar",
  components: {Invite},
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
.title{
  position: absolute;
  margin-left: 7%;
  font-family: Optima,Segoe,Segoe UI,Candara,Calibri,Arial,sans-serif;
}
</style>