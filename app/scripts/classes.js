SnakeGame.Classes = (function() {
  'use strict';

  class Position {
    constructor(x, y) {
      this.x = x;
      this.y = y;
    }

    normalizeForDimensions(width, height) {
      this.x %= width;
      this.y %= height;

      if (this.x < 0) {
        this.x = width + this.x;
      }

      if (this.y < 0) {
        this.y = height + this.y;
      }
    }

    clone() {
      return new Position(this.x, this.y);
    }
  }

  // class Cell extends Position {}

  // class EmptyCell extends Position {
  //   constructor() {
  //     super(...arguments);
  //     this.className = 'empty';
  //   }
  // }

  class CellCollection {
    constructor() {
      this._cells = [];
    }
  }

  return {
    Position,
    CellCollection
  };
})();
