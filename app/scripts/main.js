(function() {
  'use strict';

  const {screenWidth, screenHeight, render, init: initCanvas, startFrameLoop} = SnakeGame.Canvas;
  const {Direction} = SnakeGame.Enums;
  const {start: startGame} = SnakeGame.Game;

  let isPaused = false;

  initCanvas();

  const game = startGame(screenWidth, screenHeight, function onGameEnd() {
    location.reload();
  });

  function toggleIsPaused() {
    isPaused = !isPaused;
    document.body.classList[isPaused ? 'add' : 'remove']('is-game-paused');
  }

  document.querySelector('.mobile-controls__control--left').addEventListener('touchstart', function() {
    game.onInputMove(Direction.RELATIVE_LEFT);
  });

  document.querySelector('.mobile-controls__control--right').addEventListener('touchend', function() {
    game.onInputMove(Direction.RELATIVE_RIGHT);
  });

  document.querySelector('.mobile-controls__control--pause').addEventListener('click', function() {
    toggleIsPaused();
  });

  document.addEventListener('keydown', function(ev) {
    if (ev.which === 40) { // arrow down
      game.onInputMove(Direction.DOWN);
    } else if (ev.which === 39) { // arrow right
      game.onInputMove(Direction.RIGHT);
    } else if (ev.which === 38) { // arrow up
      game.onInputMove(Direction.UP);
    } else if (ev.which === 37) { // arrow left
      game.onInputMove(Direction.LEFT);
    } else if (ev.which === 80) { // p
      toggleIsPaused();
    }
  });

  startFrameLoop(function() {
    if (isPaused) {
      return;
    }

    game.frameLoop();
    render(game);
  });
})();
