class EvolutionaryAlgorithm {
  constructor(numNeuralNetworks, numInputsPerNetwork, numHiddenLayerNodes, numOutputsPerNetwork) {
    this.nN = new Array(numNeuralNetworks);
    for (var i = 0; i < numNeuralNetworks; i++) {
      this.nN[i] = new NeuralNetwork(numInputsPerNetwork, numHiddenLayerNodes, numOutputsPerNetwork);
    }
  }

  initializeAllNeuralNetworks() {
    for (var i = 0; i < this.nN.length; i++) {
      this.nN[i].initializeWeightsAndBiases();
    }
    this.gen = 0;
    this.species = -1;
  }

  sort() {
    this.nN.sort(function(a, b) { return b.fitness - a.fitness });
  }

  mutate() {
    for (var i = 0; i < 9; i++) { // runs 9 times
      for (var j = 0; j < this.nN.length * 0.1; j++) { // runs 200 times
        for (var row = 0; row < this.nN[i].w1.numRows; row++) {
          for (var col = 0; col < this.nN[i].w1.numCols; col++) {
            this.nN[this.nN.length * 0.1 + (i * 200) + j].w1.elements[row][col] = this.nN[j].w1.elements[row][col];
          }
          this.nN[this.nN.length * 0.1 + (i * 200) + j].b1.elements[row][col] = this.nN[j].b1.elements[row][col];
        }
        for (var row = 0; row < this.nN[i].w2.numRows; row++) {
          for (var col = 0; col < this.nN[i].w2.numCols; col++) {
            this.nN[this.nN.length * 0.1 + (i * 200) + j].w2.elements[row][col] = this.nN[j].w2.elements[row][col];
          }
          this.nN[this.nN.length * 0.1 + (i * 200) + j].b2.elements[row][col] = this.nN[j].b2.elements[row][col];
        }
        this.nN[this.nN.length * 0.1 + (i * 200) + j].mutate();
      }
    }
  }
}
