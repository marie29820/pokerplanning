<template>
  <b-input-group prepend="Username" class="mt-3">
    <b-form-input v-model="user.name"></b-form-input>
    <b-input-group-append>
      <b-button variant="success" @click="validate()">Play
      </b-button>
    </b-input-group-append>
  </b-input-group>
</template>

<script>

export default {
  name: "modal",
  data() {
    return {
      user: {name: null},
    }
  },
  methods:{
    validate() {
      this.$emit('add-player', this.user);
    },
  }
}
</script>

<style scoped>

</style>