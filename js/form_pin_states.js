'use strict';

(function () {
  var MAIN_PIN_HALF_WIDTH = 33;
  var MAIN_PIN_CIRCLE_HALF_HEIGHT = 33;
  var MAIN_PIN_HEIGHT = 65 + 22 - 6;
  var PIN_LIMITS = {
    x: {
      min: 0,
      max: 1200
    },
    y: {
      min: 130,
      max: 630
    }
  };

  var Coordinates = function (x, y) {
    this.x = x;
    this.y = y;
  };

  var mapElement = document.querySelector('.map');
  var adFormElement = document.querySelector('.ad-form');
  var adFormAddressElement = adFormElement.querySelector('#address');
  var adFormResetElement = adFormElement.querySelector('.ad-form__reset');
  var filterFormElement = document.querySelector('.map__filters');
  var mainPinElement = mapElement.querySelector('.map__pin--main');

  var isActive = false;
  var mainPinStartCoords = new Coordinates(mainPinElement.offsetLeft, mainPinElement.offsetTop);

  var setActive = function () {
    if (!isActive) {
      mapElement.classList.remove('map--faded');
      adFormElement.classList.remove('ad-form--disabled');
      Array.prototype.forEach.call(adFormElement.elements, function (it) {
        it.disabled = false;
      });
      Array.prototype.forEach.call(filterFormElement.elements, function (it) {
        it.disabled = false;
      });
      window.pins.fillPins(window.data.mock);
      isActive = true;
    }
  };

  var setInactive = function () {
    if (isActive) {
      mapElement.classList.add('map--faded');
      adFormElement.classList.add('ad-form--disabled');
      adFormElement.reset();
      filterFormElement.reset();
      Array.prototype.forEach.call(adFormElement.elements, function (it) {
        it.disabled = true;
      });
      Array.prototype.forEach.call(filterFormElement.elements, function (it) {
        it.disabled = true;
      });
      mapElement.querySelectorAll('.map__pin:not(.map__pin--main)').forEach(function (it) {
        it.remove();
      });
      window.card.hideCard();
      isActive = false;
      setAddressField(mainPinStartCoords.x, mainPinStartCoords.y);
    }
  };

  var setAddressField = function (x, y) {
    if (isActive) {
      adFormAddressElement.value = (x + MAIN_PIN_HALF_WIDTH) + ', ' + (y + MAIN_PIN_HEIGHT);
    } else {
      adFormAddressElement.value = (x + MAIN_PIN_HALF_WIDTH) + ', ' + (y + MAIN_PIN_CIRCLE_HALF_HEIGHT);
    }
  };

  adFormElement.querySelector('#address').readOnly = true;
  Array.prototype.forEach.call(adFormElement.elements, function (it) {
    it.disabled = true;
  });
  Array.prototype.forEach.call(filterFormElement.elements, function (it) {
    it.disabled = true;
  });

  setAddressField(mainPinStartCoords.x, mainPinStartCoords.y);

  mainPinElement.addEventListener('keydown', function (evt) {
    window.util.isEnterEvent(evt, setActive);
  });

  mainPinElement.addEventListener('mousedown', function (evt) {
    evt.preventDefault();
    setActive();

    var startMouseCoordinates = new Coordinates(evt.clientX, evt.clientY);
    var isXLimit = false;
    var isYLimit = false;
    setAddressField(mainPinElement.offsetLeft, mainPinElement.offsetTop);

    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();

      var shift = new Coordinates(moveEvt.clientX - startMouseCoordinates.x, moveEvt.clientY - startMouseCoordinates.y);
      var endPointCoordinates = new Coordinates(mainPinElement.offsetLeft + MAIN_PIN_HALF_WIDTH + shift.x, mainPinElement.offsetTop + MAIN_PIN_HEIGHT + shift.y);
      var mapPinsRect = mapElement.querySelector('.map__pins').getBoundingClientRect();

      startMouseCoordinates.x = moveEvt.clientX;
      startMouseCoordinates.y = moveEvt.clientY;

      if (endPointCoordinates.x >= PIN_LIMITS.x.min && endPointCoordinates.x <= PIN_LIMITS.x.max && !(isXLimit && moveEvt.clientX < mapPinsRect.left - MAIN_PIN_HALF_WIDTH) && !(isXLimit && moveEvt.clientX > mapPinsRect.right + MAIN_PIN_HALF_WIDTH)) {
        mainPinElement.style.left = (mainPinElement.offsetLeft + shift.x) + 'px';
        isXLimit = false;
      } else if (endPointCoordinates.x < PIN_LIMITS.x.min) {
        mainPinElement.style.left = (PIN_LIMITS.x.min - MAIN_PIN_HALF_WIDTH) + 'px';
        isXLimit = true;
      } else if (endPointCoordinates.x > PIN_LIMITS.x.max) {
        mainPinElement.style.left = (PIN_LIMITS.x.max - MAIN_PIN_HALF_WIDTH) + 'px';
        isXLimit = true;
      }
      if (endPointCoordinates.y >= PIN_LIMITS.y.min && endPointCoordinates.y <= PIN_LIMITS.y.max && !(isYLimit && moveEvt.clientY < mapPinsRect.top - MAIN_PIN_HEIGHT + PIN_LIMITS.y.min) && !(isYLimit && moveEvt.clientY > mapPinsRect.top + PIN_LIMITS.y.max)) {
        mainPinElement.style.top = (mainPinElement.offsetTop + shift.y) + 'px';
        isYLimit = false;
      } else if (endPointCoordinates.y < PIN_LIMITS.y.min) {
        mainPinElement.style.top = (PIN_LIMITS.y.min - MAIN_PIN_HEIGHT) + 'px';
        isYLimit = true;
      } else if (endPointCoordinates.y > PIN_LIMITS.y.max) {
        mainPinElement.style.top = (PIN_LIMITS.y.max - MAIN_PIN_HEIGHT) + 'px';
        isYLimit = true;
      }

      setAddressField(mainPinElement.offsetLeft, mainPinElement.offsetTop);
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });

  adFormResetElement.addEventListener('click', setInactive);
})();
