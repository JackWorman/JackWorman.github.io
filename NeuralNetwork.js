class NeuralNetwork {
  constructor(numInputs, numOutputs) {
    this.inputs = new Matrix(numInputs, 1);
    this.weights = new Matrix(numOutputs, numInputs);
    this.biases = new Matrix(numOutputs, 1);
    this.outputs = new Matrix(numOutputs, 1);
    this.fitness = 0;
  }

  initializeWeightsAndBiases() {
    for (var row = 0; row < this.weights.numRows; row++) {
      for (var col = 0; col < this.weights.numCols; col++) {
        this.weights.elements[row][col] = Math.random() * 2 - 1;
      }
      this.biases.elements[row][0] = Math.random() * 2 * this.biases.numRows - this.biases.numRows;
    }
  }

  calculateOutputs() {
    this.outputs = this.sigmoid(Matrix.add(Matrix.multiply(this.weights, this.inputs), this.biases));
  }

  sigmoid(m) {
    for (var row = 0; row < m.numRows; row++) {
      m.elements[row][0] = 1 / (1 + Math.pow(Math.E, -1 * m.elements[row][0]));
    }

    return m;
  }
}
