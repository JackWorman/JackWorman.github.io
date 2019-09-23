'use strict';

export class Coordinate {
  constructor(x, y) {
    Object.defineProperty(this, 'x', {value: -1, writable: true});
    Object.defineProperty(this, 'y', {value: -1, writable: true});
    Object.seal(this);
  }
}
