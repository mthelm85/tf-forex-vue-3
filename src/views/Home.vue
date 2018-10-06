<template lang="html">
  <div id="app">
    <v-app>
      <v-content>
        <v-container>
          <v-btn color="success" @click="train">Train</v-btn>
        </v-container>
      </v-content>
    </v-app>
  </div>
</template>

<script>
import * as tf from '@tensorflow/tfjs'
export default {
  name: 'Home',
  data () {
    return {
      batchSize: 128,
      indexBegin: 0,
      indexEnd: 128,
      features: [],
      labels: [],
      trainingFeatures: [],
      trainingLabels: [],
      testFeatures: [],
      testLabels: []
    }
  },

  computed: {
    iterations () {
      return Math.floor((this.features.length - (this.batchSize * 4)) / this.batchSize)
    }
  },

  methods: {
    async train () {
      // Fetch candlestick data from Oanda
      let res = await this.$candlesM4('EUR_USD', 13, 0)
      // Loop through returned data, starting at index 0, push vol, o, h, l, c to features array
      for (let i = 0; i < (res.candles.length - 1); i++) {
        this.features.push([
          res.candles[i].volume / 10000,
          1 / Number(res.candles[i].bid.o),
          1 / Number(res.candles[i].bid.h),
          1 / Number(res.candles[i].bid.l),
          1 / Number(res.candles[i].bid.c)
        ])
      }
      // Loop through returned data, starting at index 1, push closing price to labels array
      for (let i = 1; i < res.candles.length; i++) {
        this.labels.push([1 / res.candles[i].bid.c])
      }
      // Separate the features/labels into batches of size this.batchSize
      let batchedFeatures = [] // Temporary storage array to store arrays of length this.batchSize
      let batchedLabels = []
      // Loop through features/labels arrays, slice into individual arrays of length this.batchSize
      for (let i = 0; i < this.iterations; i++) {
        batchedFeatures.length = 0
        batchedLabels.length = 0
        let slicedFeatures = this.features.slice(this.indexBegin, this.indexEnd)
        let slicedLabels = this.labels.slice(this.indexBegin, this.indexEnd)
        this.indexBegin += this.batchSize
        this.indexEnd += this.batchSize
        // Loop through sliced arrays, push data to temporary arrays
        for (let i = 0; i < this.batchSize; i++) {
          batchedFeatures.push(slicedFeatures[i])
          batchedLabels.push(slicedLabels[i])
        }
        this.trainingFeatures.push(batchedFeatures)
        this.trainingLabels.push(batchedLabels)
      }
      // Loop through features/labels, separate out test data into their arrays
      for (let i = (this.batchSize * this.iterations); i < this.features.length; i++) {
        this.testFeatures.push(this.features[i])
        this.testLabels.push(this.labels[i])
      }
    }
  }
}
</script>

<style lang="css">
</style>
