<template lang="html">
  <v-container>
    <v-btn @click="last3Candles">Candles</v-btn>
  </v-container>
</template>

<script>
import * as tf from '@tensorflow/tfjs'
export default {
  data () {
    return {

    }
  },

  methods: {
    async last3Candles () {
      let res = await this.$candlesM4('EUR_USD', 0.5, 0, 'M4')
      console.log(res)
    }
  }
}
</script>

<style lang="css">
</style>
