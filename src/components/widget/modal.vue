<template>
  <b-input-group prepend="Username" class="mt-3">
    <b-form-input v-model="user.name"  :state="nameState"></b-form-input>
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
  computed: {
    nameState() {
      return this.validName();
    }
  },
  methods: {
    validate() {
      if(this.validName()){
        this.$emit('add-player', this.user);
      }
    },
    validName(){
      return this.user.name?.length > 2 && this.user.name?.length < 8 && /^[A-Za-z-@]+$/.test(this.user.name)
    }
  }
}
</script>

<style scoped>

</style>