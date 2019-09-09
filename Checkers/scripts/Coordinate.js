'use strict';

export const UNDEFINED = 'undefined';

export class Coordinate {
  constructor(col, row) {
    Object.defineProperty(this, 'col', {value: col, writable: true});
    Object.defineProperty(this, 'row', {value: row, writable: true});
    Object.seal(this);
  }

  static compare(coordinate1, coordinate2) {
    return coordinate1.col === coordinate2.col && coordinate1.row === coordinate2.row;
  }

  setCoordinate(col, row) {
    this.col = col;
    this.row = row;
  }
}
