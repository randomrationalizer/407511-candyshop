'use strict';

var GOODS_NAMES = ['Чесночные сливки', 'Огуречный педант', 'Молочная хрюша', 'Грибной шейк', 'Баклажановое безумие', 'Паприколу итальяно', 'Нинзя-удар васаби', 'Хитрый баклажан', 'Горчичный вызов', 'Кедровая липучка', 'Корманный портвейн', 'Чилийский задира', 'Беконовый взрыв', 'Арахис vs виноград', 'Сельдерейная душа', 'Початок в бутылке', 'Чернющий мистер чеснок', 'Раша федераша', 'Кислая мина', 'Кукурузное утро', 'Икорный фуршет', 'Новогоднее настроение', 'С пивком потянет', 'Мисс креветка', 'Бесконечный взрыв', 'Невинные винные', 'Бельгийское пенное', 'Острый язычок'];

var GOODS_INGREDIENTS = ['молоко', 'сливки', 'вода', 'пищевой краситель', 'патока', 'ароматизатор бекона', 'ароматизатор свинца', 'ароматизатор дуба, идентичный натуральному', 'ароматизатор картофеля', 'лимонная кислота', 'загуститель', 'эмульгатор', 'консервант: сорбат калия', 'посолочная смесь: соль, нитрит натрия', 'ксилит', 'карбамид', 'вилларибо', 'виллабаджо'];

var GOODS_IDS = ['gum-cedar', 'gum-chile', 'gum-eggplant', 'gum-mustard', 'gum-portwine', 'gum-wasabi', 'ice-cucumber', 'ice-eggplant', 'ice-garlic', 'ice-italian', 'ice-mushroom', 'ice-pig', 'marmalade-beer', 'marmalade-caviar', 'marmalade-corn', 'marmalade-new-year', 'marmalade-sour', 'marshmallow-bacon', 'marshmallow-shrimp', 'marshmallow-beer', 'soda-russian', 'soda-peanut-grapes', 'soda-garlic', 'soda-cob', 'soda-celery', 'soda-bacon', 'marshmallow-wine', 'marshmallow-spicy'];

var goodsCount = 24;
var minPrice = 0;
var maxPrice = 100;

var productCardTemplate = document.querySelector('#card').content.querySelector('.catalog__card');
var catalogListElement = document.querySelector('.catalog__cards');
var productInCartTemplate = document.querySelector('#card-order').content.querySelector('.goods_card');
var cartListElement = document.querySelector('.goods__cards');
var emptyCartMsgElement = document.querySelector('.goods__card-empty');
var catalogLoadMsgElement = document.querySelector('.catalog__load');
var mainHeaderBasketTotalElement = document.querySelector('.main-header__basket');
var orderFormElements = document.querySelector('.order').querySelectorAll('input');
var cartTotalElement = document.querySelector('.goods__total');
var cartTotalCountElement = cartTotalElement.querySelector('.goods__total-count');
var paymentMethodsToggleElement = document.querySelector('.payment__method');
var deliveryMethodsToggleElement = document.querySelector('.deliver__toggle');
var rangeFilterElement = document.querySelector('.range__filter');
var rangeBtnElements = rangeFilterElement.querySelectorAll('.range__btn');
var rangeMinPriceElement = rangeFilterElement.querySelector('.range__price--min');
var rangeMaxPriceElement = rangeFilterElement.querySelector('.range__price--max');
var rangeLeftBtnElement = rangeFilterElement.querySelector('.range__btn--left');
var rangeRightBtnElement = rangeFilterElement.querySelector('.range__btn--right');
var rangeLineFillElement = rangeFilterElement.querySelector('.range__fill-line');
var rangeWidth = rangeFilterElement.offsetWidth;

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

// Создает объект товара, добавленного в корзину
var createOrderedProduct = function (product) {
  var orderedProduct = {};
  Object.assign(orderedProduct, product);
  orderedProduct.orderedAmount = 0;
  delete orderedProduct.amount;
  delete orderedProduct.nutritionFacts;
  delete orderedProduct.weight;
  delete orderedProduct.rating;
  return orderedProduct;
};

// Создает DOM-элемент карточки товара в корзине
var createProductInCartElement = function (productInCart) {
  var productInCartElement = productInCartTemplate.cloneNode(true);
  productInCartElement.querySelector('.card-order__title').textContent = productInCart.name;
  productInCartElement.querySelector('img').src = productInCart.photo;
  productInCartElement.querySelector('.card-order__count').name = productInCart.id;
  productInCartElement.querySelector('.card-order__count').value = '' + productInCart.orderedAmount;
  productInCartElement.querySelector('.card-order__count').id = 'card-order__' + productInCart.id;
  productInCartElement.querySelector('.card-order__price').textContent = productInCart.price + '  ₽';
  return productInCartElement;
};

