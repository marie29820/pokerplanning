<template>
  <b-modal
      ref="invitemodal"
      hide-footer title="Copy link to share"
  >
    <b-input-group class="mt-3">
      <b-form-input ref="urlinput" v-model="url"/>
      <b-input-group-append>
        <b-button variant="success" @click="copy()">Copy</b-button>
      </b-input-group-append>
    </b-input-group>
  </b-modal>
</template>

<script>
export default {
  name: "invite",
  props: {
    openInvite: Boolean
  },
  data() {
    return {
      url: window.location.href,
    }
  },
  watch: {
    openInvite(open) {
      if (open)
        this.$refs['invitemodal'].show()
      else this.$refs['invitemodal'].hide()
    }
  },
  methods: {
    copy() {
      this.$refs.urlinput.focus();
      this.$refs.urlinput.select()
      document.execCommand('copy');
    },

  }
}
</script>

<style scoped>

</style>