"use strict";

import {NeuralNetwork} from "./NeuralNetwork.js";

export class EvolutionaryAlgorithm {
  constructor(numNeuralNetworks, layerSizes) {
    this.neuralNetworks = [];
    for (let i = 0; i < numNeuralNetworks; i++) {
      this.neuralNetworks.push(new NeuralNetwork(layerSizes));
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
    this.neuralNetworks[this.specie].fitness += Math.pow(apples, 2);
      // steps
      // + (Math.pow(2, apples) + Math.pow(apples, 2.1)*500)
      // - (Math.pow(apples, 1.2) * Math.pow(0.25 * steps, 1.3));
  }

  sort() {
    this.neuralNetworks.sort((a, b) => { return b.fitness - a.fitness; });
  }

  selectParents() {
    let totalFitness = 0;
    for (const neuralNetwork of this.neuralNetworks) {
      totalFitness += neuralNetwork.fitness;
    }

    this.parent1s = [];
    this.parent2s = [];
    for (let i = 0; i < 1950; i++) {
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
    for (let i = 0; i < 1950; i++) {
      const child = new NeuralNetwork([28, 20, 12, 4]);
      for (let j = 0; j < child.weights.length; j++) {
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
      // for (let row = 0; row < child.weights1.numRows; row++) {
      //   for (let col = 0; col < child.weights1.numCols; col++) {
      //     if (Math.random() < 0.5) {
        //       child.weights1.elements[row][col] = this.parent1s[i].weights1.elements[row][col];
      //     } else {
      //       child.weights1.elements[row][col] = this.parent2s[i].weights1.elements[row][col];
      //     }
      //   }
      //   if (Math.random() < 0.5) {
      //     child.biases1.elements[row][0] = this.parent1s[i].biases1.elements[row][0];
      //   } else {
      //     child.biases1.elements[row][0] = this.parent2s[i].biases1.elements[row][0];
      //   }
      // }
      // for (let row = 0; row < child.weights2.numRows; row++) {
      //   for (let col = 0; col < child.weights2.numCols; col++) {
      //     if (Math.random() < 0.5) {
      //       child.weights2.elements[row][col] = this.parent1s[i].weights2.elements[row][col];
      //     } else {
      //       child.weights2.elements[row][col] = this.parent2s[i].weights2.elements[row][col];
      //     }
      //   }
      //   if (Math.random() < 0.5) {
      //     child.biases2.elements[row][0] = this.parent1s[i].biases2.elements[row][0];
      //   } else {
      //     child.biases2.elements[row][0] = this.parent2s[i].biases2.elements[row][0];
      //   }
      // }
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

  clearFitness() {
    for (const neuralNetwork of this.neuralNetworks) {
      neuralNetwork.fitness = 0;
    }
  }
}
