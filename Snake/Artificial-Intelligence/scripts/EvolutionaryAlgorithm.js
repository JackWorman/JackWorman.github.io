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


    this.parent1s = [];
    this.parent2s = [];
  }

  initialize() {
    for (const neuralNetwork of this.neuralNetworks) {
      neuralNetwork.initializeWeightsAndBiases();
    }
  }

  evaluateFitness(apples, steps) {
    const neuralNetwork = this.neuralNetworks[this.specie];
    neuralNetwork.fitness =
      steps
      + (Math.pow(2, apples) + Math.pow(apples, 2.1) * 500)
      - (Math.pow(apples, 1.2) * Math.pow(0.25 * steps, 1.3));
  }

  sort() {
    this.neuralNetworks.sort((a, b) => { return b.fitness - a.fitness; });
  }

  selectParents() {
    this.parent1s = [];
    this.parent2s = [];
    const proportionalWeights = [];
    for (let i = 0; i < this.neuralNetworks.length; i++) {
      for (let j = 0; j < this.neuralNetworks[i].fitness; j++) {
        proportionalWeights.push(i);
      }
    }
    for (let i = 0; i < 1950; i++) {
      const index1 = proportionalWeights[Math.floor(proportionalWeights.length * Math.random())];
      const index2 = proportionalWeights[Math.floor(proportionalWeights.length * Math.random())];
      this.parent1s.push(this.neuralNetworks[index1]);
      this.parent2s.push(this.neuralNetworks[index2]);
    }
  }

  crossover() {
    for (let i = 0; i < 1950; i++) {
      const child = new NeuralNetwork(28, 16, 4);
      for (let row = 0; row < child.w1.numRows; row++) {
        for (let col = 0; col < child.w1.numCols; col++) {
          if (Math.random() < 0.5) {
            child.w1.elements[row][col] = this.parent1s[i].w1.elements[row][col];
          } else {
            child.w1.elements[row][col] = this.parent2s[i].w1.elements[row][col];
          }
        }
        if (Math.random() < 0.5) {
          child.b1.elements[row][0] = this.parent1s[i].b1.elements[row][0];
        } else {
          child.b1.elements[row][0] = this.parent2s[i].b1.elements[row][0];
        }
      }
      for (let row = 0; row < child.w2.numRows; row++) {
        for (let col = 0; col < child.w2.numCols; col++) {
          if (Math.random() < 0.5) {
            child.w2.elements[row][col] = this.parent1s[i].w2.elements[row][col];
          } else {
            child.w2.elements[row][col] = this.parent2s[i].w2.elements[row][col];
          }
        }
        if (Math.random() < 0.5) {
          child.b2.elements[row][0] = this.parent1s[i].b2.elements[row][0];
        } else {
          child.b2.elements[row][0] = this.parent2s[i].b2.elements[row][0];
        }
      }
      this.neuralNetworks.push(child);
    }
  }

  mutate() {
    for (let i = 2000; i < this.neuralNetworks.length; i++) {
      this.neuralNetworks[i].mutate(this.mutationRate);
    }
  }

  elitism() {
    this.neuralNetworks.splice(50, 1950);
  }
}
