<template>
  <navbar></navbar>
  <b-container class="container">
    <b-row class="text-center" align-v="center">
      <b-col cols="12">
        <b-input-group prepend="Username" class="mt-3 inputname">
          <b-form-input
              class="inputname"
              v-model="name"
              :state="nameState"
              placeholder="Choisissez un pseudo de 2 a 8 caractères">
          </b-form-input>
          <b-input-group-append>
            <b-button
                variant="success"
                @click="onSubmit"
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
  mixins: [utils],
  data() {
    return {
      name: '',
    }
  },
  created() {
    this.reset()
    pokerPlanningApi.disconnect();
  },
  computed: {
    ...mapState(messageStore, ['room']),
    nameState() {
      return this.name.length > 2 && this.name.length < 8
    }
  },
  methods: {
    ...mapActions(messageStore, ['setPlayer', 'setRoom', 'reset']),
    onSubmit() {
      if (this.nameState) {
        let uuid = this.uuidv4();
        pokerPlanningApi.connect(
            stompClient => this.subscribe(uuid, stompClient))
            .then(
                () => pokerPlanningApi.create(uuid));
      }
    },
    subscribe(uuid, stompClient) {
      stompClient.subscribe("/topic/user/" + uuid, message => {
        this.setRoom(JSON.parse(message.body))
        this.setPlayer({name: this.name, id: null, connected: false})
        this.$router.push({name: routesNames.room, params: {id: this.room.id}})
      })
    }
  }
}
</script>

<style scoped>
.inputname {
  font-family: 'tahoma';
}

html {
  background-color: #F9F9F9;
}

.container {
  margin-top: 15%;
}
</style>