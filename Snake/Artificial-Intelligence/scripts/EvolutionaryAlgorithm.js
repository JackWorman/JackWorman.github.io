"use strict";

import {NeuralNetwork} from "./NeuralNetwork.js";

export class EvolutionaryAlgorithm {
  constructor(numNeuralNetworks, inputLayerSize, hiddenLayerSize, outputLayerSize) {
    this.neuralNetworks = [];
    for (let i = 0; i < numNeuralNetworks; i++) {
      this.neuralNetworks.push(new NeuralNetwork(inputLayerSize, hiddenLayerSize, outputLayerSize));
    }
    this.mutationRate = 0.02;
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

  proportionalSelectionMutate() {
    const proportionalWeights = [];
    for (let i = 0; i < this.neuralNetworks.length; i++) {
      for (let j = 0; j < this.neuralNetworks[i].fitness; j++) {
        proportionalWeights.push(i);
      }
    }
    // Copues
    for (let i = 0; i < 2000; i++) {
      const index = proportionalWeights[Math.floor(proportionalWeights.length * Math.random())];
      const copyNN = this.neuralNetworks[index];
      copyNN.mutate(this.mutationRate);
      this.neuralNetworks.push(copyNN);
    }
    // Removes the old generation.
    this.neuralNetworks.splice(0, 2000);
  }

  mutate() {
    // Remove the last 1950 neural networks.
    this.neuralNetworks.splice(50);
    const copy = this.neuralNetworks.slice(0);
    // Copy the first 200 neural networks 9 times.
    for (let i = 0; i < 39; i++) {
      this.neuralNetworks = this.neuralNetworks.concat(copy);
    }
    // Mutate the last 1800 neural networks.
    for (let i = 50; i < this.neuralNetworks.length; i++) {
      this.neuralNetworks[i].mutate(this.mutationRate);
    }
  }

  clearFitness() {
    for (let i = 0; i < this.neuralNetworks.length; i++) {
      this.neuralNetworks[i].fitness = 0;
    }
  }
}
