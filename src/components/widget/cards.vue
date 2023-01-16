<template>

  <b-list-group>
    <b-list-group-item>
      <b-avatar variant="info" size="3rem"></b-avatar>
      <b-button
          v-for="card in cards" :key="card"
          :class="[card === this.clicked?  '':'min-button', 'mx-2 my-2' ]"
          @click="choose(card)"
          :variant="card === this.clicked? 'primary':'outline-primary' "
      >
        <b-img v-if="card.value === 'coffee'" :src="require('@/assets/icons8-cafe-24.png')"></b-img>
        <span v-else>{{ card.value }}</span>
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
  computed: {
  },
  data() {
    return {
      clicked: {},
      cards: [
        {value: '0'}, {value: '1'}, {value: '2'}, {value: '3'}, {value: '5'}, {value: '8'},
        {value: '13'}, {value: '21'}, {value: '34'}, {value: '55'}, {value: '89'}, {value: '?'}, {value: 'coffee'},
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
      this.$emit('update-card', this.clicked.value);
    }
  },
};
</script>

<style scoped>
.min-button:hover{
  background-color: white;
  color: #007bff;
  border-color: #007bff;
}
</style>