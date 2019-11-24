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
    console.log(`Before sort():`)
    console.log(this.neuralNetworks);
    this.neuralNetworks.sort((a, b) => { return b.fitness - a.fitness; });
    console.log(`After sort():`)
    console.log(this.neuralNetworks);
    alert(`sort`);
  }

  mutate() {
    console.log(`Before mutate():`);
    console.log(this.neuralNetworks);
    // Remove the last 1950 neural networks.
    this.neuralNetworks.splice(50);
    console.log(`After splice:`);
    console.log(this.neuralNetworks);
    const copy = this.neuralNetworks.slice(0);
    // Copy the first 200 neural networks 9 times.
    for (let i = 0; i < 39; i++) {
      this.neuralNetworks = this.neuralNetworks.concat(copy);
    }
    console.log(`After concat:`);
    console.log(this.neuralNetworks);
    // Mutate the last 1800 neural networks.
    for (let i = 50; i < this.neuralNetworks.length; i++) {
      this.neuralNetworks[i].mutate(this.mutationRate);
    }
    console.log(`After mutate():`);
    console.log(this.neuralNetworks);
    alert(`mutate`);
  }

  clearFitness() {
    console.log(`Before clearFitness():`);
    console.log(this.neuralNetworks);
    for (let i = 0; i < this.neuralNetworks.length; i++) {
      this.neuralNetworks[i].fitness = 0;
    }
    console.log(`After clearFitness():`);
    console.log(this.neuralNetworks);
    alert(`clearFitness`);
  }
}
