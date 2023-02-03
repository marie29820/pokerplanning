<template>
  <invite/>
  <div v-if="explode">
    <explode/>
  </div>
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
      <modal @add-player="createPlayer"/>
    </b-modal>
  </b-container>
</template>

<script>
import Cards from "@/components/widget/cards.vue";
import {pokerPlanningApi} from "@/service";
import {mapActions, mapState} from "pinia";
import {messageStore} from "@/store";
import Modal from "@/components/widget/modal.vue";
import Invite from "@/components/widget/invite.vue";
import Explode from "@/components/widget/explode.vue";

export default {
  components: {Explode, Invite, Modal, Cards},
  data() {
    return {
      windowHeight: window.innerHeight,
      windowWidth: window.innerWidth,
      newGame: false,
      user: {id: null, name: null},
      players: [],
      step: 'HIDDEN',
      explode: false
    };
  },
  computed: {
    ...mapState(messageStore, ['room', 'player'])
  },
  mounted() {
    this.setWindowSize()
    window.addEventListener('resize', this.setWindowSize)
    this.setLoading(true)
    pokerPlanningApi.connect()
        .then((uuid) => {
          this.user.id = uuid
          pokerPlanningApi.subscribeRoom(this.$route.params.id)
              .then(() => {
                this.setLoading(false)
                this.$nextTick(() => {
                  if (this.player) {
                    // - si le joueur a créé la partie
                    // - ajout du player a la room
                    this.createPlayer(this.player.name);
                  } else {
                    // - si le joueur rejoint la partie
                    this.$refs['playermodal'].show()
                  }
                })
              })
        })
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.setWindowSize)
  },
  methods: {
    ...mapActions(messageStore, ['setPlayer', 'setRoom', 'setLoading']),
    setWindowSize() {
      this.windowHeight = window.innerHeight
      this.windowWidth = window.innerWidth
    },
    makeToast() {
      this.$bvToast.toast('Moyenne du poker planning : ' + this.averageNote(), {
        noCloseButton: true,
        autoHideDelay: 9000,
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
    consensus() {
      let card;
      for (let p in this.players) {
        if (!isNaN(this.players[p].card) && null !== this.players[p].card) {
          if (!card) {
            card = this.players[p].card
          } else if (card !== this.players[p].card) {
            return false;
          }
        }
      }
      return true
    },
    createPlayer(name) {
      this.user.name = name
      pokerPlanningApi.addPlayer(this.$route.params.id, this.user).then(
          () => {
            this.setPlayer({id: this.user.id, name: this.user.name})
            this.$refs['playermodal'].hide()
          }
      )
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
      this.setPlayer({id: this.player.id, name: this.player.name, card: card})
      await pokerPlanningApi.play(this.room.id, this.player)
    },
    async revealCard() {
      await pokerPlanningApi.revealGame(this.room.id)
    },
    async resetCard() {
      await pokerPlanningApi.resetGame(this.room.id)
    }
  },
  watch: {
    room(room) {
      console.log(room)
      this.players.length = 0
      this.players.push(...room.players ?? [])
      this.step = room.step
      this.step === 'REVEAL' ? this.makeToast() : null;
      this.explode = this.step === 'REVEAL' ? this.consensus() : false;
    },
  },
};
</script>
<style>

.avatar {
  position: absolute;
}

.username {
  font-family: 'tahoma', sans-serif;
  font-size: 1em;
  text-align: center;
}
</style>