<template lang="html">
  <v-container>
    <v-layout justify-center>
      <span class="display-1 text-xs-center">TensorFlow Model</span>
    </v-layout>
    <line-chart :refresh="15" :data="data" :min="0.845" :max="0.875"></line-chart>
    <v-btn color="secondary" @click="loadChart">Load Chart</v-btn>
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
      for (let i = 0; i < 64; i++) {
        this.testLabels.push([i, this.chartData.test[i]])
        this.predictedLabels.push([i, this.chartData.predictions[i]])
      }
      this.accuracyRate()
    }
  },

  props: ['chartData']
}
</script>

<style lang="css">
</style>
