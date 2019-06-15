class Matrix {
  constructor(numRows, numCols) {
    this.numRows = numRows;
    this.numCols = numCols;
    this.elements = new Array(numRows);
    for (var row = 0; row < numRows; row++) {
      this.elements[row] = new Array(numCols);
      for (var col = 0; col < numCols; col++) {
        this.elements[row][col] = 0;
      }
    }
  }

  static add(m1, m2) {
    if (m1.numRows !== m2.numRows || m1.numCols !== m2.numCols) {
      throw 'Matrix sizes are not equal.';
    } else {
      var answer = new Matrix(m1.numRows, m1.numCols);
      for (var row = 0; row < answer.numRows; row++) {
        for (var col = 0; col < answer.numCols; col++) {
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
      var answer = new Matrix(m1.numRows, m1.numCols);
      for (var row = 0; row < answer.numRows; row++) {
        for (var col = 0; col < answer.numCols; col++) {
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
      var answer = new Matrix(m1.numRows, m2.numCols);
      for (var row = 0; row < answer.numRows; row++) {
        for (var col = 0; col < answer.numCols; col++) {
          for (var i = 0; i < m1.numCols; i++) {
            answer.elements[row][col] += m1.elements[row][i] * m2.elements[i][col];
          }
        }
      }
      return answer;
    }
  }

  static divide(m1, m2) {

  }
}
