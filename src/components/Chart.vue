<template lang="html">
  <v-container>
    <line-chart :refresh="15" :data="data" :min="0.85" :max="0.885"></line-chart>
    <v-btn color="secondary" @click="loadChart">Load Chart</v-btn>
  </v-container>
</template>

<script>
export default {
  name: 'Chart',
  data () {
    return {
      testLabels: [],
      predictedLabels: []
    }
  },

  computed: {
    data () {
      return [
        { name: 'Test Labels', data: this.testLabels },
        { name: 'Predicted Labels', data: this.predictedLabels }
      ]
    }
  },

  methods: {
    loadChart () {
      for (let i = 0; i < 100; i++) {
        this.testLabels.push([i, this.chartData.test[i]])
        this.predictedLabels.push([i, this.chartData.predictions[i]])
      }
    }
  },

  props: ['chartData']
}
</script>

<style lang="css">
</style>
