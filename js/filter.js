// Модуль фильтрации товаров

'use strict';
(function () {
  var MIN_POS_X = 0;
  var MAX_POS_X = 245;

  // Текущая нижняя граница цены товара
  var currentMinPrice;

  // Текущая верхняя граница цены товара
  var currentMaxPrice;

  // Минимально возможная цена товара
  var minPrice;

  // Максимально возможная цена товара
  var maxPrice;

  var catalogFilters = document.querySelector('.catalog__sidebar');
  var filterTypeElements = [].map.call(catalogFilters.querySelectorAll('.input-btn__input[name="food-type"]'), function (it) {
    return it;
  });
  var filterPropertyElements = [].map.call(catalogFilters.querySelectorAll('.input-btn__input[name="food-property"]'), function (it) {
    return it;
  });
  var filterEmptyMsgTemplate = document.querySelector('#empty-filters').content.querySelector('.catalog__empty-filter');
  var catalogListElement = document.querySelector('.catalog__cards');
  var filterSortElements = [].map.call(catalogFilters.querySelectorAll('.input-btn__input--radio[name="sort"]'), function (it) {
    return it;
  });
  var filterSortPopularBtnElement = catalogFilters.querySelector('#filter-popular');
  var filterFavoriteElement = catalogFilters.querySelector('#filter-favorite');
  var filterAvailabilityElement = catalogFilters.querySelector('#filter-availability');
  var rangeFilterElement = document.querySelector('.range__filter');
  var rangeBtnElements = rangeFilterElement.querySelectorAll('.range__btn');
  var rangePricesElement = document.querySelector('.range__prices');
  var rangeMinPriceElement = rangePricesElement.querySelector('.range__price--min');
  var rangeMaxPriceElement = rangePricesElement.querySelector('.range__price--max');
  var rangeLeftBtnElement = rangeFilterElement.querySelector('.range__btn--left');
  var rangeRightBtnElement = rangeFilterElement.querySelector('.range__btn--right');
  var rangeLineFillElement = rangeFilterElement.querySelector('.range__fill-line');
  var rangeWidth = rangeFilterElement.offsetWidth;
  var filterShowAllBtnElement = catalogFilters.querySelector('.catalog__submit');

  var typeIdToProductKind = {
    'filter-icecream': 'Мороженое',
    'filter-soda': 'Газировка',
    'filter-gum': 'Жевательная резинка',
    'filter-marmalade': 'Мармелад',
    'filter-marshmallows': 'Зефир'
  };

  var propertiesToNutritionFacts = {
    'sugar': false,
    'vegetarian': true,
    'gluten': false
  };

  var filterIdToPropertiesNames = {
    'filter-sugar-free': 'sugar',
    'filter-vegetarian': 'vegetarian',
    'filter-gluten-free': 'gluten'
  };

  // Отрисовывает карточки товаров в зависимости от выбранных условий фильтра
  var updateCards = window.util.debounce(function () {
    var cards = window.data.productsArray.slice();
    var filteredCards = cards.filter(function (it) {
      return setProductTypeFilter(it.kind, selectedProductTypes);
    }).
    filter(function (it) {
      return setPropertyFilter(it.nutritionFacts, selectedProductProperties);
    }).
    filter(function (it) {
      return setProductPriceFilter(it.price, currentMinPrice, currentMaxPrice);
    });
    window.catalog.deleteProductCards();

    if (filteredCards.length === 0) {
      showFilterEmptyMsg();
    } else {
      hideFilterEmptyMsg();
    }

    window.catalog.renderProductCards(sortProductsArr(filteredCards));
  });

  // Сортирует массив товаров в зависимости от выбранного способа сортировки
  var sortProductsArr = function (productsArr) {
    var radioBtnValue = catalogFilters.querySelector('.input-btn__input--radio[name="sort"]:checked').value;
    var sortedArr;

    switch (radioBtnValue) {
      case 'popular':
        sortedArr = productsArr;
        break;
      case 'expensive':
        sortedArr = productsArr.sort(sortByPriceDecrease);
        break;
      case 'cheep':
        sortedArr = productsArr.sort(sortByPriceIncrease);
        break;
      case 'rating':
        sortedArr = productsArr.sort(sortByRatingDecrease);
        break;
    }

    return sortedArr;
  };

  // Сортирует товары по возрастанию цены
  var sortByPriceIncrease = function (first, second) {
    if (first.price > second.price) {
      return 1;
    } else if (first.price > second.price) {
      return -1;
    } else {
      return 0;
    }
  };

  // Сортирует товары по убыванию цены
  var sortByPriceDecrease = function (first, second) {
    if (first.price > second.price) {
      return -1;
    } else if (first.price < second.price) {
      return 1;
    } else {
      return 0;
    }
  };

  // Сортирует товары по убыванию рейтинга
  var sortByRatingDecrease = function (first, second) {
    if (first.rating.value > second.rating.value) {
      return -1;
    } else if (first.rating.value < second.rating.value) {
      return 1;
    } else {
      if (first.rating.number > second.rating.number) {
        return -1;
      } else if (first.rating.number < second.rating.number) {
        return 1;
      } else {
        return 0;
      }
    }
  };

  // Добавляет обработчики событий на радиокнопки способов сортировки
  filterSortElements.forEach(function (radiobutton) {
    radiobutton.addEventListener('change', updateCards);
  });

  // Сбрасывает все "нестрогие" фильтры
  var resetNotStrictFilters = function () {
    filterTypeElements.forEach(function (checkbox) {
      checkbox.checked = false;
    });
    selectedProductTypes.length = 0;
    filterPropertyElements.forEach(function (checkbox) {
      checkbox.checked = false;
    });
    selectedProductProperties.length = 0;
    filterSortPopularBtnElement.checked = true;
    window.filter.setPriceFilterDefault();
  };

  // Сбрасывает строгие фильтры "Только избранное" и "В наличии"
  var resetStrictFilters = function () {
    filterFavoriteElement.checked = false;
    filterAvailabilityElement.checked = false;
    catalogListElement.removeEventListener('click', removeProductFromFavoriteFilter);
  };

  // Сбрасывает все фильтры при клике по кнопке "Показать всё" и отрисовывает все карточки товаров
  var showAllCards = function () {
    resetNotStrictFilters();
    resetStrictFilters();
    hideFilterEmptyMsg();
    window.catalog.deleteProductCards();
    window.catalog.renderProductCards(window.data.productsArray);
    // updateCards();
  };

  // Добавляет обработчик события клик на кнопку "Показать всё"
  filterShowAllBtnElement.addEventListener('click', showAllCards);

  // Отображает сообщение о том, что ни один товар не подходит под выбранные фильтры
  var showFilterEmptyMsg = function () {
    var emptyFilterMsg = catalogListElement.querySelector('.catalog__empty-filter');
    if (emptyFilterMsg === null) {
      var msgElement = filterEmptyMsgTemplate.cloneNode(true);
      catalogListElement.appendChild(msgElement);
    } else {
      emptyFilterMsg.classList.remove('visually-hidden');
    }
  };

  // Скрывает сообщение о том, что ни один товар не подходит под выбранные фильтры
  var hideFilterEmptyMsg = function () {
    var emptyFilterMsg = catalogListElement.querySelector('.catalog__empty-filter');
    if (emptyFilterMsg !== null) {
      emptyFilterMsg.classList.add('visually-hidden');
    }
  };

  // Выбранные типы товаров записываются в массив
  var selectedProductTypes = [];

  // Записывает выбранные значения типа товара в массив и обновляет карточки
  var onProductTypeChange = function (evt) {
    var target = evt.target;
    var selectedType = typeIdToProductKind[target.id];
    if (target.checked === true) {
      resetStrictFilters();
      selectedProductTypes.push(selectedType);
    } else {
      var selectedTypeypeIndex = selectedProductTypes.indexOf(selectedType);
      selectedProductTypes.splice(selectedTypeypeIndex, 1);
    }
    updateCards();
  };

  // Условие фильтрации товаров по типу
  var setProductTypeFilter = function (productKind, typesArr) {
    if (typesArr.length === 0) {
      return true;
    } else {
      var typeIndex = typesArr.indexOf(productKind);
      if (typeIndex < 0) {
        return false;
      } else {
        return true;
      }
    }
  };

  // Выбранные ингредиенты состава товаров записываются в массив
  var selectedProductProperties = [];

  // Записывает выбранные свойства состава товара в массив и обновляет карточки
  var onPropertyChange = function (evt) {
    var target = evt.target;
    var selectedPropertyName = filterIdToPropertiesNames[target.id];
    if (target.checked === true) {
      resetStrictFilters();
      selectedProductProperties.push(selectedPropertyName);
    } else {
      var propertyIndex = selectedProductProperties.indexOf(selectedPropertyName);
      selectedProductProperties.splice(propertyIndex, 1);
    }
    updateCards();
  };

  // Условие фильтрации товаров по составу
  var setPropertyFilter = function (productProperty, propertiesArr) {
    var result;
    if (propertiesArr.length === 0) {
      result = true;
    } else {
      result = propertiesArr.every(function (selectedProperty) {
        return productProperty[selectedProperty] === propertiesToNutritionFacts[selectedProperty];
      });
    }
    return result;
  };

  // Добавляет обработчики событий на чекбоксы блока типа товара
  filterTypeElements.forEach(function (elem) {
    elem.addEventListener('change', onProductTypeChange);
  });

  // Добавляет обработчики событий на чекбоксы блока состава товаров
  filterPropertyElements.forEach(function (elem) {
    elem.addEventListener('change', onPropertyChange);
  });

  // Механизм перетаскивания ползунков фильтра по цене
  var addRangeBtnHandlers = function () {
    for (var i = 0; i < rangeBtnElements.length; i++) {
      rangeBtnElements[i].addEventListener('mousedown', function (evt) {
        evt.preventDefault();
        evt.target.focus();
        resetStrictFilters();

        var startCoords = {
          x: evt.clientX,
          y: evt.target.offsetTop
        };

        var onMouseMove = function (moveEvt) {
          moveEvt.preventDefault();
          var shift = {
            x: startCoords.x - moveEvt.clientX,
            y: 0
          };

          startCoords = {
            x: moveEvt.clientX,
            y: evt.target.offsetTop
          };

          evt.target.style.left = (evt.target.offsetLeft - shift.x) + 'px';
          evt.target.style.top = evt.target.offsetTop + 'px';
          limitRangeBtnMovement(evt.target);
          setPriceValue(evt.target);
          changeRangeLineFill();
        };

        var onMouseUp = function (upEvt) {
          upEvt.preventDefault();
          setPriceValue(evt.target);
          document.removeEventListener('mousemove', onMouseMove);
          document.removeEventListener('mouseup', onMouseUp);
          updateCards();
        };

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
      });
    }
  };

  // Ограничивает область перетаскивания ползунков фильтра по цене
  var limitRangeBtnMovement = function (btn) {
    if (btn.offsetLeft < MIN_POS_X) {
      btn.style.left = MIN_POS_X + 'px';
    } else if (btn.offsetLeft > MAX_POS_X) {
      btn.style.left = MAX_POS_X + 'px';
    } else if (btn === rangeLeftBtnElement && btn.offsetLeft > rangeRightBtnElement.offsetLeft) {
      btn.style.left = rangeRightBtnElement.offsetLeft + 'px';
    } else if (btn === rangeRightBtnElement && btn.offsetLeft < rangeLeftBtnElement.offsetLeft) {
      btn.style.left = rangeLeftBtnElement.offsetLeft + 'px';
    }
  };

  // Задает значение полей наибольшей и наименьшей цены при перемещении ползунка фильтра по цене
  var setPriceValue = function (btn) {
    var positionX = btn.offsetLeft;
    var priceValue = parseInt(((positionX * maxPrice) / rangeWidth), 10);

    if (btn === rangeLeftBtnElement) {
      rangeMinPriceElement.textContent = priceValue;
      currentMinPrice = priceValue;
    } else if (btn === rangeRightBtnElement) {
      rangeMaxPriceElement.textContent = priceValue;
      currentMaxPrice = priceValue;
    }
  };

  // Задает размеры полосы заливки между ползунками фильтра по цене
  var changeRangeLineFill = function () {
    rangeLineFillElement.style.left = rangeLeftBtnElement.style.left;
    rangeLineFillElement.style.right = (rangeWidth - parseInt(rangeRightBtnElement.style.left, 10)) + 'px';
  };

  // Условие фильтрации товаров по цене
  var setProductPriceFilter = function (productPrice, min, max) {
    if (productPrice >= min && productPrice <= max) {
      return true;
    } else {
      return false;
    }
  };

  // Добавляет обработчики на ползунки слайдера фильтра цены
  addRangeBtnHandlers();

  // Отрисовывает карточки товаров, добавленных в "Избранное"
  var showFavoriteProducts = function (evt) {
    if (evt.target.checked === true) {
      window.catalog.deleteProductCards();
      resetNotStrictFilters();
      filterAvailabilityElement.checked = false;
      if (window.data.favoriteProductsArray.length === 0) {
        showFilterEmptyMsg();
      } else {
        hideFilterEmptyMsg();
      }
      window.catalog.renderProductCards(window.data.favoriteProductsArray);
      catalogListElement.addEventListener('click', removeProductFromFavoriteFilter);
    } else {
      updateCards();
      catalogListElement.removeEventListener('click', removeProductFromFavoriteFilter);
    }
  };

  // Убирает карточку товара из результатов фильтра "Только избранные" при клике по кнопке "Добавить в избранное"
  var removeProductFromFavoriteFilter = function (evt) {
    if (evt.target.classList.contains('card__btn-favorite')) {
      var card = evt.target.closest('.catalog__card');
      catalogListElement.removeChild(card);
      var catalogCards = catalogListElement.querySelectorAll('.catalog__card');
      if (catalogCards.length === 0) {
        showFilterEmptyMsg();
      }
    }
  };

  // Добавляет обработчик на чекбокс фильтра "Только избранные"
  filterFavoriteElement.addEventListener('change', showFavoriteProducts);

  // Условие фильтрации товаров по наличию
  var filterByAvalaibility = function (arr) {
    var products = arr.slice();
    var filteredProducts = products.filter(function (it) {
      return it.amount > 0;
    });
    return filteredProducts;
  };

  // Отрисовывает карточки товров, количество которых больше 0
  var showAvailableProducts = function (evt) {
    if (evt.target.checked === true) {
      window.catalog.deleteProductCards();
      resetNotStrictFilters();
      hideFilterEmptyMsg();
      filterFavoriteElement.checked = false;
      var availableProducts = filterByAvalaibility(window.data.productsArray);
      window.catalog.renderProductCards(availableProducts);
    } else {
      updateCards();
    }
  };

  // Добавляет обработчик на чекбокс фильтра "В наличии"
  filterAvailabilityElement.addEventListener('change', showAvailableProducts);

  // Выводит количество товаров, подходящих под фильтр в блок .input-btn__item-count
  var calculateFilteredItemsCount = function (filterElements, callback) {
    filterElements.forEach(function (element) {
      var counter = element.parentElement.querySelector('.input-btn__item-count');
      var products = window.data.productsArray.slice();
      var filteredItems = products.filter(function (it) {
        return callback(it, element);
      });
      var itemsCount = filteredItems.length;
      counter.textContent = '(' + itemsCount + ')';
    });
  };

  // Условие фильтрации товаров по типу для подсчета количества
  var filterByType = function (product, filterElem) {
    return product.kind === typeIdToProductKind[filterElem.id];
  };

  // Условие фильтрации товаров по составу для подсчета количества
  var filterByIngredients = function (product, filterElem) {
    var propertyName = filterIdToPropertiesNames[filterElem.id];
    return product.nutritionFacts[propertyName] === propertiesToNutritionFacts[propertyName];
  };

  // Выводит количество товаров в наличии
  var calculateAvailableItemsCount = function () {
    var counter = filterAvailabilityElement.parentElement.querySelector('.input-btn__item-count');
    var filteredItems = filterByAvalaibility(window.data.productsArray);
    counter.textContent = '(' + filteredItems.length + ')';
  };

  window.filter = {
    // Переключает фильтр цены в стартовое состояние
    setPriceFilterDefault: function () {
      minPrice = window.data.findMinPrice(window.data.productsArray);
      maxPrice = window.data.findMaxPrice(window.data.productsArray);
      rangeLeftBtnElement.style.left = parseInt(((minPrice * rangeWidth) / maxPrice), 10) + 'px';
      rangeRightBtnElement.style.left = MAX_POS_X + 'px';
      changeRangeLineFill();
      setPriceValue(rangeLeftBtnElement);
      setPriceValue(rangeRightBtnElement);
    },

    // Выводит количество товаров, добавленных в "Избранное", в блок .input-btn__item-count фильтра "Только избранное"
    calculateFavoriteItemsCount: function () {
      var counter = filterFavoriteElement.parentElement.querySelector('.input-btn__item-count');
      counter.textContent = '(' + window.data.favoriteProductsArray.length + ')';
    },

    // Отображает количество товаров, подходящих под фильтры
    showFilteredItemsCount: function () {
      calculateFilteredItemsCount(filterTypeElements, filterByType);
      calculateFilteredItemsCount(filterPropertyElements, filterByIngredients);
      window.filter.calculateFavoriteItemsCount();
      calculateAvailableItemsCount();
    }
  };
})();
