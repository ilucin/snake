SnakeGame.Ui = (function() {
  'use strict';

  const document = window.document;
  const evented = SnakeGame.Evented;

  const UiEvent = {
    RELATIVE_LEFT: 'relative-left',
    RELATIVE_RIGHT: 'relative-right',
    PAUSE: 'pause',
    UP: 'keydown-arrow-up',
    DOWN: 'keydown-arrow-down',
    LEFT: 'keydown-arrow-left',
    RIGHT: 'keydown-arrow-right'
  };

  const ui = evented({UiEvent});

  document.querySelector('.mobile-controls__control--left').addEventListener('touchstart', function() {
    ui.trigger(UiEvent.RELATIVE_LEFT);
  });

  document.querySelector('.mobile-controls__control--right').addEventListener('touchend', function() {
    ui.trigger(UiEvent.RELATIVE_RIGHT);
  });

  document.querySelector('.mobile-controls__control--pause').addEventListener('click', function() {
    ui.trigger(UiEvent.PAUSE);
  });

  document.addEventListener('keydown', function(ev) {
    if (ev.which === 40) { // arrow down
      ui.trigger(UiEvent.DOWN);
    } else if (ev.which === 39) { // arrow right
      ui.trigger(UiEvent.RIGHT);
    } else if (ev.which === 38) { // arrow up
      ui.trigger(UiEvent.UP);
    } else if (ev.which === 37) { // arrow left
      ui.trigger(UiEvent.LEFT);
    } else if (ev.which === 80) { // p
      ui.trigger(UiEvent.PAUSE);
    }
  });

  return ui;
})();
