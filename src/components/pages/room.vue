<template>
  <b-container class="bv-example-row">
    <b-row class="m-lg-2" align-v="center">
      <b-col class="md-12 d-flex justify-content-center" :style="{paddingTop: calculerPaddingTop()}">
        <div v-for="(player, i) in players" :key="player.id" class="avatar"
             :style="{transform: `rotate(${360 / players.length * i}deg) translate(${calculerTranslateX()},
             ${calculerTranslateY(windowHeight)})`}">
          <div :style="{transform: `rotate(${360 - (360 / players.length * i)}deg) translate(0,0)`}">
            <b-avatar
                v-if="step === 'HIDDEN'"
                size="3rem"
                :variant="getAvatarStyle(player)"></b-avatar>
            <b-button
                disabled
                v-if="step === 'REVEAL'"
                variant="primary">
              {{ player.value }}
            </b-button>
            <p style="font-size: 0.8em">{{ player.name }}</p>
          </div>
        </div>
      </b-col>
    </b-row>
    <div class="fixed-bottom">
      <b-row class="text-center">
        <b-col>
          <cards @update-card="updateCard" :user="user"></cards>
        </b-col>
      </b-row>
    </div>
    <b-modal ref="my-modal" hide-footer title="Give me your name">
      <b-input-group prepend="Username" class="mt-3">
        <b-form-input v-model="user.name"></b-form-input>
        <b-input-group-append>
          <b-button variant="success" @click="createPlayer()">Play
          </b-button>
        </b-input-group-append>
      </b-input-group>
    </b-modal>
  </b-container>
</template>

<script>


import Cards from "@/components/widget/cards.vue";
import {pokerPlanningApi} from "@/service";
import {mapActions, mapState} from "pinia";
import {messageStore} from "@/store";
import {uuid} from "vue-uuid";

export default {
  components: {Cards},
  data() {
    return {
      windowHeight: window.innerHeight,
      windowWidth: window.innerWidth,
      user: {id: uuid.v1(), name: null},
      players: [],
      step: 'HIDDEN',
    };
  },
  computed: {
    ...mapState(messageStore, ['room', 'player'])
  },
  mounted() {
    this.players.push(...this.room.players)
    if (!this.player) {
      // - rejoint le game
      this.$refs['my-modal'].show()
    } else if(!this.player.connected) {
      // - a créé la partie
      this.user.name = this.player.name
      this.createPlayer();
    }
  },
  created() {
  },
  watch: {
    room(room) {
      this.players = [];
      this.players.push(...room.players)
      this.step = room.step
    },
  },
  methods: {
    ...mapActions(messageStore, ['setPlayer']),
    createPlayer() {
      this.setPlayer({id: this.user.id, name: this.user.name, connected: true})
      pokerPlanningApi.addPlayer(this.$route.params.id, this.player)
      this.$refs['my-modal'].hide()
    },
    calculerTranslateX() {
      return 0.15 * this.windowWidth + 'px'
    },
    calculerTranslateY() {
      return 0.15 * this.windowHeight + 'px'
    },
    calculerPaddingTop() {
      return 0.33 * this.windowHeight + 'px'
    },
    getAvatarStyle(player) {
      return player.card ? "success" : "secondary"
    },
    updateCard(card) {
      this.setPlayer({id: this.player.id, name: this.player.name, connected: true, card: card})
      pokerPlanningApi.play(this.room.id, this.player)
    },
  }
};
</script>
<style>

.avatar {
  position: absolute;
}
</style>