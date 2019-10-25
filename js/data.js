'use strict';

(function () {
  var MOCKS_AMOUNT = 8;
  var X_MIN = 0;
  var X_MAX = 1200;
  var Y_MIN = 130;
  var Y_MAX = 630;
  var TITLES = ['Маленькая квартирка рядом с парком', 'Милейший чердачок', 'Стандартная квартира в центре'];
  var PRICE_MIN = 100;
  var PRICE_MAX = 100000;
  var TYPES = ['palace', 'flat', 'house', 'bungalo'];
  var ROOMS_MIN = 1;
  var ROOMS_MAX = 10;
  var GUESTS_MIN = 1;
  var GUESTS_MAX = 10;
  var CHECKIN = ['12:00', '13:00', '14:00'];
  var CHECKOUT = ['12:00', '13:00', '14:00'];
  var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
  var DESCRIPTIONS = ['Маленькая чистая квратира. Без интернета, регистрации и СМС.', 'Маленькая квартирка. Для самых не требовательных.', 'Тут красиво, светло и уютно.'];
  var PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];

  var getAvatarsArray = function (amount) {
    var avatarsArray = [];
    for (var i = 1; i <= amount; i++) {
      var avatarUrl = 'img/avatars/user' + (i < 10 ? '0' : '') + i + '.png';
      avatarsArray.push(avatarUrl);
    }
    return avatarsArray;
  };

  var getMockArray = function (amount) {
    var data = [];

    var avatars = getAvatarsArray(amount);
    window.util.shuffle(avatars);

    for (var i = 0; i < amount; i++) {

      var x = window.util.getRandomInRange(X_MIN, X_MAX);
      var y = window.util.getRandomInRange(Y_MIN, Y_MAX);
      var features = FEATURES.slice();
      window.util.shuffle(features);
      features = features.slice(0, window.util.getRandomInRange(0, FEATURES.length));
      var photos = PHOTOS.slice();
      window.util.shuffle(photos);
      photos = photos.slice(0, window.util.getRandomInRange(0, PHOTOS.length));

      var mockObject = {
        author: {
          avatar: avatars[i]
        },
        offer: {
          title: window.util.getRandomFromArray(TITLES),
          address: x + ', ' + y,
          price: window.util.getRandomInRange(PRICE_MIN, PRICE_MAX),
          type: window.util.getRandomFromArray(TYPES),
          rooms: window.util.getRandomInRange(ROOMS_MIN, ROOMS_MAX),
          guests: window.util.getRandomInRange(GUESTS_MIN, GUESTS_MAX),
          checkin: window.util.getRandomFromArray(CHECKIN),
          checkout: window.util.getRandomFromArray(CHECKOUT),
          features: features,
          description: window.util.getRandomFromArray(DESCRIPTIONS),
          photos: photos
        },
        location: {
          x: x,
          y: y
        }
      };

      data.push(mockObject);
    }

    return data;
  };

  var mock = getMockArray(MOCKS_AMOUNT);

  window.data = {
    mock: mock
  };
})();
