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
      this.config = {
        maxFood: MAX_FOOD,
        maxCycleBetweenFood: MAX_CYCLE_BETWEEN_FOOD,
        maxDuration: MAX_FOOD_DURATION,
        minDuration: MIN_FOOD_DURATION
      };
      this.food = [];
    }

    destroyOldFood() {
      return this.food.reduce((destroyedFood, foodUnit, idx) => {
        if (--foodUnit.duration === 0) {
          this.food.splice(idx, 1);
          destroyedFood.push(foodUnit);
        }
        return destroyedFood;
      }, []);
    }

    generateNewFood(getNewFoodPosition) {
      if (this.shouldGenerateFood()) {
        const newFoodPosition = getNewFoodPosition();

        if (newFoodPosition) {
          const foodUnit = new FoodUnit(newFoodPosition.x, newFoodPosition.y);
          foodUnit.duration = randomInt(this.config.minDuration, this.config.maxDuration);
          this.food.push(foodUnit);
          return foodUnit;
        }
      }
      return false;
    }

    removeFoodUnitAt(position) {
      const food = this.food;
      for (let i = 0; i < food.length; i++) {
        if (food[i].x === position.x && food[i].y === position.y) {
          food.splice(food.indexOf(food[i]), 1);
          return true;
        }
      }
      return false;
    }

    getPositions() {
      return this.food;
    }

    shouldGenerateFood() {
      return this.food.length < this.config.maxFood && Math.random() <= (1 / this.config.maxCycleBetweenFood);
    }
  }

  return FoodController;
})();
