<template>
  <navbar/>
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
import {PLAYER_ACTION} from "@/config/wordings";

export default {
  name: "home",
  components: {Navbar},
  mixins: [utils],
  data() {
    return {
      name: '',
    }
  },
  async created() {
    const store = messageStore()
    // - si on revient sur l'ecran home (f5) ou back
    // - on reinitialise l'ensemble des données
    if (this.room.id && this.player) {
      await pokerPlanningApi.switchPlayer(this.room.id, this.player, PLAYER_ACTION.REMOVE);
    }
    pokerPlanningApi.disconnect()
    store.$reset()
  },
  computed: {
    ...mapState(messageStore, ['room', 'player']),
    nameState() {
      return this.name.length > 2 && this.name.length < 8
    }
  },
  methods: {
    ...mapActions(messageStore, ['setPlayer', 'setRoom', 'setLoading']),
    submit() {
      if (this.nameState) {
        this.setLoading(true)
        let uuid = this.uuidv4();
        pokerPlanningApi.connect(
            stompClient => {
              // - souscription au topic privée de reponse a la création d'une room
              stompClient.subscribe("/topic/user/" + uuid, message => {
                this.setRoom(JSON.parse(message.body))
                this.setPlayer({name: this.name, id: null, connected: false, master: true})
                this.$router.push({name: routesNames.room, params: {id: this.room.id}})
                this.setLoading(false)
              })
            })
            .then(() => {
              // - demande de creation de la room
              pokerPlanningApi.createRoom(uuid)
            });
      }
    },
  }
}
</script>

<style scoped>
.inputname {
  font-family: 'tahoma';
}
.container {
  margin-top: 15%;
}
</style>