class EvolutionaryAlgorithm {
  constructor(numNeuralNetworks, numInputsPerNetwork, numOutputsPerNetwork) {
    this.neuralNetworks = new Array(numNeuralNetworks);
    for (var i = 0; i < numNeuralNetworks; i++) {
      this.neuralNetworks[i] = new NeuralNetwork(numInputsPerNetwork, numOutputsPerNetwork);
    }
  }

  initializeAllNeuralNetworks() {
    for (var i = 0; i < this.neuralNetworks.length; i++) {
      this.neuralNetworks[i].initializeWeightsAndBiases();
    }
    this.generation = 0;
    this.activeSpecies = -1;
  }

  sort() {
    this.neuralNetworks.sort(function(a, b) { return b.fitness-a.fitness });
  }

  mutate() {
    for (var i = 0; i < this.neuralNetworks.length/2; i++) {
      this.neuralNetworks[this.neuralNetworks.length/2 + i] = 0;
    }
  }
}
