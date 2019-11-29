"use strict";

import {Matrix} from "./Matrix.js";
import {gaussianRandom} from "./GaussianRandom.js";

const nextGaussianRandom = gaussianRandom(0, 1);

export class NeuralNetwork {
  // constructor(numInputNodes, numHiddenLayerNodes, numOutputNodes) {
  constructor(layerSizes) { // layerSizes --> [28, 20, 12, 4]
    this.layers = [];
    this.weights = [];
    this.biases = [];
    for (let i = 0; i < layerSizes.length; i++) {
      this.layers.push(new Matrix(layerSizes[i], 1));
      if (i !== 0) {
        this.weights.push(new Matrix(layerSizes[i], layerSizes[i - 1]));
        this.biases.push(new Matrix(layerSizes[i], 1));
      }
    }

    // this.inputLayer = new Matrix(numInputNodes, 1);
    //
    // this.weights1 = new Matrix(numHiddenLayerNodes, numInputNodes);
    // this.biases1 = new Matrix(numHiddenLayerNodes, 1);
    // this.hiddenLayer1 = new Matrix(numHiddenLayerNodes, 1);
    //
    // this.weights2 = new Matrix(numOutputNodes, numHiddenLayerNodes);
    // this.biases2 = new Matrix(numOutputNodes, 1);
    // this.outputLayer = new Matrix(numOutputNodes, 1);

    this.fitness = 0;
  }

  initializeWeightsAndBiases() {
    for (let i = 0; i < this.weights.length; i++) {
      for (let row = 0; row < this.weights[i].numRows; row++) {
        for (let col = 0; col < this.weights[i].numCols; col++) {
          this.weights[i].elements[row][col] = 2*Math.random() - 1;
        }
        this.biases[i].elements[row][0] = 0;
      }
    }

    // for (let row = 0; row < this.weights1.numRows; row++) {
    //   for (let col = 0; col < this.weights1.numCols; col++) {
    //     this.weights1.elements[row][col] = Math.random()*2 - 1;
    //   }
    //   this.biases1.elements[row][0] = 0;
    // }
    // for (let row = 0; row < this.weights2.numRows; row++) {
    //   for (let col = 0; col < this.weights2.numCols; col++) {
    //     this.weights2.elements[row][col] = Math.random()*2 - 1;
    //   }
    //   this.biases1.elements[row][0] = 0;
    // }
  }

  calculateOutputs() {
    for (let i = 1; i < this.layers.length; i++) {
      if (i === this.layers.length - 1) {
        this.layers[i] = this.sigmoid(Matrix.add(Matrix.multiply(this.weights[i - 1], this.layers[i - 1]), this.biases[i - 1]));
      } else {
        this.layers[i] = this.relu(Matrix.add(Matrix.multiply(this.weights[i - 1], this.layers[i - 1]), this.biases[i - 1]));
      }
    }

    // this.hiddenLayer1 = this.relu(Matrix.add(Matrix.multiply(this.weights1, this.inputLayer), this.biases1));
    // this.outputLayer = this.sigmoid(Matrix.add(Matrix.multiply(this.weights2, this.hiddenLayer1), this.biases2));
  }

  sigmoid(m) {
    for (let row = 0; row < m.numRows; row++) {
      m.elements[row][0] = 1 / (1 + Math.pow(Math.E, -1 * m.elements[row][0]));
    }
    return m;
  }

  relu(m) {
    for (let row = 0; row < m.numRows; row++) {
      m.elements[row][0] = Math.max(0, m.elements[row][0]);
    }
    return m;
  }

  mutate(rate) {
    for (let i = 0; i < this.weights.length; i++) {
      for (let row = 0; row < this.weights[i].numRows; row++) {
        for (let col = 0; col < this.weights[i].numCols; col++) {
          if (Math.random() < rate) {
            this.weights[i].elements[row][col] += nextGaussianRandom();
            if (this.weights[i].elements[row][col] < -1) {
              this.weights[i].elements[row][col] = -1;
            }
            if (this.weights[i].elements[row][col] > 1) {
              this.weights[i].elements[row][col] = 1;
            }
          }
        }
        if (Math.random() < rate) {
          this.biases[i].elements[row][0] += nextGaussianRandom();
        }
      }
    }

  //   // Mutate the first set of weights and biases.
  //   for (let row = 0; row < this.weights1.numRows; row++) {
  //     for (let col = 0; col < this.weights1.numCols; col++) {
  //       if (Math.random() < rate) {
  //           this.weights1.elements[row][col] += nextGaussianRandom();
  //           if (this.weights1.elements[row][col] < -1) {
  //             this.weights1.elements[row][col] = -1;
  //           }
  //           if (this.weights1.elements[row][col] > 1) {
  //             this.weights1.elements[row][col] = 1;
  //           }
  //       }
  //     }
  //     if (Math.random() < rate) {
  //         this.biases1.elements[row][0] += nextGaussianRandom();
  //     }
  //   }
  //   // Mutate the second set of weights and biases.
  //   for (let row = 0; row < this.weights2.numRows; row++) {
  //     for (let col = 0; col < this.weights2.numCols; col++) {
  //       if (Math.random() < rate) {
  //           this.weights2.elements[row][col] += nextGaussianRandom();
  //           if (this.weights2.elements[row][col] < -1) {
  //             this.weights2.elements[row][col] = -1;
  //           }
  //           if (this.weights2.elements[row][col] > 1) {
  //             this.weights2.elements[row][col] = 1;
  //           }
  //       }
  //     }
  //     if (Math.random() < rate) {
  //         this.biases2.elements[row][0] += nextGaussianRandom();
  //     }
  //   }
  }
}
