(window.SnakeGame = window.SnakeGame || {}).Consts = (function() {
  'use strict';

  return {
    CELL_SIZE: 50,
    FRAME_RATE_DROP: 7,
    EMPTY_CELL: 'empty',
    SNAKE_CELL: 'snake',
    FOOD_CELL: 'food',
    MAX_CYCLE_BETWEEN_FOOD: 10,
    MAX_FOOD: 5,
    MAX_FOOD_DURATION: 100,
    MIN_FOOD_DURATION: 50
  };
})();
