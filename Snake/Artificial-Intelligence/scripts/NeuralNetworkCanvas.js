"use strict";

import {canvasSize} from "./main.js";

const CANVAS_NEURAL_NETWORK = document.getElementById(`canvas-neural-network`);
const CONTEXT_NEURAL_NETWORK = CANVAS_NEURAL_NETWORK.getContext(`2d`);

export function renderNeuralNetwork(evolutionaryAlgorithm) {
  CONTEXT_NEURAL_NETWORK.clearRect(0, 0, canvasSize, canvasSize);
  const neuralNetwork = evolutionaryAlgorithm.neuralNetworks[evolutionaryAlgorithm.specie];
  renderWeights(neuralNetwork);
  renderNodes(neuralNetwork, evolutionaryAlgorithm);
  renderLabels(neuralNetwork);
}

function renderWeights(neuralNetwork) {
  for (let i = 0; i < neuralNetwork.weights.length; i++) {
    const layer1Size = neuralNetwork.layers[i].numRows;
    for (let j = 0; j < layer1Size; j++) {
      const layer2Size = neuralNetwork.layers[i + 1].numRows;
      for (let k = 0; k < layer2Size; k++) {
        CONTEXT_NEURAL_NETWORK.beginPath();
        CONTEXT_NEURAL_NETWORK.moveTo(
          canvasSize*(i + 1)/(neuralNetwork.layers.length + 1),
          canvasSize/(layer1Size + 1)*(j + 1)
        );
        CONTEXT_NEURAL_NETWORK.lineTo(
          canvasSize*(i + 2)/(neuralNetwork.layers.length + 1),
          canvasSize/(layer2Size + 1)*(k + 1)
        );
        const intensity = neuralNetwork.layers[i].elements[j][0];
        if (neuralNetwork.weights[i].elements[k][j] < 0) {
          CONTEXT_NEURAL_NETWORK.strokeStyle = `rgb(255, 0, 0, ${intensity})`;
        } else {
          CONTEXT_NEURAL_NETWORK.strokeStyle = `rgb(0, 0, 255, ${intensity})`;
        }
        CONTEXT_NEURAL_NETWORK.lineWidth = 2;
        CONTEXT_NEURAL_NETWORK.stroke();
      }
    }
  }
}

function renderNodes(neuralNetwork, evolutionaryAlgorithm) {
  for (let i = 0; i < neuralNetwork.layers.length; i++) {
    const layerSize = neuralNetwork.layers[i].numRows;
    for (let j = 0; j < layerSize; j++) {
      const intensity = neuralNetwork.layers[i].elements[j][0]*255;
      CONTEXT_NEURAL_NETWORK.beginPath();
      CONTEXT_NEURAL_NETWORK.arc(
        canvasSize*(i + 1)/(neuralNetwork.layers.length + 1),
        canvasSize*(j + 1)/(layerSize + 1),
        8,
        0,
        2*Math.PI
      );
      CONTEXT_NEURAL_NETWORK.closePath();
      CONTEXT_NEURAL_NETWORK.strokeStyle = `rgb(255, 255, 255)`;
      CONTEXT_NEURAL_NETWORK.lineWidth = 2;
      CONTEXT_NEURAL_NETWORK.stroke();
      const outputLayer = evolutionaryAlgorithm.neuralNetworks[evolutionaryAlgorithm.specie]
        .layers[evolutionaryAlgorithm.neuralNetworks[evolutionaryAlgorithm.specie].layers.length - 1].elements;
      const outputLayerDirections = [
        {index: 0, intensity: outputLayer[0][0]},
        {index: 1, intensity: outputLayer[1][0]},
        {index: 2, intensity: outputLayer[2][0]},
        {index: 3, intensity: outputLayer[3][0]}
      ];
      outputLayerDirections.sort((a, b) => { return b.intensity - a.intensity; });
      if (i === neuralNetwork.layers.length - 1 && j === outputLayerDirections[0].index) {
        CONTEXT_NEURAL_NETWORK.fillStyle = `rgb(0, ${intensity}, 0)`;
      } else {
        CONTEXT_NEURAL_NETWORK.fillStyle = `rgb(${intensity}, ${intensity}, ${intensity})`;
      }
      CONTEXT_NEURAL_NETWORK.fill();
    }
  }
}

function renderLabels(neuralNetwork) {
  const WHITE = `rgb(255, 255, 255)`;
  CONTEXT_NEURAL_NETWORK.font = `12px Arial`;
  CONTEXT_NEURAL_NETWORK.strokeStyle = WHITE;
  CONTEXT_NEURAL_NETWORK.fillStyle = WHITE;
  CONTEXT_NEURAL_NETWORK.textBaseline = `middle`;
  // Render detector input labels.
  const DIRECTIONS = [`Up-Left`, `Left`, `Down-Left`, `Up`, `Down`, `Up-Right`, `Right`, `Down-Right`];
  const DETECTORS = [`Wall`, `Body`, `Fruit`];
  for (let i = 0; i < DIRECTIONS.length; i++) {
    for (let j = 0; j < DETECTORS.length; j++) {
      CONTEXT_NEURAL_NETWORK.textAlign = `right`;
      CONTEXT_NEURAL_NETWORK.fillText(
        `${DIRECTIONS[i]} ${DETECTORS[j]}`,
        -16 + canvasSize/(neuralNetwork.layers.length + 1),
        canvasSize/(28 + 1)*((3*i + j) + 1)
      );
    }
  }
  // Render current direction labels.
  const OUTPUT_NODE_LABELS = [`Left`, `Up`, `Right`, `Down`];
  for (let i = 24; i < 28; i++) {
    CONTEXT_NEURAL_NETWORK.fillText(
      OUTPUT_NODE_LABELS[i%4],
      -16 + canvasSize/(neuralNetwork.layers.length + 1),
      canvasSize/(28 + 1)*(i + 1)
    );
  }
  for (let i = 0; i < 4; i++) {
    CONTEXT_NEURAL_NETWORK.textAlign = `left`;
    CONTEXT_NEURAL_NETWORK.fillText(
      OUTPUT_NODE_LABELS[i],
      16 + canvasSize*neuralNetwork.layers.length/(neuralNetwork.layers.length + 1),
      canvasSize/(4 + 1)*(i + 1)
    );
  }
}
