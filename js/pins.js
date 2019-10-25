'use strict';

(function () {
  var MAP_PIN_WIDTH = 50;
  var MAP_PINT_HEIGHT = 70;

  var mapElement = document.querySelector('.map');
  var pinTemplateElement = document.querySelector('#pin').content.querySelector('.map__pin');
  var mapPinsElement = mapElement.querySelector('.map__pins');

  var renderPin = function (pinObject) {
    var pinElement = pinTemplateElement.cloneNode(true);

    pinElement.setAttribute('style', 'left: ' + (pinObject.location.x - MAP_PIN_WIDTH / 2) + 'px; top: ' + (pinObject.location.y - MAP_PINT_HEIGHT) + 'px;');
    pinElement.querySelector('img').setAttribute('src', pinObject.author.avatar);
    pinElement.querySelector('img').setAttribute('alt', pinObject.offer.title);

    pinElement.addEventListener('click', function () {
      window.card.showCard(pinObject);
    });

    return pinElement;
  };

  var fillPins = function (pinsData) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < pinsData.length; i++) {
      fragment.appendChild(renderPin(pinsData[i]));
    }
    mapPinsElement.appendChild(fragment);
  };

  mapElement.classList.remove('map--faded');

  fillPins(window.data.mock);
})();
