'use strict';

(function () {
  var PRICE_LIMITS = {
    low: {
      min: 0,
      max: 10000
    },
    middle: {
      min: 10000,
      max: 50000
    },
    high: {
      min: 50000,
      max: Infinity
    }
  };

  var mapElement = document.querySelector('.map');
  var filterFormElement = document.querySelector('.map__filters');
  var filterTypeElement = filterFormElement.querySelector('#housing-type');
  var filterPriceElement = filterFormElement.querySelector('#housing-price');
  var filterRoomsElement = filterFormElement.querySelector('#housing-rooms');
  var filterGuestsElement = filterFormElement.querySelector('#housing-guests');

  var updateAds = function () {
    var filterFeaturesElements = filterFormElement.querySelectorAll('input[type="checkbox"][name="features"]:checked');

    var dataCopy = window.formPinStates.data.slice();

    mapElement.querySelectorAll('.map__pin:not(.map__pin--main)').forEach(function (it) {
      it.remove();
    });

    dataCopy = dataCopy.filter(function (it) {
      var typePass = false;
      var pricePass = false;
      var roomsPass = false;
      var guestsPass = false;
      var featuresPass = false;

      if (filterTypeElement.value === 'any' || filterTypeElement.value === it.offer.type) {
        typePass = true;
      }

      if (filterPriceElement.value === 'any' || it.offer.price >= PRICE_LIMITS[filterPriceElement.value].min && it.offer.price <= PRICE_LIMITS[filterPriceElement.value].max) {
        pricePass = true;
      }

      if (filterRoomsElement.value === 'any' || +filterRoomsElement.value === it.offer.rooms) {
        roomsPass = true;
      }

      if (filterGuestsElement.value === 'any' || +filterGuestsElement.value === it.offer.guests) {
        guestsPass = true;
      }

      featuresPass = Array.prototype.every.call(filterFeaturesElements, function (filterFeatureElement) {
        return it.offer.features.indexOf(filterFeatureElement.value) > -1;
      });

      return typePass && pricePass && roomsPass && guestsPass && featuresPass;
    });

    window.card.hideCard();
    window.pins.fillPins(dataCopy);
  };

  var debounceUpdateAds = window.util.debounce(updateAds);

  Array.prototype.forEach.call(filterFormElement.elements, function (it) {
    it.addEventListener('input', debounceUpdateAds);
  });
})();