// Отрисовывает карточку товара, добавленного в корзину
var renderProductInCart = function (productInCart) {
  var cardElement = createProductInCartElement(productInCart);
  cartListElement.appendChild(cardElement);
  var closeBtn = cardElement.querySelector('.card-order__close');
  closeBtn.addEventListener('click', onDeleteBtnClick);
  var arrowBtns = cardElement.querySelectorAll('.card-order__btn');
  for (var i = 0; i < arrowBtns.length; i++) {
    arrowBtns[i].addEventListener('click', onArrowBtnClick);
  }
  var inputProductCount = cardElement.querySelector('.card-order__count');
  inputProductCount.addEventListener('change', onInputValueChange);
};

// Показывает или скрывает сообщение о загрузке списка товаров в каталоге
var showCardsLoadingMsg = function (isLoading) {
  if (isLoading) {
    catalogLoadMsgElement.classList.remove('visually-hidden');
    catalogListElement.classList.add('catalog__cards--load');
  } else {
    catalogLoadMsgElement.classList.add('visually-hidden');
    catalogListElement.classList.remove('catalog__cards--load');
  }
};

// Показывает или скрывает сообщение о пустой корзине
var showEmptyCartMsg = function (isEmpty) {
  if (isEmpty) {
    emptyCartMsgElement.classList.remove('visually-hidden');
    cartListElement.classList.add('goods__cards--empty');
    mainHeaderBasketTotalElement.textContent = 'В корзине ничего нет';
  } else {
    emptyCartMsgElement.classList.add('visually-hidden');
    cartListElement.classList.remove('goods__cards--empty');
  }
};

// Показывает или скрывает сообщение о количестве товаров в корзине и итоговой сумме заказа
var showCartTotal = function (isShown) {
  if (isShown) {
    cartTotalElement.classList.remove('visually-hidden');
  } else {
    cartTotalElement.classList.add('visually-hidden');
  }
};

// Добавляет/удаляет карточку товара из избранного
var addProductInFavorite = function (evt) {
  if (evt.target.classList.contains('card__btn-favorite')) {
    evt.target.classList.toggle('card__btn-favorite--selected');
    evt.target.blur();
  }
};

// Добавляет обработчик события клик на блок товаров, регистрирующий нажатие кнопки "Добавить в избранное" на карточках товаров
var addFavoriteBtnsClickHandler = function () {
  catalogListElement.addEventListener('click', addProductInFavorite);
};

// Добавляет товар в корзину
var addProductInCart = function (evt) {
  if (evt.target.classList.contains('card__btn')) {
    showEmptyCartMsg(false);
    showCartTotal(true);
    orderFormFieldsDisable(false);
    var inCartBtn = evt.target;
    var card = inCartBtn.closest('.catalog__card');
    var cardName = card.querySelector('.card__title').textContent;
    var productObj = findRelevantProductObj(productsArray, cardName);
    var orderedProductObj = findRelevantProductObj(productsInCartArray, cardName);

    inCartBtn.blur();

    if (productObj.amount > 0) {
      productObj.amount--;
      checkProductAmount(productObj, card);
      // Проверяет, есть ли уже такой товар в корзине
      if (Boolean(orderedProductObj) === false) {
        orderedProductObj = createOrderedProduct(productObj);
        orderedProductObj.orderedAmount++;
        productsInCartArray.push(orderedProductObj);
        renderProductInCart(orderedProductObj);
      } else {
        orderedProductObj.orderedAmount++;
        var cartCards = document.querySelectorAll('.card-order');
        var productInCartCard = findRelevantCardInCart(cartCards, cardName);
        productInCartCard.querySelector('.card-order__count').value++;
      }
    }
    changeCartTotal();
  }
};

// Проверяет количество товара, и, в зависимости от этого, добавляет карточке товара соответствующий класс
var checkProductAmount = function (product, productCard) {
  if (product.amount === 0) {
    productCard.classList.remove('card--in-stock');
    productCard.classList.remove('card--little');
    productCard.classList.add('card--soon');
  } else if (product.amount >= 1 && product.amount < 5) {
    productCard.classList.add('card--little');
    productCard.classList.remove('card--in-stock');
    productCard.classList.remove('card--soon');
  } else {
    productCard.classList.add('card--in-stock');
    productCard.classList.remove('card--soon');
    productCard.classList.remove('card--little');
  }
};

