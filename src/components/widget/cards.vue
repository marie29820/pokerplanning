<template>

  <b-list-group>
    <b-list-group-item>
      {{user.name}}
      <b-avatar  variant="info" size="3rem"></b-avatar>
      <b-button
          class="mx-2 my-2"
          v-for="card in cards" :key="card"
          @click="choose(card)"
          :variant="clicked === card? 'primary' : 'outline-primary'">
        <b-img v-if="card.text === 'coffee'" :src="require('@/assets/icons8-cafe-24.png')"></b-img>
        <span v-else>{{ card.text }}</span>
      </b-button>
    </b-list-group-item>
  </b-list-group>

</template>

<script>
export default {
  name: "cards",
  props: {
    user: {},
  },
  data() {
    return {
      clicked: {},
      cards: [
        {text: '0'}, {text: '1'}, {text: '2'}, {text: '3'}, {text: '5'}, {text: '8'},
        {text: '13'}, {text: '21'}, {text: '34'}, {text: '55'}, {text: '89'}, {text: '?'}, {text: 'coffee'},
      ],
    };
  },
  async created() {
  },
  methods: {
    choose(card) {
      if (this.clicked === card) {
        this.clicked = {}
      } else {
        this.clicked = {}
        this.clicked = card
      }
      this.$emit('update-card', this.clicked);
    }
  },
};
</script>

<style scoped>

</style>