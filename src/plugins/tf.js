import * as tf from '@tensorflow/tfjs'
export default {
  install: (Vue, options) => {
    const { modelSettings } = options
    const learningRate = modelSettings.learningRate
    const numInputs = modelSettings.numInputs
    const numOutputs = modelSettings.numOutputs
    const numNeurons = modelSettings.numNeurons
    const model = tf.sequential()
    const sgdOptimizer = tf.train.sgd(learningRate)

    const inputLayer = tf.layers.dense({
      units: numNeurons,
      inputShape: [numInputs],
      activation: 'relu'
    })

    const hiddenLayer = tf.layers.dense({
      units: numNeurons,
      activation: 'relu'
    })

    const outputLayer = tf.layers.dense({
      units: numOutputs
      // activation: 'relu'
    })

    model.add(inputLayer)
    model.add(hiddenLayer)
    model.add(outputLayer)

    model.compile({
      optimizer: sgdOptimizer,
      loss: 'meanSquaredError'
    })

    Vue.prototype.$train = async (data) => {
      for (let i = 0; i < data.trainingFeatures.length; i++) {
        let xs = tf.tensor(data.trainingFeatures[i], [32, 15])
        let ys = tf.tensor(data.trainingLabels[i], [32, 1])
        let configFit = {
          batchSize: modelSettings.batchSize,
          epochs: modelSettings.epochs
        }
        let response = await model.fit(xs, ys, configFit)
        let loss = response.history.loss[0]
        console.log(`Rd: ${i} Training Loss: ${loss}`)
      }
      let predictions = []
      for (let i = 0; i < data.testFeatures.length; i++) {
        predictions.push(model.predict(tf.tensor(data.testFeatures[i], [1, 15])).dataSync()[0])
      }
      model.save('indexeddb://tf-forex-model')
      return predictions
    }
  }
}
