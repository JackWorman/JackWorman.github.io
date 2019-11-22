"use strict";

import {Matrix} from "./Matrix.js";
import {gaussianRandom} from "./GaussianRandom.js";

const nextGaussianRandom = gaussianRandom(0, 5);

export class NeuralNetwork {
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
    for (let row = 0; row < this.w1.numRows; row++) {
      for (let col = 0; col < this.w1.numCols; col++) {
        this.w1.elements[row][col] = nextGaussianRandom();
      }
      this.b1.elements[row][0] = 0;
    }
    for (let row = 0; row < this.w2.numRows; row++) {
      for (let col = 0; col < this.w2.numCols; col++) {
        this.w2.elements[row][col] = nextGaussianRandom();
      }
      this.b2.elements[row][0] = 0;
    }
  }

  calculateOutputs() {
    this.hL = this.sigmoid(Matrix.add(Matrix.multiply(this.w1, this.i), this.b1));
    this.o = this.sigmoid(Matrix.add(Matrix.multiply(this.w2, this.hL), this.b2));
  }

  sigmoid(m) {
    for (let row = 0; row < m.numRows; row++) {
      m.elements[row][0] = 1 / (1 + Math.pow(Math.E, -1 * m.elements[row][0]));
    }
    return m;
  }

  mutate(rate) {
    // Mutate the first set of weights and biases.
    for (let row = 0; row < this.w1.numRows; row++) {
      for (let col = 0; col < this.w1.numCols; col++) {
        if (rate <= Math.random()) {
            this.w1.elements[row][col] += nextGaussianRandom();
        }
      }
      if (rate <= Math.random()) {
          this.b1.elements[row][0] += nextGaussianRandom();
      }
    }
    // Mutate the second set of weights and biases.
    for (let row = 0; row < this.w2.numRows; row++) {
      for (let col = 0; col < this.w2.numCols; col++) {
        if (rate <= Math.random()) {
            this.w2.elements[row][col] += nextGaussianRandom();
        }
      }
      if (rate <= Math.random()) {
          this.b2.elements[row][0] += nextGaussianRandom();
      }
    }
  }
}
