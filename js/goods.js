'use strict';

var GOODS_NAMES = ['Чесночные сливки', 'Огуречный педант', 'Молочная хрюша', 'Грибной шейк', 'Баклажановое безумие', 'Паприколу итальяно', 'Нинзя-удар васаби', 'Хитрый баклажан', 'Горчичный вызов', 'Кедровая липучка', 'Корманный портвейн', 'Чилийский задира', 'Беконовый взрыв', 'Арахис vs виноград', 'Сельдерейная душа', 'Початок в бутылке', 'Чернющий мистер чеснок', 'Раша федераша', 'Кислая мина', 'Кукурузное утро', 'Икорный фуршет', 'Новогоднее настроение', 'С пивком потянет', 'Мисс креветка', 'Бесконечный взрыв', 'Невинные винные', 'Бельгийское пенное', 'Острый язычок'];

var GOODS_INGREDIENTS = ['молоко', 'сливки', 'вода', 'пищевой краситель', 'патока', 'ароматизатор бекона', 'ароматизатор свинца', 'ароматизатор дуба, идентичный натуральному', 'ароматизатор картофеля', 'лимонная кислота', 'загуститель', 'эмульгатор', 'консервант: сорбат калия', 'посолочная смесь: соль, нитрит натрия', 'ксилит', 'карбамид', 'вилларибо', 'виллабаджо'];

var GOODS_IDS = ['gum-cedar', 'gum-chile', 'gum-eggplant', 'gum-mustard', 'gum-portwine', 'gum-wasabi', 'ice-cucumber', 'ice-eggplant', 'ice-garlic', 'ice-italian', 'ice-mushroom', 'ice-pig', 'marmalade-beer', 'marmalade-caviar', 'marmalade-corn', 'marmalade-new-year', 'marmalade-sour', 'marshmallow-bacon', 'marshmallow-shrimp', 'marshmallow-beer', 'soda-russian', 'soda-peanut-grapes', 'soda-garlic', 'soda-cob', 'soda-celery', 'soda-bacon', 'marshmallow-wine', 'marshmallow-spicy'];

var goodsCount = 24;
var goodsInCartCount = 3;

var productCardTemplate = document.querySelector('#card').content.querySelector('.catalog__card');
var catalogListElement = document.querySelector('.catalog__cards');
var productInCartTemplate = document.querySelector('#card-order').content.querySelector('.goods_card');
var cartListElement = document.querySelector('.goods__cards');

// Возвращает случайное целое число от min до maх (включительно)
var getRandomInt = function (min, max) {
  var randomInt = min + Math.ceil(Math.random() * (max - min));
  return randomInt;
};

// Возвращает случайный элемент массива
var getRandomItem = function (arr) {
  var randomItem = arr[getRandomInt(0, arr.length - 1)];
  return randomItem;
};

// Возвращает массив произвольной длины
var getRandomLengthArr = function (arr) {
  var randomLength = getRandomInt(1, arr.length);
  var randomLengthArr = arr.slice(getRandomInt(0, randomLength - 1), randomLength);
  return randomLengthArr;
};

// Генерирует массив из N объектов товаров
var createProductsArr = function (titles, productsIds, ingredients, count) {
  var productsArr = [];

  for (var i = 0; i < count; i++) {
    var product = {};
    product.name = titles[i];
    product.id = getRandomItem(productsIds);
    product.photo = 'img/cards/' + product.id + '.jpg';
    product.amount = getRandomInt(0, 20);
    product.price = getRandomInt(100, 1500);
    product.weight = getRandomInt(30, 300);
    product.rating = {
      value: getRandomInt(1, 5),
      number: getRandomInt(10, 900)
    };
    product.nutritionFacts = {
      sugar: Boolean(getRandomInt(0, 1)),
      energy: getRandomInt(700, 500),
      contents: getRandomLengthArr(ingredients).join(', ')
    };
    productsArr[i] = product;
  }

  return productsArr;
};

// Создает DOM-элемент карточки товара в каталоге
var createCardElement = function (product) {
  var cardElement = productCardTemplate.cloneNode(true);

  var productAvailability = '';
  if (product.amount === 0) {
    productAvailability = 'card--soon';
  } else if (product.amount >= 1 && product.amount < 5) {
    productAvailability = 'card--little';
  } else {
    productAvailability = 'card--in-stock';
  }
  cardElement.classList.add(productAvailability);

  cardElement.querySelector('.card__img').src = product.photo;
  cardElement.querySelector('.card__title').textContent = product.name;
  cardElement.querySelector('.card__price').insertAdjacentText('afterbegin', product.price + ' ');
  cardElement.querySelector('.card__weight').textContent = product.weight + ' Г';
  var starsRating = '';
  if (product.rating.value === 1) {
    starsRating = 'stars__rating--one';
  } else if (product.rating.value === 2) {
    starsRating = 'stars__rating--two';
  } else if (product.rating.value === 3) {
    starsRating = 'stars__rating--three';
  } else if (product.rating.value === 4) {
    starsRating = 'stars__rating--four';
  } else if (product.rating.value === 5) {
    starsRating = 'stars__rating--five';
  }
  cardElement.querySelector('.stars__rating').classList.add(starsRating);
  cardElement.querySelector('.star__count').textContent = product.rating.number;

  var producSugarContent = '';
  producSugarContent = product.nutritionFacts.sugar ? 'Содержит сахар' : 'Без сахара';
  cardElement.querySelector('.card__characteristic').textContent = producSugarContent + '. ' + product.nutritionFacts.energy + ' ккал';
  cardElement.querySelector('.card__composition-list').textContent = product.nutritionFacts.contents + '.';

  return cardElement;
};

// Отрисовывает карточки товаров на страницу каталога
var renderProductCards = function (products) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < products.length; i++) {
    fragment.appendChild(createCardElement(products[i]));
  }
  catalogListElement.appendChild(fragment);
};

// Создает DOM-элемент карточки товара в корзине
var createProductInCartElement = function (product) {
  var productInCartElement = productInCartTemplate.cloneNode(true);
  productInCartElement.querySelector('.card-order__title').textContent = product.name;
  productInCartElement.querySelector('img').src = product.photo;
  productInCartElement.querySelector('.card-order__count').name = product.id;
  productInCartElement.querySelector('.card-order__count').id = 'card-order__' + product.id;
  productInCartElement.querySelector('.card-order__price').textContent = product.price + '  ₽';
  return productInCartElement;
};

// Отрисовывает карточки товаров, добавленных в корзину
var renderProductsInCart = function (productsInCart) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < productsInCart.length; i++) {
    fragment.appendChild(createProductInCartElement(productsInCart[i]));
  }
  cartListElement.appendChild(fragment);
};

var productsArray = createProductsArr(GOODS_NAMES, GOODS_IDS, GOODS_INGREDIENTS, goodsCount);
renderProductCards(productsArray);

var productsInCartArray = createProductsArr(GOODS_NAMES, GOODS_IDS, GOODS_INGREDIENTS, goodsInCartCount);
renderProductsInCart(productsInCartArray);
