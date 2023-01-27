<template>
  <b-list-group>
    <b-list-group-item>
      <b-button v-if="step !== 'REVEAL'"
                variant="info"
                @click="reveal"
      >Montrer les cartes
      </b-button>
      <b-button v-if="step === 'REVEAL'"
                variant="info"
                @click="reset"
      >Recommencer
      </b-button>
      <b-button
          :disabled="disabledcards"
          v-for="card in cards" :key="card"
          :class="[card.value === this.clicked.value?  '':'min-button', 'mx-2 my-2' ] "
          @click="choose(card)"
          :variant="card.value === this.clicked.value? 'primary':'outline-primary' "
      >
        <b-img v-if="card.value === 'coffee'" :src="require('@/assets/icons8-cafe-24.png')"></b-img>
        <span v-else>{{ card.value }}</span>
      </b-button>
    </b-list-group-item>
  </b-list-group>

</template>

<script>
import {mapState} from "pinia";
import {messageStore} from "@/store";

export default {
  name: "cards",
  computed: {
    ...mapState(messageStore, ['room', 'player'])
  },
  watch: {
    room(room) {
      // - sockjs via store
      this.step = room.step
    },
    step(step) {
      this.clicked = step === 'REVEAL' ? {} : this.clicked
      this.disabledcards = step === 'REVEAL'
    },
  },
  data() {
    return {
      clicked: {},
      step: 'HIDDEN',
      disabledcards: false,
      cards: [
        {value: '0'}, {value: '1'}, {value: '2'}, {value: '3'}, {value: '5'}, {value: '8'},
        {value: '13'}, {value: '21'}, {value: '34'}, {value: '55'}, {value: '89'}, {value: '?'}, {value: 'coffee'},
      ],
    };
  },
  mounted() {
    this.step = this.room.step
    if(this.player && this.player.card){
      this.clicked =  {value: this.player.card}
    }
  },

  methods: {
    choose(card) {
      this.clicked = this.clicked === card? {} : card
      this.$emit('update-card', this.clicked.value);
    },
    reveal() {
      this.$emit('revealGame-card');
    },
    reset() {
      this.$emit('resetGame-card');
    }
  },
};
</script>

<style scoped>
.min-button:hover {
  background-color: white;
  color: #007bff;
  border-color: #007bff;
}

</style>