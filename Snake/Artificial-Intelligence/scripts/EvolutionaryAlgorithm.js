"use strict";

import {NeuralNetwork} from "./NeuralNetwork.js";

export class EvolutionaryAlgorithm {
  constructor(numNeuralNetworks, inputLayerSize, hiddenLayerSize, outputLayerSize) {
    this.neuralNetworks = [];
    for (let i = 0; i < numNeuralNetworks; i++) {
      this.neuralNetworks.push(new NeuralNetwork(inputLayerSize, hiddenLayerSize, outputLayerSize));
    }
    this.mutationRate = 0.2;
    this.generation = 0;
    this.specie = 0;
  }

  initializeAllNeuralNetworks() {
    for (const neuralNetwork of this.neuralNetworks) {
      neuralNetwork.initializeWeightsAndBiases();
    }
  }

  sort() {
    this.neuralNetworks.sort((a, b) => { return b.fitness - a.fitness; });
  }

  mutate() {
    // Remove the last 1800 neural networks.
    this.neuralNetworks = this.neuralNetworks.splice(200);
    console.log(this.neuralNetworks);
    // Copy the first 200 neural networks 9 times.
    for (let i = 0; i < 9; i++) {
      this.neuralNetworks = this.neuralNetworks.concat(this.neuralNetworks);
    }
    console.log(this.neuralNetworks);
    // Mutate the last 1800 neural networks.
    for (let i = 200; i < this.neuralNetworks.length; i++) {
      this.neuralNetworks[i].mutate(this.mutationRate);
    }
  }
}
