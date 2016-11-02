(window.Snake = window.Snake || {}).consts = (function() {
  'use strict';

  return {
    CELL_SIZE: 50,
    FRAME_RATE_DROP: 5,
    EMPTY_CELL: 0,
    SNAKE_CELL: 1,
    FOOD_CELL: 2,
    MAX_CYCLE_BETWEEN_FOOD: 20,
    MAX_FOOD: 3,
    MAX_FOOD_DURATION: 50,
    MIN_FOOD_DURATION: 10
  };
})();
