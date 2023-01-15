<template>
  <nav class="navbar navbar-light" style="background-color: rgb(158 199 229);">
    <p class="h2" style="font-family: 'Tahoma'">Poker Planning Online</p>
  </nav>
  <b-container>
    <b-row class="vh-100 text-center" align-v="center">
      <b-col align-self="center" cols="12" >
        <b-input-group prepend="Username" class="mt-3">
          <b-form-input v-model="name" ></b-form-input>
          <b-input-group-append>
            <b-button variant="success"
            @click="onSubmit">Play</b-button>
          </b-input-group-append>
        </b-input-group>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>


import {pokerPlanningApi} from "@/service";
import {mapActions, mapState} from "pinia";
import {messageStore} from "@/store";
import {routesNames} from "@/config";
import { uuid } from 'vue-uuid';
export default {
  name: "home",
  data() {
    return {
      uuid: uuid.v1(),
      name: '',
    }
  },
  computed: {
    ...mapState(messageStore, ['connected', 'room', 'player'])
  },
  watch: {
    connected(value) {
      if(value){
        pokerPlanningApi.create()
      }
    },
    room(room) {
      this.setPlayer({name: this.name, id: this.uuid})
      this.$router.push({ name: routesNames.room, params: { id: room.id } })
    },
  },
  methods: {
    ...mapActions(messageStore, ['setPlayer']),
    onSubmit() {
      pokerPlanningApi.connect();
    },

  }
}
</script>

<style scoped>

</style>