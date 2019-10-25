'use strict';

(function () {
  var ESC_KEYCODE = 27;

  window.util = {
    ESC_KEYCODE: ESC_KEYCODE,
    isEscEvent: function (evt, action) {
      if (evt.keyCode === ESC_KEYCODE) {
        action();
      }
    },
    getRandomFromArray: function (data) {
      return data[Math.floor(Math.random() * data.length)];
    },
    getRandomInRange: function (min, max) {
      return min + Math.floor(Math.random() * (max - min + 1));
    },
    // Fisher-Yates shuffle
    shuffle: function (data) {
      for (var i = data.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));

        var temp = data[i];
        data[i] = data[j];
        data[j] = temp;
      }
    }
  };
})();
