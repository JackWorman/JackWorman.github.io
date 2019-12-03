"use strict";

import {NeuralNetwork} from "./NeuralNetwork.js";

export class EvolutionaryAlgorithm {
  constructor(populationSize, layerSizes, mutationRate, elitismRate) {
    this.populationSize = populationSize;
    this.layerSizes = layerSizes;
    this.neuralNetworks = [];
    for (let i = 0; i < populationSize; i++) {
      this.neuralNetworks.push(new NeuralNetwork(layerSizes));
    }
    this.mutationRate = mutationRate;
    this.elitismRate = elitismRate;
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

  evaluateFitness(apples) {
    this.neuralNetworks[this.specie].fitness = Math.pow(2*apples, 2);
  }

  sort() {
    this.neuralNetworks.sort((a, b) => { return b.fitness - a.fitness; });
  }

  selectParents() {
    // Calculate the sum of every neural networks fitness.
    let totalFitness = 0;
    for (const neuralNetwork of this.neuralNetworks) {
      totalFitness += neuralNetwork.fitness;
    }
    // Use the total fitness to select the parents randomly and porportional to their fitness.
    this.parent1s = [];
    this.parent2s = [];
    for (let i = 0; i < this.populationSize - Math.round(this.elitismRate * this.populationSize); i++) {
      let fitnessCutoff = Math.random() * totalFitness;
      let accumulatedFitness = 0;
      for (const neuralNetwork of this.neuralNetworks) {
        accumulatedFitness += neuralNetwork.fitness;
        if (fitnessCutoff < accumulatedFitness) {
          this.parent1s.push(neuralNetwork);
          break;
        }
      }
      fitnessCutoff = Math.random() * totalFitness;
      accumulatedFitness = 0;
      for (const neuralNetwork of this.neuralNetworks) {
        accumulatedFitness += neuralNetwork.fitness;
        if (fitnessCutoff < accumulatedFitness) {
          this.parent2s.push(neuralNetwork);
          break;
        }
      }
    }
  }

  crossover() {
    for (let i = 0; i < this.populationSize - Math.round(this.elitismRate * this.populationSize); i++) {
      const child = new NeuralNetwork(this.layerSizes);
      for (let j = 0; j < child.weights.length; j++) {
        // Loop over the matrixes.
        for (let row = 0; row < child.weights[j].numRows; row++) {
          for (let col = 0; col < child.weights[j].numCols; col++) {
            if (Math.random() < 0.5) {
              child.weights[j].elements[row][col] = this.parent1s[i].weights[j].elements[row][col];
            } else {
              child.weights[j].elements[row][col] = this.parent2s[i].weights[j].elements[row][col];
            }
          }
          if (Math.random() < 0.5) {
            child.biases[j].elements[row][0] = this.parent1s[i].biases[j].elements[row][0];
          } else {
            child.biases[j].elements[row][0] = this.parent2s[i].biases[j].elements[row][0];
          }
        }
      }
      this.neuralNetworks.push(child);
    }
  }

  mutate() {
    for (let i = this.populationSize; i < this.neuralNetworks.length; i++) {
      this.neuralNetworks[i].mutate(this.mutationRate);
    }
  }

  /**
   * Remove the poor performing neural networks. Keeps the best 'elitismRate'% to survive to the next generation.
   */
  elitism() {
    this.neuralNetworks.splice(Math.round(this.elitismRate * this.populationSize), this.populationSize - Math.round(this.elitismRate * this.populationSize));
  }

  clearFitness() {
    for (const neuralNetwork of this.neuralNetworks) {
      neuralNetwork.fitness = 0;
    }
  }
}
