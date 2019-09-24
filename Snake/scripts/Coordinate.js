'use strict';

export class Coordinate {
  constructor(x, y) {
    Object.defineProperty(this, 'x', {value: -1, writable: true});
    Object.defineProperty(this, 'y', {value: -1, writable: true});
    Object.seal(this);
  }

  static compare(coordinate1, coordinate2) {
    return coordinate1.x === coordinate2.x && coordinate1.y === coordinate2.y;
  }

  setCoordinate(x, y) {
    this.x = x;
    this.y = y;
  }
}
