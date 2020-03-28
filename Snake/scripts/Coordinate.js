"use strict";

export class Coordinate {
  constructor(x, y) {
    Object.defineProperty(this, `x`, {value: x, writable: true});
    Object.defineProperty(this, `y`, {value: y, writable: true});
    Object.seal(this);
  }

  /**
   * Compares two coordinates and returns whether they represent the same point.
   * @param  {Coordinate} coordinate1 The first coordinate.
   * @param  {Coordinate} coordinate2 The second coordinate.
   * @return {Boolean}
   */
  static compare(coordinate1, coordinate2) {
    return coordinate1.x === coordinate2.x && coordinate1.y === coordinate2.y;
  }

  /**
   * @param {Number} x The horizontal coordinate.
   * @param {Number} y The vertical coordinate.
   */
  setCoordinate(x, y) {
    this.x = x;
    this.y = y;
  }
}