// Обновляет информацию о количестве товаров в корзине и сумме заказа
var changeCartTotal = function () {
  var inCartAmount = 0;
  var orderTotal = 0;
  for (var i = 0; i < productsInCartArray.length; i++) {
    inCartAmount += productsInCartArray[i].orderedAmount;
    orderTotal += productsInCartArray[i].price * productsInCartArray[i].orderedAmount;
  }

  var ending = '';
  var amount = inCartAmount.toString().split('');
  var lastNumber = parseInt(amount[amount.length - 1], 10);
  var penultimateNumber = parseInt(amount[amount.length - 2], 10);
  if (lastNumber === 1 && penultimateNumber !== 1) {
    ending = '';
  } else if (lastNumber >= 2 && lastNumber <= 4 && penultimateNumber !== 1) {
    ending = 'а';
  } else if (penultimateNumber === 1) {
    ending = 'ов';
  } else {
    ending = 'ов';
  }
  mainHeaderBasketTotalElement.textContent = 'В корзине ' + inCartAmount + ' товар' + ending + ' на ' + orderTotal + ' ₽';
  cartTotalCountElement.textContent = 'Итого за ' + inCartAmount + ' товар' + ending + ': ';
  var totalPrice = '<span class="goods__price"></span>';
  cartTotalCountElement.insertAdjacentHTML('beforeEnd', totalPrice);
  document.querySelector('.goods__price').textContent = orderTotal + ' ₽';
};

// Обработчик события клик на кнопке с крестиком в карточке товара в корзине
var onDeleteBtnClick = function (evt) {
  if (evt.target.classList.contains('card-order__close')) {
    var card = evt.target.closest('.goods_card');
    deleteProductInCart(card);
  }
};

// Удаляет товар из корзины
var deleteProductInCart = function (productCard) {
  var cardName = productCard.querySelector('.card-order__title').textContent;

  var orderedProduct = findRelevantProductObj(productsInCartArray, cardName);
  var productAmount = orderedProduct.orderedAmount;
  productsInCartArray.splice(productsInCartArray.indexOf(orderedProduct), 1);
  cartListElement.removeChild(productCard);

  var productObj = findRelevantProductObj(productsArray, cardName);
  productObj.amount += productAmount;
  var catalogCards = catalogListElement.querySelectorAll('.catalog__card');
  var productCatalogCard = findRelevantCatalogCard(catalogCards, cardName);
  checkProductAmount(productObj, productCatalogCard);

  if (productsInCartArray.length === 0) {
    showEmptyCartMsg(true);
    showCartTotal(false);
  } else {
    changeCartTotal();
  }
};

// Находит объект товара в массиве товаров по имени
var findRelevantProductObj = function (arr, productName) {
  for (var i = 0; i < arr.length; i++) {
    if (arr[i].name === productName) {
      var relevantObj = arr[i];
    }
  }
  return relevantObj;
};

// Находит элемент карточки товара в каталоге по названию продукта
var findRelevantCatalogCard = function (elementsCollection, productName) {
  for (var i = 0; i < elementsCollection.length; i++) {
    if (elementsCollection[i].querySelector('.card__title').textContent === productName) {
      var relevantCardElem = elementsCollection[i];
    }
  }
  return relevantCardElem;
};

// Находит элемент карточки товара в корзине по названию продукта
var findRelevantCardInCart = function (elementsCollection, productName) {
  for (var i = 0; i < elementsCollection.length; i++) {
    if (elementsCollection[i].querySelector('.card-order__title').textContent === productName) {
      var relevantCardElem = elementsCollection[i];
    }
  }
  return relevantCardElem;
};

