<template lang="html">
  <v-container>
    <v-btn @click="last3Candles">Candles</v-btn>
    <v-btn @click="predict">Predict</v-btn>
  </v-container>
</template>

<script>
import * as tf from '@tensorflow/tfjs'
export default {
  data () {
    return {
      features: []
    }
  },

  methods: {
    async last3Candles () {
      let res = await this.$getCandlesticks('EUR_USD', 2, 0, 'M30')
      let lastItemIndex = res.candles.length - 1
      this.features.push(res.candles[lastItemIndex].volume / 10000)
      this.features.push(1 / Number(res.candles[lastItemIndex].bid.o))
      this.features.push(1 / Number(res.candles[lastItemIndex].bid.h))
      this.features.push(1 / Number(res.candles[lastItemIndex].bid.l))
      this.features.push(1 / Number(res.candles[lastItemIndex].bid.c))
      this.features.push(res.candles[lastItemIndex - 1].volume / 10000)
      this.features.push(1 / Number(res.candles[lastItemIndex - 1].bid.o))
      this.features.push(1 / Number(res.candles[lastItemIndex - 1].bid.h))
      this.features.push(1 / Number(res.candles[lastItemIndex - 1].bid.l))
      this.features.push(1 / Number(res.candles[lastItemIndex - 1].bid.c))
      this.features.push(res.candles[lastItemIndex - 2].volume / 10000)
      this.features.push(1 / Number(res.candles[lastItemIndex - 2].bid.o))
      this.features.push(1 / Number(res.candles[lastItemIndex - 2].bid.h))
      this.features.push(1 / Number(res.candles[lastItemIndex - 2].bid.l))
      this.features.push(1 / Number(res.candles[lastItemIndex - 2].bid.c))
    },

    async predict () {
      let model = await tf.loadModel('indexeddb://tf-forex-model')
      console.log(`Last Price: ${this.features[14]}`)
      console.log(`Next Price: ${model.predict(tf.tensor2d(this.features, [1, 15])).dataSync()[0]}`)
    }
  }
}
</script>

<style lang="css">
</style>
