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
    this.neuralNetworks[this.specie].fitness += Math.pow(apples, 2);
  }

  sort() {
    this.neuralNetworks.sort((a, b) => { return b.fitness - a.fitness; });
  }

  /**
   * Chooses parents via roulette wheel of fitness times diversity.
   */
  selectParents() {
    // Calculate the sum of every neural networks fitness.
    let totalFitness = 0;
    for (const neuralNetwork of this.neuralNetworks) {
      totalFitness += neuralNetwork.fitness * neuralNetwork.diversity;
    }
    // Use the total fitness to select the parents randomly and porportional to their fitness.
    this.parent1s = [];
    this.parent2s = [];
    for (let i = 0; i < this.populationSize - Math.round(this.elitismRate * this.populationSize); i++) {
      let fitnessCutoff = Math.random() * totalFitness;
      let accumulatedFitness = 0;
      for (const neuralNetwork of this.neuralNetworks) {
        accumulatedFitness += neuralNetwork.fitness * neuralNetwork.diversity;
        if (fitnessCutoff < accumulatedFitness) {
          this.parent1s.push(neuralNetwork);
          break;
        }
      }
      fitnessCutoff = Math.random() * totalFitness;
      accumulatedFitness = 0;
      for (const neuralNetwork of this.neuralNetworks) {
        accumulatedFitness += neuralNetwork.fitness * neuralNetwork.diversity;
        if (fitnessCutoff < accumulatedFitness) {
          this.parent2s.push(neuralNetwork);
          break;
        }
      }
    }
  }

  selectParentsViaRank() {
    let totalFitness = 0;
    for (let i = 0; i < this.neuralNetworks.length; i++) {
      totalFitness += i + 1;
    }
    this.parent1s = [];
    this.parent2s = [];
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
    this.neuralNetworks.splice(
      Math.round(this.elitismRate * this.populationSize),
      this.populationSize - Math.round(this.elitismRate * this.populationSize)
    );
  }

  clearFitness() {
    for (const neuralNetwork of this.neuralNetworks) {
      neuralNetwork.fitness = 0;
    }
  }

  /**
   * diversity = average of distance from all other NN's
   */
  calculateDiversity() {
    const diversities = [];
    for (const neuralNetwork1 of this.neuralNetworks) {
      const distances = [];
      for (const neuralNetwork2 of this.neuralNetworks) {
        let distance = 0;
        for (let i = 0; i < neuralNetwork1.weights.length; i++) { // Layers
          // Loop over the matrixes.
          for (let row = 0; row < neuralNetwork1.weights[i].numRows; row++) {
            for (let col = 0; col < neuralNetwork1.weights[i].numCols; col++) {
              distance += Math.pow(neuralNetwork2.weights[i].elements[row][col] - neuralNetwork1.weights[i].elements[row][col], 2);
            }
            distance += Math.pow(neuralNetwork2.biases[i].elements[row][0] - neuralNetwork1.biases[i].elements[row][0], 2);
          }
        }
        distances.push(Math.sqrt(distance));
      }
      neuralNetwork1.diversity = distances.reduce((a,b) => a + b, 0) / distances.length;
      diversities.push(neuralNetwork1.diversity);
    }
    diversities.sort((a, b) => { return b.fitness - a.fitness; });
    console.log(`==========`);
    console.log(`${Math.min(...diversities)} - ${diversities.reduce((a,b) => a + b, 0) / diversities.length} - ${Math.max(...diversities)}`);
  }
}
