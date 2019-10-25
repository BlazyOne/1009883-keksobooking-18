'use strict';

(function () {
  var cardTemplateElement = document.querySelector('#card').content.querySelector('.map__card');
  var cardElement = cardTemplateElement.cloneNode(true);
  var cardClose = cardElement.querySelector('.popup__close');

  document.querySelector('.map').insertBefore(cardElement, document.querySelector('.map__filters-container'));
  cardElement.classList.add('hidden');

  var renderCard = function (itemData) {
    var type;
    switch (itemData.offer.type) {
      case 'palace':
        type = 'Дворец';
        break;
      case 'flat':
        type = 'Квартира';
        break;
      case 'house':
        type = 'Дом';
        break;
      case 'bungalo':
        type = 'Бунгало';
        break;
    }

    var roomsText;
    if (itemData.offer.rooms % 100 > 10 && itemData.offer.rooms % 100 < 20 || itemData.offer.rooms % 10 === 0 || itemData.offer.rooms % 10 > 4) {
      roomsText = itemData.offer.rooms + ' комнат';
    } else if (itemData.offer.rooms % 10 === 1) {
      roomsText = itemData.offer.rooms + ' комната';
    } else {
      roomsText = itemData.offer.rooms + ' комнаты';
    }

    var guestsText;
    if (itemData.offer.guests % 10 === 1 && itemData.offer.guests % 100 !== 11) {
      guestsText = 'для ' + itemData.offer.guests + ' гостя';
    } else {
      guestsText = 'для ' + itemData.offer.guests + ' гостей';
    }

    cardElement.querySelector('.popup__avatar').src = itemData.author.avatar;
    cardElement.querySelector('.popup__title').textContent = itemData.offer.title;
    cardElement.querySelector('.popup__text--address').textContent = itemData.offer.address;
    cardElement.querySelector('.popup__text--price').textContent = itemData.offer.price + '₽/ночь';
    cardElement.querySelector('.popup__type').textContent = type;
    cardElement.querySelector('.popup__text--capacity').textContent = roomsText + ' ' + guestsText;
    cardElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + itemData.offer.checkin + ', выезд до ' + itemData.offer.checkout;

    var popupFeaturesElement = cardElement.querySelector('.popup__features');
    popupFeaturesElement.textContent = '';
    var featuresFragment = document.createDocumentFragment();
    itemData.offer.features.forEach(function (it) {
      var featureElement = document.createElement('li');
      featureElement.classList.add('popup__feature');
      featureElement.classList.add('popup__feature--' + it);
      featuresFragment.appendChild(featureElement);
    });
    popupFeaturesElement.appendChild(featuresFragment);

    cardElement.querySelector('.popup__description').textContent = itemData.offer.description;

    var popupPhotosElement = cardElement.querySelector('.popup__photos');
    popupPhotosElement.textContent = '';
    var photosFragment = document.createDocumentFragment();
    itemData.offer.photos.forEach(function (it) {
      var photoElement = cardTemplateElement.querySelector('.popup__photo').cloneNode(true);
      photoElement.src = it;
      photosFragment.appendChild(photoElement);
    });
    popupPhotosElement.appendChild(photosFragment);
  };

  var onCardEscPress = function (evt) {
    window.util.isEscEvent(evt, hideCard);
  };

  var showCard = function (cardData) {
    renderCard(cardData);
    cardElement.classList.remove('hidden');
    document.addEventListener('keydown', onCardEscPress);
  };

  var hideCard = function () {
    cardElement.classList.add('hidden');
    document.removeEventListener('keydown', onCardEscPress);
  };

  window.card = {
    showCard: showCard
  };

  cardClose.addEventListener('click', hideCard);
})();
