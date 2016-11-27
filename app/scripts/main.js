(function() {
  'use strict';

  const {screenWidth, screenHeight, render, init: initCanvas, startFrameLoop} = SnakeGame.Canvas;
  const {Direction} = SnakeGame.Enums;
  const {start: startGame} = SnakeGame.Game;
  const ui = SnakeGame.Ui;
  const UiEvent = ui.UiEvent;

  let isPaused = false;

  initCanvas();

  const game = startGame(screenWidth, screenHeight, function onGameEnd() {
    location.reload();
  });

  function toggleIsPaused() {
    isPaused = !isPaused;
    document.body.classList[isPaused ? 'add' : 'remove']('is-game-paused');
  }

  ui.on(UiEvent.PAUSE, () => toggleIsPaused());
  ui.on(UiEvent.RELATIVE_LEFT, () => game.onInputMove(Direction.RELATIVE_LEFT));
  ui.on(UiEvent.RELATIVE_RIGHT, () => game.onInputMove(Direction.RELATIVE_RIGHT));
  ui.on(UiEvent.DOWN, () => game.onInputMove(Direction.DOWN));
  ui.on(UiEvent.RIGHT, () => game.onInputMove(Direction.RIGHT));
  ui.on(UiEvent.UP, () => game.onInputMove(Direction.UP));
  ui.on(UiEvent.LEFT, () => game.onInputMove(Direction.LEFT));

  startFrameLoop(function() {
    if (isPaused) {
      return;
    }

    game.frameLoop();
    render(game);
  });
})();
