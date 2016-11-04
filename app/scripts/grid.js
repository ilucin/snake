SnakeGame.Grid = (function() {
  'use strict';

  const {EMPTY_CELL} = SnakeGame.Consts;
  const {Position} = SnakeGame.Classes;
  const {randomInt, pickRandom} = SnakeGame.Utils;

  class Grid {
    constructor(width, height) {
      this.width = width;
      this.height = height;

      const _grid = {};

      for (let i = 0; i < height; i++) {
        _grid[i] = {};

        for (let j = 0; j < width; j++) {
          _grid[i][j] = EMPTY_CELL;
        }
      }

      this._grid = _grid;
    }

    setCell(pos, cellType) {
      this._grid[pos.y][pos.x] = cellType;
    }

    getCell(pos) {
      return this._grid[pos.y][pos.x];
    }

    getRandomEmptyPosition() {
      let pos;

      for (let i = 0; i < 5; i++) {
        pos = new Position(randomInt(0, this.width), randomInt(0, this.height));
        if (this.getCell(pos) === EMPTY_CELL) {
          return pos;
        }
      }

      const grid = this._grid;
      return pickRandom(Object.keys(grid).reduce(function(arr, key1) {
        const positions = [];

        Object.keys(grid[key1]).forEach((key2) => {
          if (grid[key1][key2] === EMPTY_CELL) {
            positions.push(new Position(key2, key1));
          }
        });

        return arr.concat(positions);
      }, []));
    }
  }

  return Grid;
})();
