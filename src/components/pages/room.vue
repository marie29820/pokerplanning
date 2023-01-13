<template>
  <b-container class="bv-example-row">
    <b-row class="text-center">
      <b-col v-for="player in players" :key="player.id">
        <b-row>
          <b-col>
            <b-avatar size="4rem"></b-avatar>
            <p>{{ player.name }}</p>
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <b-img v-if="!player.card" :src="require('@/assets/icons8-unavailable-48.png')"></b-img>
            <b-img v-if="player.card === 'hidden'" :src="require('@/assets/icons8-ok-48.png')"></b-img>
            <b-button
                disabled
                v-if="player.card === 'reveal'"
                variant="primary">
              {{ player.value }}
            </b-button>
          </b-col>
        </b-row>
      </b-col>
    </b-row>

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
      user: {},
      players: [
        {id: 1, name: 'gerard', card: 'hidden'},
        {id: 2, name: 'gerard2', card: 'reveal', value: '3'},
        {id: 3, name: 'gerard3'},
        {id: 4, name: 'gerard4'}
      ],
    };
  },
  created() {
    this.user = {id: '1234567892', name: 'cedric'}
  },
  methods: {
    updateCard(card) {
      console.log(card)
    }
  },
};
</script>