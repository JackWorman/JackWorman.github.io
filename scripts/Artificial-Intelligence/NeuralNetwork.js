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
      } while(w >= 1.0);
      w = Math.sqrt((-2.0 * Math.log(w)) / w);
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
    this.i = new Matrix(numInputNodes, 1);
    this.w1 = new Matrix(numHiddenLayerNodes, numInputNodes);
    this.b1 = new Matrix(numHiddenLayerNodes, 1);
    this.hL = new Matrix(numHiddenLayerNodes, 1);
    this.w2 = new Matrix(numOutputNodes, numHiddenLayerNodes);
    this.b2 = new Matrix(numOutputNodes, 1);
    this.o = new Matrix(numOutputNodes, 1);
    this.fitness = 0;
  }

  initializeWeightsAndBiases() {
    for (var row = 0; row < this.w1.numRows; row++) {
      for (var col = 0; col < this.w1.numCols; col++) {
        this.w1.elements[row][col] = gaussianRandom();
      }
      this.b1.elements[row][0] = 0.01;
    }
    for (var row = 0; row < this.w2.numRows; row++) {
      for (var col = 0; col < this.w2.numCols; col++) {
        this.w2.elements[row][col] = gaussianRandom();
      }
      this.b2.elements[row][0] = 0.01;
    }
  }

  calculateOutputs() {
    this.hL = this.tanh(Matrix.add(Matrix.multiply(this.w1, this.i), this.b1));
    this.o = this.tanh(Matrix.add(Matrix.multiply(this.w2, this.hL), this.b2));
  }

  tanh(m) {
    for (var row = 0; row < m.numRows; row++) {
      m.elements[row][0] = Math.tanh(m.elements[row][0]);
    }
    return m;
  }

  mutate(rate) {
    // Mutate the first set of weights and biases.
    for (var row = 0; row < this.w1.numRows; row++) {
      for (var col = 0; col < this.w1.numCols; col++) {
        if (rate <= Math.random()) {
            this.w1.elements[row][col] += gaussianRandom();
        }
      }
      if (rate <= Math.random()) {
          this.b1.elements[row][0] += gaussianRandom();
      }
    }
    // Mutate the second set of weights and biases.
    for (var row = 0; row < this.w2.numRows; row++) {
      for (var col = 0; col < this.w2.numCols; col++) {
        if (rate <= Math.random()) {
            this.w2.elements[row][col] += gaussianRandom();
        }
      }
      if (rate <= Math.random()) {
          this.b2.elements[row][0] += gaussianRandom();
      }
    }
  }
}
