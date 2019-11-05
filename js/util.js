'use strict';

(function () {
  var ESC_KEYCODE = 27;
  var ENTER_KEYCODE = 13;

  window.util = {
    ESC_KEYCODE: ESC_KEYCODE,
    ENTER_KEYCODE: ENTER_KEYCODE,
    isEscEvent: function (evt, action) {
      if (evt.keyCode === ESC_KEYCODE) {
        action();
      }
    },
    isEnterEvent: function (evt, action) {
      if (evt.keyCode === ENTER_KEYCODE) {
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
    },
    getNoun: function (number, one, two, five) {
      number = Math.abs(number);
      number %= 100;
      if (number >= 5 && number <= 20) {
        return five;
      }
      number %= 10;
      if (number === 1) {
        return one;
      }
      if (number >= 2 && number <= 4) {
        return two;
      }
      return five;
    },
    createLoadErrorElement: function () {
      var errorElement = document.querySelector('#error').content.querySelector('.error').cloneNode(true);
      var errorMessageElement = errorElement.querySelector('.error__message');
      var errorButtonElement = errorElement.querySelector('.error__button');

      var onErrorElementEscPress = function (evt) {
        window.util.isEscEvent(evt, function () {
          errorElement.remove();
          document.removeEventListener('keydown', onErrorElementEscPress);
        });
      };

      errorButtonElement.addEventListener('click', function (evt) {
        evt.stopPropagation();
        errorElement.remove();
      });
      errorMessageElement.addEventListener('click', function (evt) {
        evt.stopPropagation();
      });
      errorElement.addEventListener('click', function () {
        errorElement.remove();
      });

      document.addEventListener('keydown', onErrorElementEscPress);

      return errorElement;
    },
    createLoadSuccessElement: function () {
      var successElement = document.querySelector('#success').content.querySelector('.success').cloneNode(true);
      var successMessageElement = successElement.querySelector('.success__message');

      var onSuccessElementEscPress = function (evt) {
        window.util.isEscEvent(evt, function () {
          successElement.remove();
          document.removeEventListener('keydown', onSuccessElementEscPress);
        });
      };

      successMessageElement.addEventListener('click', function (evt) {
        evt.stopPropagation();
      });
      successElement.addEventListener('click', function () {
        successElement.remove();
      });

      document.addEventListener('keydown', onSuccessElementEscPress);

      return successElement;
    }
  };
})();
