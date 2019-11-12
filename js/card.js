'use strict';

(function () {
  var cardTemplateElement = document.querySelector('#card').content.querySelector('.map__card');
  var cardElement = cardTemplateElement.cloneNode(true);
  var cardClose = cardElement.querySelector('.popup__close');
  var targetPin = document.querySelector('#pin').content.querySelector('.map__pin').cloneNode(true);

  document.querySelector('.map').insertBefore(cardElement, document.querySelector('.map__filters-container'));
  cardElement.classList.add('hidden');

  var renderCard = function (itemData) {
    var popupAvatarElement = cardElement.querySelector('.popup__avatar');
    var popupTitleElement = cardElement.querySelector('.popup__title');
    var popupAddressElement = cardElement.querySelector('.popup__text--address');
    var popupPriceElement = cardElement.querySelector('.popup__text--price');
    var popupTypeElement = cardElement.querySelector('.popup__type');
    var popupCapacityElement = cardElement.querySelector('.popup__text--capacity');
    var popupTimeElement = cardElement.querySelector('.popup__text--time');
    var popupFeaturesElement = cardElement.querySelector('.popup__features');
    var popupDescriptionElement = cardElement.querySelector('.popup__description');
    var popupPhotosElement = cardElement.querySelector('.popup__photos');
    var type = {
      palace: 'Дворец',
      flat: 'Квартира',
      house: 'Дом',
      bungalo: 'Бунгало'
    };

    var setCardBlock = function (condition, cardBlockElement, assignmentType, assignmentValue) {
      if (condition) {
        cardBlockElement[assignmentType] = assignmentValue;
        cardBlockElement.classList.remove('hidden');
      } else {
        cardBlockElement.classList.add('hidden');
      }
    };

    setCardBlock(itemData.author.avatar, popupAvatarElement, 'src', itemData.author.avatar);
    setCardBlock(itemData.offer.title, popupTitleElement, 'textContent', itemData.offer.title);
    setCardBlock(itemData.offer.address, popupAddressElement, 'textContent', itemData.offer.address);
    setCardBlock(itemData.offer.price >= 0, popupPriceElement, 'textContent', itemData.offer.price + '₽/ночь');
    setCardBlock(itemData.offer.type, popupTypeElement, 'textContent', type[itemData.offer.type]);
    setCardBlock(itemData.offer.rooms >= 0 && itemData.offer.guests >= 0, popupCapacityElement, 'textContent', itemData.offer.rooms + ' ' + window.util.getNoun(itemData.offer.rooms, 'комната', 'комнаты', 'комнат') + ' для ' + itemData.offer.guests + ' ' + window.util.getNoun(itemData.offer.guests, 'гостя', 'гостей', 'гостей'));
    setCardBlock(itemData.offer.checkin && itemData.offer.checkout, popupTimeElement, 'textContent', 'Заезд после ' + itemData.offer.checkin + ', выезд до ' + itemData.offer.checkout);

    if (itemData.offer.features.length >= 1) {
      popupFeaturesElement.textContent = '';
      var featuresFragment = document.createDocumentFragment();
      itemData.offer.features.forEach(function (it) {
        var featureElement = document.createElement('li');
        featureElement.classList.add('popup__feature', 'popup__feature--' + it);
        featuresFragment.appendChild(featureElement);
      });
      popupFeaturesElement.appendChild(featuresFragment);
      popupFeaturesElement.classList.remove('hidden');
    } else {
      popupFeaturesElement.classList.add('hidden');
    }

    setCardBlock(itemData.offer.description, popupDescriptionElement, 'textContent', itemData.offer.description);

    if (itemData.offer.photos.length >= 1) {
      popupPhotosElement.textContent = '';
      var photosFragment = document.createDocumentFragment();
      itemData.offer.photos.forEach(function (it) {
        var photoElement = cardTemplateElement.querySelector('.popup__photo').cloneNode(true);
        photoElement.src = it;
        photosFragment.appendChild(photoElement);
      });
      popupPhotosElement.appendChild(photosFragment);
      popupPhotosElement.classList.remove('hidden');
    } else {
      popupPhotosElement.classList.add('hidden');
    }
  };

  var onCardEscPress = function (evt) {
    window.util.isEscEvent(evt, hideCard);
  };

  var showCard = function (cardData, evt) {
    renderCard(cardData);
    cardElement.classList.remove('hidden');
    targetPin.classList.remove('map__pin--active');
    targetPin = evt.currentTarget;
    targetPin.classList.add('map__pin--active');
    document.addEventListener('keydown', onCardEscPress);
  };

  var hideCard = function () {
    cardElement.classList.add('hidden');
    targetPin.classList.remove('map__pin--active');
    document.removeEventListener('keydown', onCardEscPress);
  };

  window.card = {
    showCard: showCard,
    hideCard: hideCard
  };

  cardClose.addEventListener('click', hideCard);
})();
