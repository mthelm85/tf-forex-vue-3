<template lang="html">
  <v-container>
    <line-chart :refresh="15" :data="data" :min="0.84" :max="0.88"></line-chart>
    <v-btn color="secondary" @click="loadChart">Load Chart</v-btn>
  </v-container>
</template>

<script>
export default {
  name: 'Chart',
  data () {
    return {
      data: [
        { name: 'Test Labels', data: [] },
        { name: 'Predicted Labels', data: [] }
      ]
    }
  },

  methods: {
    loadChart () {
      for (let i = 0; i < 50; i++) {
        this.data[0].data.push([i, this.chartData.test[i]])
        this.data[1].data.push([i, this.chartData.predictions[i]])
      }
    }
  },

  props: ['chartData']
}
</script>

<style lang="css">
</style>
