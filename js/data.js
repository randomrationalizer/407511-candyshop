// Модуль, генерирющий данные товаров

'use strict';
(function () {
  var GOODS_NAMES = ['Чесночные сливки', 'Огуречный педант', 'Молочная хрюша', 'Грибной шейк', 'Баклажановое безумие', 'Паприколу итальяно', 'Нинзя-удар васаби', 'Хитрый баклажан', 'Горчичный вызов', 'Кедровая липучка', 'Корманный портвейн', 'Чилийский задира', 'Беконовый взрыв', 'Арахис vs виноград', 'Сельдерейная душа', 'Початок в бутылке', 'Чернющий мистер чеснок', 'Раша федераша', 'Кислая мина', 'Кукурузное утро', 'Икорный фуршет', 'Новогоднее настроение', 'С пивком потянет', 'Мисс креветка', 'Бесконечный взрыв', 'Невинные винные', 'Бельгийское пенное', 'Острый язычок'];

  var GOODS_INGREDIENTS = ['молоко', 'сливки', 'вода', 'пищевой краситель', 'патока', 'ароматизатор бекона', 'ароматизатор свинца', 'ароматизатор дуба, идентичный натуральному', 'ароматизатор картофеля', 'лимонная кислота', 'загуститель', 'эмульгатор', 'консервант: сорбат калия', 'посолочная смесь: соль, нитрит натрия', 'ксилит', 'карбамид', 'вилларибо', 'виллабаджо'];

  var GOODS_IDS = ['gum-cedar', 'gum-chile', 'gum-eggplant', 'gum-mustard', 'gum-portwine', 'gum-wasabi', 'ice-cucumber', 'ice-eggplant', 'ice-garlic', 'ice-italian', 'ice-mushroom', 'ice-pig', 'marmalade-beer', 'marmalade-caviar', 'marmalade-corn', 'marmalade-new-year', 'marmalade-sour', 'marshmallow-bacon', 'marshmallow-shrimp', 'marshmallow-beer', 'soda-russian', 'soda-peanut-grapes', 'soda-garlic', 'soda-cob', 'soda-celery', 'soda-bacon', 'marshmallow-wine', 'marshmallow-spicy'];

  var goodsCount = 24;

  // Генерирует массив из N объектов товаров
  var createProductsArr = function (titles, productsIds, ingredients, count) {
    var productsArr = [];

    for (var i = 0; i < count; i++) {
      var product = {};
      product.name = titles[i];
      product.id = window.util.getRandomItem(productsIds);
      product.photo = 'img/cards/' + product.id + '.jpg';
      product.amount = window.util.getRandomInt(0, 20);
      product.price = window.util.getRandomInt(100, 1500);
      product.weight = window.util.getRandomInt(30, 300);
      product.rating = {
        value: window.util.getRandomInt(1, 5),
        number: window.util.getRandomInt(10, 900)
      };
      product.nutritionFacts = {
        sugar: Boolean(window.util.getRandomInt(0, 1)),
        energy: window.util.getRandomInt(700, 500),
        contents: window.util.getRandomLengthArr(ingredients).join(', ')
      };
      productsArr[i] = product;
    }

    return productsArr;
  };

  // Экспорт сгенерированных массивов товаров
  window.data = {
    productsArray: createProductsArr(GOODS_NAMES, GOODS_IDS, GOODS_INGREDIENTS, goodsCount),

    // Массив товаров в корзине
    productsInCartArray: [],

    // Создает объект товара, добавленного в корзину
    createOrderedProduct: function (product) {
      var orderedProduct = {};
      Object.assign(orderedProduct, product);
      orderedProduct.orderedAmount = 0;
      delete orderedProduct.amount;
      delete orderedProduct.nutritionFacts;
      delete orderedProduct.weight;
      delete orderedProduct.rating;
      return orderedProduct;
    },

    // Находит объект товара в массиве товаров по имени
    findRelevantProductObj: function (arr, productName) {
      for (var i = 0; i < arr.length; i++) {
        if (arr[i].name === productName) {
          var relevantObj = arr[i];
        }
      }
      return relevantObj;
    }
  };
})();