// Изменяет количество товара в корзине при нажатии на кнопки со стрелками
var onArrowBtnClick = function (evt) {
  var btn = evt.target;
  var card = btn.closest('.goods_card');
  var cardName = card.querySelector('.card-order__title').textContent;
  var productObj = findRelevantProductObj(productsArray, cardName);
  var orderedProductObj = findRelevantProductObj(productsInCartArray, cardName);
  var catalogCards = catalogListElement.querySelectorAll('.catalog__card');
  var productCatalogCard = findRelevantCatalogCard(catalogCards, cardName);
  var productAmount = card.querySelector('.card-order__count').value;

  if (btn.classList.contains('card-order__btn--decrease')) {
    productObj.amount++;
    productAmount--;

    if (productAmount === 0) {
      productsInCartArray.splice(productsInCartArray.indexOf(orderedProductObj), 1);
      cartListElement.removeChild(card);
    }

    var increaseBtn = card.querySelector('.card-order__btn--increase');
    if (increaseBtn.hasAttribute('disabled')) {
      disableBtn(increaseBtn, false);
    }

    if (productsInCartArray.length === 0) {
      showEmptyCartMsg(true);
      showCartTotal(false);
    }
  } else if (evt.target.classList.contains('card-order__btn--increase')) {
    if (productObj.amount > 0) {
      productObj.amount--;
      if (productObj.amount === 0) {
        disableBtn(btn, true);
      }

      productAmount++;
    }
  }
  card.querySelector('.card-order__count').value = productAmount;
  orderedProductObj.orderedAmount = productAmount;
  checkProductAmount(productObj, productCatalogCard);
  changeCartTotal();
};

// Блокирует или разблокирует кнопку
var disableBtn = function (button, isDisabled) {
  if (isDisabled) {
    button.setAttribute('disabled', 'true');
  } else {
    button.removeAttribute('disabled');
  }
};

// Обработчик события изменения значения поля input с количеством товара в корзине
// При изменении значения поля меняет количество товара в основном массиве продуктов и массиве продуктов в корзине
// Ограничивает количество товара, которое можно добавить в корзину
var onInputValueChange = function (evt) {
  var input = evt.target;
  var card = input.closest('.goods_card');
  var cardName = card.querySelector('.card-order__title').textContent;
  var productObj = findRelevantProductObj(productsArray, cardName);
  var orderedProductObj = findRelevantProductObj(productsInCartArray, cardName);
  var catalogCards = catalogListElement.querySelectorAll('.catalog__card');
  var productCatalogCard = findRelevantCatalogCard(catalogCards, cardName);

  var productAmount = parseInt(input.value, 10);
  var amountDiff = productAmount - orderedProductObj.orderedAmount;

  if (productAmount > 0) {
    if (amountDiff > 0) {
      if (productObj.amount >= amountDiff) {
        orderedProductObj.orderedAmount = productAmount;
        productObj.amount -= amountDiff;
      } else if (productObj.amount < amountDiff) {
        orderedProductObj.orderedAmount = productAmount - amountDiff + productObj.amount;
        productObj.amount = 0;
        input.value = orderedProductObj.orderedAmount;
      }
    } else if (amountDiff < 0) {
      orderedProductObj.orderedAmount = productAmount;
      productObj.amount -= amountDiff;
    }
    checkProductAmount(productObj, productCatalogCard);
    changeCartTotal();
  } else if (productAmount === 0) {
    productObj.amount += orderedProductObj.orderedAmount;
    productsInCartArray.splice(productsInCartArray.indexOf(orderedProductObj), 1);
    cartListElement.removeChild(card);
    checkProductAmount(productObj, productCatalogCard);
    changeCartTotal();
    if (productsInCartArray.length === 0) {
      showEmptyCartMsg(true);
      showCartTotal(false);
    }
  } else if (productAmount < 0) {
    input.value = 1;
    productAmount = 1;
    productObj.amount += orderedProductObj.orderedAmount - productAmount;
    orderedProductObj.orderedAmount = productAmount;
    checkProductAmount(productObj, productCatalogCard);
    changeCartTotal();
  }
};

// Добавляет на блок списка товаров в каталоге обработчик события клик, регистрирующий нажатие кнопки "Добавить в корзину"
var addInCartBtnsClickHandler = function () {
  catalogListElement.addEventListener('click', addProductInCart);
};

// Блокирует/разблокирует поля формы заказа в зависимости от того, есть ли в корзине товар
var orderFormFieldsDisable = function (isCartEmpty) {
  if (isCartEmpty) {
    for (var i = 0; i < orderFormElements.length; i++) {
      orderFormElements[i].disabled = true;
    }
  } else {
    for (var j = 0; j < orderFormElements.length; j++) {
      orderFormElements[j].disabled = false;
    }
  }
};

// Показывает/скрывает соответствующие блоки полей формы при выборе способа оплаты
var togglePaymentMethod = function (evt) {
  if (evt.target.name === 'pay-method') {
    if (evt.target.id === 'payment__card') {
      document.querySelector('.payment__card-wrap').classList.remove('visually-hidden');
      document.querySelector('.payment__cash-wrap').classList.add('visually-hidden');
    } else if (evt.target.id === 'payment__cash') {
      document.querySelector('.payment__card-wrap').classList.add('visually-hidden');
      document.querySelector('.payment__cash-wrap').classList.remove('visually-hidden');
    }
  }
};

