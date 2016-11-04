SnakeGame.FoodController = (function() {
  'use strict';

  const {MAX_CYCLE_BETWEEN_FOOD, MAX_FOOD, MAX_FOOD_DURATION, MIN_FOOD_DURATION} = SnakeGame.Consts;
  const {randomInt} = SnakeGame.Utils;
  const {Position} = SnakeGame.Classes;

  class FoodUnit extends Position {
    constructor() {
      super(...arguments);
      this.className = 'food';
    }
  }

  class FoodController {
    constructor() {
      this._food = [];
      this._generateNextFoodCycle();
    }

    destroyFood(frameCycle, onFoodRemove) {
      const food = this._food;
      food.forEach(function(foodUnit) {
        if (foodUnit.cycle + foodUnit.duration < frameCycle) {
          food.splice(food.indexOf(foodUnit), 1);
          onFoodRemove(foodUnit);
        }
      });
    }

    generateFood(frameCycle, getNewFoodPosition, onFoodAdd) {
      const food = this._food;
      if (frameCycle % MAX_CYCLE_BETWEEN_FOOD === this._nextFoodCycle && food.length < MAX_FOOD) {
        const newFoodPosition = getNewFoodPosition();

        if (newFoodPosition) {
          const foodUnit = new FoodUnit(newFoodPosition.x, newFoodPosition.y);
          foodUnit.cycle = frameCycle;
          foodUnit.duration = randomInt(MIN_FOOD_DURATION, MAX_FOOD_DURATION);
          food.push(foodUnit);
          onFoodAdd(foodUnit);
        }
      }

      this._generateNextFoodCycle();
    }

    removeFoodUnitAt(position) {
      const food = this._food;
      for (let i = 0; i < food.length; i++) {
        if (food[i].x === position.x && food[i].y === position.y) {
          food.splice(food.indexOf(food[i]), 1);
          return true;
        }
      }
      return false;
    }

    getPositions() {
      return this._food;
    }

    _generateNextFoodCycle() {
      this._nextFoodCycle = randomInt(0, MAX_CYCLE_BETWEEN_FOOD);
    }
  }

  return FoodController;
})();
