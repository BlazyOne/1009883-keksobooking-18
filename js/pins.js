'use strict';

(function () {
  var MAP_PIN_WIDTH = 50;
  var MAP_PINT_HEIGHT = 70;
  var PINS_LIMIT = 5;

  var mapElement = document.querySelector('.map');
  var pinTemplateElement = document.querySelector('#pin').content.querySelector('.map__pin');
  var mapPinsElement = mapElement.querySelector('.map__pins');

  var renderPin = function (pinObject) {
    var pinElement = pinTemplateElement.cloneNode(true);

    pinElement.setAttribute('style', 'left: ' + (pinObject.location.x - MAP_PIN_WIDTH / 2) + 'px; top: ' + (pinObject.location.y - MAP_PINT_HEIGHT) + 'px;');
    pinElement.querySelector('img').setAttribute('src', pinObject.author.avatar);
    pinElement.querySelector('img').setAttribute('alt', pinObject.offer.title);

    pinElement.addEventListener('click', function (evt) {
      window.card.showCard(pinObject, evt);
    });

    return pinElement;
  };

  var fillPins = function (pinsData) {
    var fragment = document.createDocumentFragment();
    for (var i = 0, j = 0; i < pinsData.length && j < PINS_LIMIT; i++) {
      if (pinsData[i].offer) {
        fragment.appendChild(renderPin(pinsData[i]));
        j++;
      }
    }
    mapPinsElement.appendChild(fragment);
  };

  window.pins = {
    fillPins: fillPins
  };
})();
