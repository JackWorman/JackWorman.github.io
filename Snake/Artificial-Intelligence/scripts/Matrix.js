"use strict";

class Matrix {
  constructor(numRows, numCols) {
    this.numRows = numRows;
    this.numCols = numCols;
    this.elements = new Array(numRows);
    for (let row = 0; row < numRows; row++) {
      this.elements[row] = new Array(numCols);
      for (let col = 0; col < numCols; col++) {
        this.elements[row][col] = 0;
      }
    }
  }

  setElements(elements) {
    this.elements = elements;
  }

  static add(m1, m2) {
    if (m1.numRows !== m2.numRows || m1.numCols !== m2.numCols) {
      throw 'Matrix sizes are not equal.';
    } else {
      const answer = new Matrix(m1.numRows, m1.numCols);
      for (let row = 0; row < answer.numRows; row++) {
        for (let col = 0; col < answer.numCols; col++) {
          answer.elements[row][col] = m1.elements[row][col] + m2.elements[row][col];
        }
      }
      return answer;
    }
  }

  static subtract(m1, m2) {
    if (m1.numRows !== m2.numRows || m1.numCols !== m2.numCols) {
      throw 'Matrix sizes are not equal.';
    } else {
      const answer = new Matrix(m1.numRows, m1.numCols);
      for (let row = 0; row < answer.numRows; row++) {
        for (let col = 0; col < answer.numCols; col++) {
          answer.elements[row][col] = m1.elements[row][col] - m2.elements[row][col];
        }
      }
      return answer;
    }
  }

  static multiply(m1, m2) {
    if (m1.numCols !== m2.numRows) {
      throw 'Matrix sizes are incompatible.';
    } else {
      const answer = new Matrix(m1.numRows, m2.numCols);
      for (let row = 0; row < answer.numRows; row++) {
        for (let col = 0; col < answer.numCols; col++) {
          for (let i = 0; i < m1.numCols; i++) {
            answer.elements[row][col] += m1.elements[row][i] * m2.elements[i][col];
          }
        }
      }
      return answer;
    }
  }

  printToConsole() {
    let output = ``;
    for (let row = 0; row < this.numRows; row++) {
      for (let col = 0; col < this.numCols; col++) {
        output += `${this.elements[row][col]} `;
      }
      output += `\n`;
    }
  }
}

const elements = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9]
];
const m1 = new Matrix(3, 3);
m1.setElements(elements);
m1.printToConsole();

// const m2 = [
//   [3, 2, 1],
//   [4, 5, 6],
//   [9, 8, 7]
// ];
//
// const m3 =
