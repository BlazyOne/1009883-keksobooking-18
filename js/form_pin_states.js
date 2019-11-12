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
  var ADS_DOWNLOAD_URL = 'https://js.dump.academy/keksobooking/data';
  var ADS_DOWNLOAD_TYPE = 'GET';
  var AD_UPLOAD_URL = 'https://js.dump.academy/keksobooking';
  var AD_UPLOAD_TYPE = 'POST';
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png', 'svg'];
  var DEFAULT_AVATAR_URL = 'img/muffin-grey.svg';

  var Coordinates = function (x, y) {
    this.x = x;
    this.y = y;
  };

  var mapElement = document.querySelector('.map');
  var adFormElement = document.querySelector('.ad-form');
  var adFormAvatarUploadElement = adFormElement.querySelector('#avatar');
  var adFormAvatarPreviewElement = adFormElement.querySelector('.ad-form-header__preview img');
  var adFormAddressElement = adFormElement.querySelector('#address');
  var adFormPhotoUploadElement = adFormElement.querySelector('#images');
  var adFormPhotoPreviewContainerElement = adFormElement.querySelector('.ad-form__photo');
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

      window.backend.load(ADS_DOWNLOAD_URL, ADS_DOWNLOAD_TYPE, onAdsDownloadSuccess, onAdsDownloadError);

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
        it.setCustomValidity('');
        it.style.outline = '';
      });
      Array.prototype.forEach.call(filterFormElement.elements, function (it) {
        it.disabled = true;
      });
      mapElement.querySelectorAll('.map__pin:not(.map__pin--main)').forEach(function (it) {
        it.remove();
      });
      window.card.hideCard();
      setAddressField(mainPinStartCoords.x, mainPinStartCoords.y);
      mainPinElement.style.left = mainPinStartCoords.x + 'px';
      mainPinElement.style.top = mainPinStartCoords.y + 'px';
      adFormAvatarPreviewElement.src = DEFAULT_AVATAR_URL;
      adFormPhotoPreviewContainerElement.textContent = '';
      window.validity.checkTitleValidity();
      window.validity.checkPriceValidity();
      window.validity.checkTimeOutValidity();
      window.validity.checkCapacityValidity();
      isActive = false;
    }
  };

  var setAddressField = function (x, y) {
    if (isActive) {
      adFormAddressElement.value = (x + MAIN_PIN_HALF_WIDTH) + ', ' + (y + MAIN_PIN_HEIGHT);
    } else {
      adFormAddressElement.value = (x + MAIN_PIN_HALF_WIDTH) + ', ' + (y + MAIN_PIN_CIRCLE_HALF_HEIGHT);
    }
  };

  var onAdsDownloadError = function (errorMessage) {
    var errorElement = window.util.createLoadErrorElement();

    document.querySelector('main').appendChild(errorElement);
    errorElement.querySelector('.error__message').textContent = 'Ошибка загрузки файла похожих объявлений. ' + errorMessage;
  };

  var onAdsDownloadSuccess = function (data) {
    window.formPinStates = {
      data: data
    };
    window.pins.fillPins(data);
    Array.prototype.forEach.call(filterFormElement.elements, function (it) {
      it.disabled = false;
    });
  };

  var onAdUploadError = function (errorMessage) {
    var errorElement = window.util.createLoadErrorElement();

    document.querySelector('main').appendChild(errorElement);
    errorElement.querySelector('.error__message').textContent = 'Ошибка загрузки объявления. ' + errorMessage;
  };

  var onAdUploadSuccess = function () {
    var successElement = window.util.createLoadSuccessElement();

    setInactive();
    document.querySelector('main').appendChild(successElement);
  };

  var setAvatar = function () {
    var file = adFormAvatarUploadElement.files[0];
    var filename = file.name.toLowerCase();

    var matches = FILE_TYPES.some(function (it) {
      return filename.endsWith(it);
    });

    if (matches) {
      var reader = new FileReader();

      reader.addEventListener('load', function () {
        adFormAvatarPreviewElement.src = reader.result;
      });

      reader.readAsDataURL(file);
    }
  };

  var setPhoto = function () {
    var file = adFormPhotoUploadElement.files[0];
    var filename = file.name.toLowerCase();

    var matches = FILE_TYPES.some(function (it) {
      return filename.endsWith(it);
    });

    if (matches) {
      var reader = new FileReader();

      reader.addEventListener('load', function () {
        var preview = document.createElement('img');
        adFormPhotoPreviewContainerElement.textContent = '';
        preview.src = reader.result;
        preview.style.width = 'auto';
        preview.style.height = 'auto';
        preview.style.maxWidth = '100%';
        preview.style.maxHeight = '100%';
        adFormPhotoPreviewContainerElement.appendChild(preview);
      });

      reader.readAsDataURL(file);
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
    var mouseY = evt.clientY;
    var pageYStart = pageYOffset;

    setAddressField(mainPinElement.offsetLeft, mainPinElement.offsetTop);

    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();

      var shift = new Coordinates(moveEvt.clientX - startMouseCoordinates.x, moveEvt.clientY - startMouseCoordinates.y);
      var endPointCoordinates = new Coordinates(mainPinElement.offsetLeft + MAIN_PIN_HALF_WIDTH + shift.x, mainPinElement.offsetTop + MAIN_PIN_HEIGHT + shift.y);
      var mapPinsRect = mapElement.querySelector('.map__pins').getBoundingClientRect();

      mouseY = moveEvt.clientY;

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

    var onScroll = function () {
      var scrollShift = pageYOffset - pageYStart;
      var endPointY = mainPinElement.offsetTop + MAIN_PIN_HEIGHT + scrollShift;
      var mapPinsRect = mapElement.querySelector('.map__pins').getBoundingClientRect();

      pageYStart = pageYOffset;

      if (endPointY >= PIN_LIMITS.y.min && endPointY <= PIN_LIMITS.y.max && !(isYLimit && mouseY < mapPinsRect.top + scrollShift - MAIN_PIN_HEIGHT + PIN_LIMITS.y.min) && !(isYLimit && mouseY > mapPinsRect.top + scrollShift + PIN_LIMITS.y.max)) {
        mainPinElement.style.top = (mainPinElement.offsetTop + scrollShift) + 'px';
        isYLimit = false;
      } else if (endPointY < PIN_LIMITS.y.min) {
        mainPinElement.style.top = (PIN_LIMITS.y.min - MAIN_PIN_HEIGHT) + 'px';
        isYLimit = true;
      } else if (endPointY > PIN_LIMITS.y.max) {
        mainPinElement.style.top = (PIN_LIMITS.y.max - MAIN_PIN_HEIGHT) + 'px';
        isYLimit = true;
      }

      setAddressField(mainPinElement.offsetLeft, mainPinElement.offsetTop);
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('scroll', onScroll);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('scroll', onScroll);
    document.addEventListener('mouseup', onMouseUp);
  });

  adFormResetElement.addEventListener('click', setInactive);

  adFormElement.addEventListener('submit', function (evt) {
    window.backend.load(AD_UPLOAD_URL, AD_UPLOAD_TYPE, onAdUploadSuccess, onAdUploadError, new FormData(adFormElement));
    evt.preventDefault();
  });

  adFormAvatarUploadElement.addEventListener('input', setAvatar);
  adFormPhotoUploadElement.addEventListener('input', setPhoto);
})();
