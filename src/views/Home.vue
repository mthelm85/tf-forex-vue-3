<template lang="html">
  <div id="app">
    <v-app>
      <v-content>
        <v-container>
          <v-btn v-if="disabled" color="success" @click="prepData">Prep Data</v-btn>
          <v-btn v-else color="success" @click="trainModel">Train Model</v-btn>
          <Chart :chartData="chartDataArrays"></Chart>
        </v-container>
        <v-container>
          <Predictor></Predictor>
        </v-container>
      </v-content>
    </v-app>
  </div>
</template>

<script>
import Chart from '@/components/Chart.vue'
import Predictor from '@/components/Predictor.vue'
export default {
  name: 'Home',
  data () {
    return {
      disabled: true,
      batchSize: 32,
      indexBegin: 0,
      indexEnd: 32,
      features: [],
      labels: [],
      modelData: {
        trainingFeatures: [],
        trainingLabels: [],
        testFeatures: [],
        testLabels: []
      },
      predictions: []
    }
  },

  components: {
    Chart,
    Predictor
  },

  computed: {
    chartDataArrays () {
      let data = {
        test: [],
        predictions: []
      }
      for (let i = 0; i < this.predictions.length; i++) {
        data.test.push(this.modelData.testLabels[i][0])
        data.predictions.push(this.predictions[i])
      }
      return data
    },
    iterations () {
      return Math.floor((this.features.length - (this.batchSize * 2)) / this.batchSize)
    }
  },

  methods: {
    async prepData () {
      // Fetch candlestick data from Oanda
      let res = await this.$getCandlesticks('EUR_USD', 100, 0, 'M30')
      console.log(res)
      let resThird = Math.floor(res.candles.length / 3)
      // Loop through returned data, starting at index 0, push vol, o, h, l, c to features array
      for (let i = 0; i < (resThird - 3); i += 3) {
        this.features.push([
          res.candles[i].volume / 10000,
          1 / Number(res.candles[i].bid.o),
          1 / Number(res.candles[i].bid.h),
          1 / Number(res.candles[i].bid.l),
          1 / Number(res.candles[i].bid.c),
          res.candles[i + 1].volume / 10000,
          1 / Number(res.candles[i + 1].bid.o),
          1 / Number(res.candles[i + 1].bid.h),
          1 / Number(res.candles[i + 1].bid.l),
          1 / Number(res.candles[i + 1].bid.c),
          res.candles[i + 2].volume / 10000,
          1 / Number(res.candles[i + 2].bid.o),
          1 / Number(res.candles[i + 2].bid.h),
          1 / Number(res.candles[i + 2].bid.l),
          1 / Number(res.candles[i + 2].bid.c)
        ])
      }
      // Loop through returned data, starting at index 1, push closing price to labels array
      for (let i = 3; i < resThird; i += 3) {
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
        this.modelData.trainingFeatures.push(batchedFeatures)
        this.modelData.trainingLabels.push(batchedLabels)
      }
      // Loop through features/labels, separate out test data into their arrays
      for (let i = (this.batchSize * this.iterations); i < ((this.batchSize * 2) + (this.batchSize * this.iterations)); i++) {
        this.modelData.testFeatures.push(this.features[i])
        this.modelData.testLabels.push(this.labels[i])
      }
      this.disabled = false
    },
    async trainModel () {
      let predictions = await this.$train(this.modelData)
      for (let i = 0; i < predictions.length; i++) {
        this.predictions.push(predictions[i])
      }
    }
  }
}
</script>

<style scoped lang="css">
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
