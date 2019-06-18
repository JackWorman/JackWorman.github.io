function gaussian(mean, stdev) {
  var y2;
  var use_last = false;
  return function() {
    var y1;
    if(use_last) {
      y1 = y2;
      use_last = false;
    } else {
      var x1, x2, w;
      do {
        x1 = 2.0 * Math.random() - 1.0;
        x2 = 2.0 * Math.random() - 1.0;
        w  = x1 * x1 + x2 * x2;
      } while( w >= 1.0);
      w = Math.sqrt((-2.0 * Math.log(w))/w);
      y1 = x1 * w;
      y2 = x2 * w;
      use_last = true;
    }
    return mean + stdev * y1;
  }
}
var gaussianRandom = this.gaussian(0, 1);

class NeuralNetwork {
  constructor(numInputNodes, numHiddenLayerNodes, numOutputNodes) {
    this.inputs = new Matrix(numInputNodes, 1);

    this.weights1 = new Matrix(numHiddenLayerNodes, numInputNodes);
    this.biases1 = new Matrix(numHiddenLayerNodes, 1);

    this.hiddenLayer1 = new Matrix(numHiddenLayerNodes, 1);

    this.weights2 = new Matrix(numOutputNodes, numHiddenLayerNodes);
    this.biases2 = new Matrix(numOutputNodes, 1);

    this.outputs = new Matrix(numOutputNodes, 1);

    this.fitness = 0;
  }

  initializeWeightsAndBiases() {
    for (var row = 0; row < this.weights1.numRows; row++) {
      for (var col = 0; col < this.weights1.numCols; col++) {
        this.weights1.elements[row][col] = gaussianRandom();
      }
      this.biases1.elements[row][0] = 0.01;
    }
    for (var row = 0; row < this.weights2.numRows; row++) {
      for (var col = 0; col < this.weights2.numCols; col++) {
        this.weights2.elements[row][col] = gaussianRandom();
      }
      this.biases2.elements[row][0] = 0.01;
    }
  }

  calculateOutputs() {
    this.hiddenLayer1 = this.tanh(Matrix.add(Matrix.multiply(this.weights1, this.inputs), this.biases1));
    this.outputs = this.tanh(Matrix.add(Matrix.multiply(this.weights2, this.hiddenLayer1), this.biases2));
  }

  tanh(m) {
    for (var row = 0; row < m.numRows; row++) {
      m.elements[row][0] = Math.tanh(m.elements[row][0]);
    }
    return m;
  }

  mutate(rate) {
    for (var row = 0; row < this.weights1.numRows; row++) {
      for (var col = 0; col < this.weights1.numCols; col++) {
        if (rate <= Math.random()) {
            this.weights1.elements[row][col] *= gaussianRandom();
        }
      }
      if (rate <= Math.random()) {
          this.biases1.elements[row][0] *= gaussianRandom();
      }
    }
    for (var row = 0; row < this.weights2.numRows; row++) {
      for (var col = 0; col < this.weights2.numCols; col++) {
        if (rate <= Math.random()) {
            this.weights2.elements[row][col] *= gaussianRandom();
        }
      }
      if (rate <= Math.random()) {
          this.biases2.elements[row][0] *= gaussianRandom();
      }
    }
  }
}
