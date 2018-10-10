<template lang="html">
  <v-container>
    <line-chart :refresh="15" :data="data" :min="0.85" :max="0.865"></line-chart>
    <v-btn color="secondary" @click="loadChart">Load Chart</v-btn>
    <v-btn color="secondary" @click="accuracyRate">Accuracy</v-btn>
    <span>{{ rate }}%</span>
  </v-container>
</template>

<script>
export default {
  name: 'Chart',
  data () {
    return {
      testLabels: [],
      predictedLabels: [],
      testGreaterLess: [],
      predictionsGreaterLess: [],
      accurates: [],
      rate: null
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
    accuracyRate () {
      for (let i = 1; i < this.chartData.test.length; i++) {
        this.testGreaterLess.push(this.chartData.test[i] > this.chartData.test[i - 1] ? 1 : 0)
        this.predictionsGreaterLess.push(this.chartData.predictions[i] > this.chartData.predictions[i - 1] ? 1 : 0)
      }
      for (let i = 0; i < this.testGreaterLess.length; i++) {
        if (this.testGreaterLess[i] === this.predictionsGreaterLess[i]) {
          this.accurates.push(this.testGreaterLess[i])
        }
      }
      this.rate = ((this.accurates.length / this.testGreaterLess.length) * 100).toFixed(2)
    },
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
