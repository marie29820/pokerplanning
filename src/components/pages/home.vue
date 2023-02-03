<template>
  <navbar/>
  <b-container class="container">
    <b-row class="text-center" align-v="center">
      <b-col cols="12">
        <b-input-group prepend="nickname" class="mt-3 inputname">
          <b-form-input
              trim
              class="inputname"
              v-model="name"
              @keydown.enter.prevent="enter"
              :state="nameState"
              placeholder="Choose a nickname of 2 to 8 characters [a-z]">
          </b-form-input>
          <b-input-group-append>
            <b-button
                variant="success"
                @click="submit"
            >Play
            </b-button>
          </b-input-group-append>
        </b-input-group>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>


import {pokerPlanningApi, utils} from "@/service";
import {mapActions, mapState} from "pinia";
import {messageStore} from "@/store";
import {routesNames} from "@/config";
import Navbar from "@/components/widget/navbar.vue";

export default {
  name: "home",
  components: {Navbar},
  data() {
    return {
      name: '',
    }
  },
  async created() {
    // - on reinitialise l'ensemble des données
    pokerPlanningApi.disconnect()
    messageStore().$reset()
  },
  computed: {
    ...mapState(messageStore, ['room', 'player']),
    nameState() {
      return this.name.length > 2 && this.name.length < 8 && /^[A-Za-z-@]+$/.test(this.name)
    },
  },
  methods: {
    ...mapActions(messageStore, ['setPlayer', 'setRoom', 'setLoading']),
    submit() {
      this.setPlayer({name: this.name, connected: false})
      this.$router.push({name: routesNames.room, params: {id: utils.uuidv4()}})
    },
    enter() {
      this.submit()
    }
  }
}
</script>

<style scoped>
.inputname {
  font-family: 'tahoma', serif;
}

.container {
  height: 100%;
  margin-top: 15%;
}
</style>