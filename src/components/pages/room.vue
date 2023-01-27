<template>
  <invite/>
  <b-container>
    <b-row class="m-lg-2" align-v="center">
      <b-col class="md-12 d-flex justify-content-center" :style="{paddingTop: calculerPaddingTop()}">
        <div v-for="(player, i) in players" :key="player.id" class="avatar"
             :style="{transform: `rotate(${360 / players.length * i}deg) translate(${calculerTranslateX()},
             ${calculerTranslateY(windowHeight)})`}">
          <div :style="{transform: `rotate(${360 - (360 / players.length * i)}deg) translate(0,0)`}">
            <b-avatar
                v-if="step === 'HIDDEN'"
                :badge="player.name"
                badge-top
                badge-offset="-0.7em"
                :badge-variant="getAvatarStyle(player)"
                size="4rem"
            />
            <b-avatar
                v-if="step === 'REVEAL'"
                :badge="player.name"
                badge-top
                badge-offset="-0.7em"
                :badge-variant="getAvatarStyle(player)"
                size="4rem">
              <span style="font-size: 2em"
                    v-if="player.card !== 'coffee'"><b>{{ player.card }}</b>
              </span>
              <b-img v-else :src="require('@/assets/icons8-cafe-36.png')"></b-img>
            </b-avatar>
          </div>
        </div>
      </b-col>
    </b-row>
    <div class="fixed-bottom">
      <b-row class="text-center">
        <b-col>
          <cards
              @reset-card="resetCard"
              @update-card="updateCard"
              @reveal-card="revealCard"
          />
        </b-col>
      </b-row>
    </div>
    <b-modal no-close-on-backdrop
             no-close-on-esc
             hide-header-close
             ref="playermodal"
             hide-footer title="Give me your name"
    >
      <modal @add-player="addPlayer"/>
    </b-modal>
  </b-container>
</template>

<script>
import Cards from "@/components/widget/cards.vue";
import {pokerPlanningApi, utils} from "@/service";
import {mapActions, mapState} from "pinia";
import {messageStore} from "@/store";
import Modal from "@/components/widget/modal.vue";
import Invite from "@/components/widget/invite.vue";
import {PLAYER_ACTION} from "@/config/wordings";

export default {
  components: {Invite, Modal, Cards},
  mixins: [utils],
  data() {
    return {
      windowHeight: window.innerHeight,
      windowWidth: window.innerWidth,
      newGame: false,
      user: {id: this.uuidv4(), name: null},
      players: [],
      step: 'HIDDEN',
    };
  },
  computed: {
    ...mapState(messageStore, ['room', 'player'])
  },
  mounted() {
    // - souscription des joueurs aux events de la room
    pokerPlanningApi.subscribeRoom(this.$route.params.id).then(
        () => {
          if (this.player) {
            // - si le joueur a créé la partie
            this.step = this.room.step
            if (!this.player.connected) {
              this.user.name = this.player.name
              // - ajout du player a la room
              this.createPlayer();
            }
          } else if (!this.player) {
            // - si le joueur rejoint le game
            this.$refs['playermodal'].show()
          }
        }
    )
  },
  watch: {
    room(room) {
      this.players = [];
      this.players.push(...room.players)
      this.step = room.step
      if (this.step === 'REVEAL')
        this.makeToast();
    },
  },
  methods: {
    ...mapActions(messageStore, ['setPlayer', 'setRoom', 'setLoading']),
    makeToast() {
      this.$bvToast.toast('Moyenne du poker planning : ' + this.averageNote(), {
        noCloseButton: true,
        autoHideDelay: 5000,
        variant: 'info',
        solid: true
      })
    },
    averageNote() {
      let total = this.players.map(p => p.card).filter(c => !isNaN(c) && null !== c)
          .reduce((acc, cur) => acc + parseInt(cur), 0)
      let vote = this.players.map(p => p.card).filter(c => !isNaN(c) && null !== c).length;
      return vote > 0 ? (total / vote).toFixed(1) : 0;
    },
    addPlayer(user) {
      this.user.name = user.name
      this.createPlayer();
    },
    async createPlayer() {
      this.setPlayer({id: this.user.id, name: this.user.name, connected: true})
      await pokerPlanningApi.switchPlayer(this.$route.params.id, this.player, PLAYER_ACTION.ADD)
      this.$refs['playermodal'].hide()
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
      return player.card ? "success" : "danger"
    },
    async updateCard(card) {
      this.setPlayer({id: this.player.id, name: this.player.name, connected: true, card: card})
      await pokerPlanningApi.play(this.room.id, this.player)
    },
    async revealCard() {
      await pokerPlanningApi.revealGame(this.room.id)
    },
    async resetCard() {
      await pokerPlanningApi.resetGame(this.room.id)
    }
  }
};
</script>
<style>

.avatar {
  position: absolute;
}

.username {
  font-family: 'tahoma';
  font-size: 1em;
  text-align: center;
}
</style>