// Добавляет на блок формы оплаты обработчик, регистрирующий клик по кнопке со способом оплаты
var addPaymentMethodToggleClickHandler = function () {
  paymentMethodsToggleElement.addEventListener('click', togglePaymentMethod);
};

// Показывает/скрывает соответствующие блоки полей формы при выборе способа доставки
var toggleDeliveryMethod = function (evt) {
  if (evt.target.name === 'method-deliver') {
    var delveryElements = document.querySelector('.deliver').children;
    for (var i = 0; i < delveryElements.length; i++) {
      if (delveryElements[i].classList.contains(evt.target.id) && delveryElements[i].tagName === 'DIV') {
        delveryElements[i].classList.remove('visually-hidden');
      } else if (!delveryElements[i].classList.contains(evt.target.id) && delveryElements[i].tagName === 'DIV') {
        delveryElements[i].classList.add('visually-hidden');
      }
    }
  }
};

// Добавляет на блок выбора способа доставки обработчик, регистрирующий клик по кнопке со способом доставки
var addDeliveryMethodToggleClickHandler = function () {
  deliveryMethodsToggleElement.addEventListener('click', toggleDeliveryMethod);
};

// Добавляет на ползунки фильтра цены обработчики события отпускания кнопки мыши
var addRangeBtnHandlers = function () {
  for (var i = 0; i < rangeBtnElements.length; i++) {
    rangeBtnElements[i].addEventListener('mouseup', changePriceRange);
  }
};

// Изменяет значение цены при перемещении ползунка фильтра по цене
var changePriceRange = function (evt) {
  var positionX = evt.target.offsetLeft;
  var priceValue = (positionX * maxPrice) / rangeWidth;
  checkRangeBtnPosition(evt.target);
  evt.target.style.left = positionX + 'px';
  rangeLineFillElement.style.left = rangeLeftBtnElement.style.left;
  rangeLineFillElement.style.right = (rangeWidth - parseInt(rangeRightBtnElement.style.left, 10)) + 'px';

  if (evt.target === rangeLeftBtnElement) {
    rangeMinPriceElement.textContent = parseInt(priceValue, 10);
  } else {
    rangeMaxPriceElement.textContent = parseInt(priceValue, 10);
  }
};

// Ограничивает область перетскивания ползунков фильтра по цене
var checkRangeBtnPosition = function (btn) {
  if (btn.offsetLeft < minPrice) {
    btn.style.left = minPrice + 'px';
  } else if (btn.offsetLeft > rangeWidth) {
    btn.style.right = rangeWidth + 'px';
  } else if (btn === rangeLeftBtnElement) {
    if (btn.offsetLeft > rangeRightBtnElement.offsetLeft) {
      btn.style.left = rangeRightBtnElement.offsetLeft + 'px';
    }
  } else if (btn === rangeRightBtnElement) {
    if (btn.offsetLeft < rangeLeftBtnElement.offsetLeft) {
      btn.style.right = rangeLeftBtnElement.offsetLeft + 'px';
    }
  }
};

// Удаляет карточки товров
var deleteProductCards = function () {
  var catalogCards = catalogListElement.querySelectorAll('.catalog__card');
  for (var i = 0; i < catalogCards.length; i++) {
    catalogListElement.removeChild(catalogCards[i]);
  }
};

// Переключает страницу в исходное состояние: карточки товаров не отрисованы, корзина пуста, форма неактивна
var setPageDefault = function () {
  deleteProductCards();
  showCardsLoadingMsg(true);
  showEmptyCartMsg(true);
  orderFormFieldsDisable(true);
};

// Переключает страницу в активное состояние (карточки загрузились)
var setPageActive = function () {
  showCardsLoadingMsg(false);
  renderProductCards(productsArray);
  addFavoriteBtnsClickHandler();
  addInCartBtnsClickHandler();
  addPaymentMethodToggleClickHandler();
  addDeliveryMethodToggleClickHandler();
  addRangeBtnHandlers();
};

setPageDefault();
var productsArray = createProductsArr(GOODS_NAMES, GOODS_IDS, GOODS_INGREDIENTS, goodsCount);
setPageActive();

// Массив товаров в корзине
var productsInCartArray = [];
