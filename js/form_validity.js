'use strict';

(function () {
  var TITLE_MIN_LENGTH = 30;
  var TITLE_MAX_LENGTH = 100;
  var PRICE_MAX_VALUE = 1000000;

  var adFormElement = document.querySelector('.ad-form');
  var titleInputElement = adFormElement.querySelector('#title');
  var typeInputElement = adFormElement.querySelector('#type');
  var priceInputElement = adFormElement.querySelector('#price');
  var timeInInputElement = adFormElement.querySelector('#timein');
  var timeOutInputElement = adFormElement.querySelector('#timeout');
  var roomNumberInputElement = adFormElement.querySelector('#room_number');
  var capacityInputElement = adFormElement.querySelector('#capacity');
  var submitButtonElement = adFormElement.querySelector('.ad-form__submit');

  var priceMinValue = {
    bungalo: 0,
    flat: 1000,
    house: 5000,
    palace: 10000
  };

  var checkTitleValidity = function () {
    if (titleInputElement.value.length < TITLE_MIN_LENGTH) {
      titleInputElement.setCustomValidity('Длина заголовка не может быть меньше ' + TITLE_MIN_LENGTH + window.util.getNoun(TITLE_MIN_LENGTH, ' символа', ' символов', ' символов'));
    } else if (titleInputElement.value.length > TITLE_MAX_LENGTH) {
      titleInputElement.setCustomValidity('Длина заголовка не может быть ,больше ' + TITLE_MAX_LENGTH + window.util.getNoun(TITLE_MAX_LENGTH, ' символа', ' символов', ' символов'));
    } else {
      titleInputElement.setCustomValidity('');
      titleInputElement.style.outline = '';
    }
  };

  var checkPriceValidity = function () {
    priceInputElement.min = priceMinValue[typeInputElement.value];
    priceInputElement.placeholder = priceMinValue[typeInputElement.value];

    if (!priceInputElement.value) {
      priceInputElement.setCustomValidity('Поле цены должно быть заполнено');
    } else if (priceInputElement.value < priceMinValue[typeInputElement.value]) {
      priceInputElement.setCustomValidity('Цена для данного типа жилья не может быть меньше ' + priceMinValue[typeInputElement.value]);
    } else if (priceInputElement.value > PRICE_MAX_VALUE) {
      priceInputElement.setCustomValidity('Цена не может быть больше ' + PRICE_MAX_VALUE);
    } else {
      priceInputElement.setCustomValidity('');
      priceInputElement.style.outline = '';
    }
  };

  var checkTimeInValidity = function () {
    timeInInputElement.value = timeOutInputElement.value;
  };

  var checkTimeOutValidity = function () {
    timeOutInputElement.value = timeInInputElement.value;
  };

  var checkCapacityValidity = function () {
    if (roomNumberInputElement.value === '1' && capacityInputElement.value !== '1') {
      capacityInputElement.setCustomValidity('Для 1 комнаты можно выбрать только 1 гостя');
    } else if (roomNumberInputElement.value === '2' && capacityInputElement.value !== '1' && capacityInputElement.value !== '2') {
      capacityInputElement.setCustomValidity('Для 2 комнат можно выбрать только 1 или 2 гостей');
    } else if (roomNumberInputElement.value === '3' && capacityInputElement.value !== '1' && capacityInputElement.value !== '2' && capacityInputElement.value !== '3') {
      capacityInputElement.setCustomValidity('Для 3 комнат можно выбрать только 1, 2 или 3 гостей');
    } else if (roomNumberInputElement.value === '100' && capacityInputElement.value !== '0') {
      capacityInputElement.setCustomValidity('100 комнат можно выбрать только не для гостей');
    } else {
      capacityInputElement.setCustomValidity('');
      capacityInputElement.style.outline = '';
    }
  };

  window.validity = {
    checkTitleValidity: checkTitleValidity,
    checkPriceValidity: checkPriceValidity,
    checkTimeOutValidity: checkTimeOutValidity,
    checkCapacityValidity: checkCapacityValidity
  };

  checkTitleValidity();
  checkPriceValidity();
  checkTimeOutValidity();
  checkCapacityValidity();

  titleInputElement.addEventListener('input', checkTitleValidity);
  priceInputElement.addEventListener('input', checkPriceValidity);
  timeInInputElement.addEventListener('input', checkTimeOutValidity);
  timeOutInputElement.addEventListener('input', checkTimeInValidity);
  roomNumberInputElement.addEventListener('input', checkCapacityValidity);
  capacityInputElement.addEventListener('input', checkCapacityValidity);

  submitButtonElement.addEventListener('click', function () {
    var invalidElements = adFormElement.querySelectorAll('input:invalid, select:invalid, textarea:invalid');

    invalidElements.forEach(function (it) {
      it.style.outline = '2px solid red';
    });
  });
})();
