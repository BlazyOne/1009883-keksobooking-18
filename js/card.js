'use strict';

(function () {
  var cardTemplateElement = document.querySelector('#card').content.querySelector('.map__card');
  var cardElement = cardTemplateElement.cloneNode(true);
  var cardClose = cardElement.querySelector('.popup__close');
  var targetPin = document.querySelector('#pin').content.querySelector('.map__pin').cloneNode(true);

  document.querySelector('.map').insertBefore(cardElement, document.querySelector('.map__filters-container'));
  cardElement.classList.add('hidden');

  var renderCard = function (itemData) {
    var type = {
      palace: 'Дворец',
      flat: 'Квартира',
      house: 'Дом',
      bungalo: 'Бунгало'
    };

    cardElement.querySelector('.popup__avatar').src = itemData.author.avatar;
    cardElement.querySelector('.popup__title').textContent = itemData.offer.title;
    cardElement.querySelector('.popup__text--address').textContent = itemData.offer.address;
    cardElement.querySelector('.popup__text--price').textContent = itemData.offer.price + '₽/ночь';
    cardElement.querySelector('.popup__type').textContent = type[itemData.offer.type];
    cardElement.querySelector('.popup__text--capacity').textContent = itemData.offer.rooms + ' ' + window.util.getNoun(itemData.offer.rooms, 'комната', 'комнаты', 'комнат') + ' для ' + itemData.offer.guests + ' ' + window.util.getNoun(itemData.offer.guests, 'гостя', 'гостей', 'гостей');
    cardElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + itemData.offer.checkin + ', выезд до ' + itemData.offer.checkout;

    var popupFeaturesElement = cardElement.querySelector('.popup__features');
    popupFeaturesElement.textContent = '';
    var featuresFragment = document.createDocumentFragment();
    itemData.offer.features.forEach(function (it) {
      var featureElement = document.createElement('li');
      featureElement.classList.add('popup__feature', 'popup__feature--' + it);
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
    showCard: showCard
  };

  cardClose.addEventListener('click', hideCard);
})();
