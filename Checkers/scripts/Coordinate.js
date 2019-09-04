'use strict';

export const UNDEFINED = 'undefined';

export default class Coordinate {
  constructor(col, row) {
    this.col = col;
    this.row = row;
  }

  static compare(coordinate1, coordinate2) {
    return coordinate1.col === coordinate2.col && coordinate1.row === coordinate2.row;
  }

  setCoordinate(col, row) {
    this.col = col;
    this.row = row;
  }
}
