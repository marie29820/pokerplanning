<template>
  <b-container class="bv-example-row">
    <b-row class="m-lg-2" align-v="center">
      <b-col class="md-12 d-flex justify-content-center" :style="{paddingTop: calculerPaddingTop()}">
        <div v-for="(player, i) in players" :key="player.id" class="avatar"
             :style="{transform: `rotate(${360 / players.length * i}deg) translate(${calculerTranslateX()},
             ${calculerTranslateY(windowHeight)})`}">
          <div :style="{transform: `rotate(${360 - (360 / players.length * i)}deg) translate(0,0)`}">
            <b-avatar
                v-if="player.card !== 'reveal'"
                size="3rem"
                :variant="getAvatarStyle(player)"></b-avatar>
            <b-button
                disabled
                v-if="player.card === 'reveal'"
                variant="primary">
              {{ player.value }}
            </b-button>
            <p style="font-size: 0.8em">{{ player.name }}</p>
          </div>
        </div>
      </b-col>
    </b-row>

    <!--${360 / players.length * i}-->
    <div class="fixed-bottom">
      <b-row class="text-center">
        <b-col>
          <cards @update-card="updateCard" :user="user"></cards>
        </b-col>
      </b-row>
    </div>
  </b-container>
</template>

<script>


import Cards from "@/components/widget/cards.vue";

export default {
  components: {Cards},
  data() {
    return {
      windowHeight: window.innerHeight,
      windowWidth: window.innerWidth,
      user: {},
      players: [
        {id: 1234567892, name: 'cedric'},
        {id: 1, name: 'gerard', card: 'hidden'},
        {id: 2, name: 'gerard2'},
        {id: 3, name: 'gerard3'},
        {id: 4, name: 'gerard4'},
        {id: 5, name: 'gerard', card: 'hidden'},
        {id: 6, name: 'gerard2'},
        {id: 7, name: 'gerard3'},
        {id: 8, name: 'gerard4'},
        {id: 9, name: 'gerard2'},
        {id: 10, name: 'gerard3'},

      ],
    };
  },
  created() {
    this.user = {id: 1234567892, name: 'cedric'}
  },
  methods: {
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
      switch (player.card) {
        case 'hidden':
        case 'reveal':
          return "success"
        default:
          return "secondary"
      }
    },
    updateCard(card) {
       this.players.map(p => {
        if(p.id === this.user.id){
          p.card = card.text? 'hidden':'';
          p.value = card.text
        }
      });

    }
  }
};
</script>
<style>

.avatar {
  position: absolute;
}
</style>