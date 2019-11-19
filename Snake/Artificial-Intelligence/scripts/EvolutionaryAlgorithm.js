"use strict";

import {NeuralNetwork} from "./NeuralNetwork.js";

class EvolutionaryAlgorithm {
  constructor(numNeuralNetworks, numInputsPerNetwork, numHiddenLayerNodes, numOutputsPerNetwork) {
    this.neuralNetworks = new Array(numNeuralNetworks);
    for (let i = 0; i < numNeuralNetworks; i++) {
      this.neuralNetworks[i] = new NeuralNetwork(numInputsPerNetwork, numHiddenLayerNodes, numOutputsPerNetwork);
    }
    this.mutationRate = 0.2;
    this.survivalRate = 0.01;
  }

  initializeAllNeuralNetworks() {
    for (let i = 0; i < this.neuralNetworks.length; i++) {
      this.neuralNetworks[i].initializeWeightsAndBiases();
    }
    this.gen = 0;
    this.species = -1;
  }

  sort() {
    this.neuralNetworks.sort((a, b) => { return b.fitness - a.fitness });
  }

  mutate() {
    // TODO: add survivalRate variable
    for (let i = 0; i < 9; i++) { // runs 9 times
      for (let j = 0; j < this.neuralNetworks.length * 0.1; j++) { // runs 200 times
        for (let row = 0; row < this.neuralNetworks[i].w1.numRows; row++) {
          for (let col = 0; col < this.neuralNetworks[i].w1.numCols; col++) {
            this.neuralNetworks[this.neuralNetworks.length * 0.1 + (i * 200) + j].w1.elements[row][col] = this.neuralNetworks[j].w1.elements[row][col];
          }
          this.neuralNetworks[this.neuralNetworks.length * 0.1 + (i * 200) + j].b1.elements[row][col] = this.neuralNetworks[j].b1.elements[row][col];
        }
        for (let row = 0; row < this.neuralNetworks[i].w2.numRows; row++) {
          for (let col = 0; col < this.neuralNetworks[i].w2.numCols; col++) {
            this.neuralNetworks[this.neuralNetworks.length * 0.1 + (i * 200) + j].w2.elements[row][col] = this.neuralNetworks[j].w2.elements[row][col];
          }
          this.neuralNetworks[this.neuralNetworks.length * 0.1 + (i * 200) + j].b2.elements[row][col] = this.neuralNetworks[j].b2.elements[row][col];
        }
        this.neuralNetworks[this.neuralNetworks.length * 0.1 + (i * 200) + j].mutate(this.mutationRate);
      }
    }
  }
}
