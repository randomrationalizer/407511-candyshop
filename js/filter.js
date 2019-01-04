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

  var sidebarElement = document.querySelector('.catalog__sidebar');
  var filterTypeElements = [].slice.call(sidebarElement.querySelectorAll('.input-btn__input[name="food-type"]'));
  var filterPropertyElements = [].slice.call(sidebarElement.querySelectorAll('.input-btn__input[name="food-property"]'));
  var filterEmptyMsgTemplateElement = document.querySelector('#empty-filters').content.querySelector('.catalog__empty-filter');
  var catalogListElement = document.querySelector('.catalog__cards');
  var filterSortElements = [].slice.call(sidebarElement.querySelectorAll('.input-btn__input--radio[name="sort"]'));
  var filterSortPopularBtnElement = sidebarElement.querySelector('#filter-popular');
  var filterFavoriteElement = sidebarElement.querySelector('#filter-favorite');
  var filterAvailabilityElement = sidebarElement.querySelector('#filter-availability');
  var rangeFilterElement = sidebarElement.querySelector('.range__filter');
  var rangeBtnElements = [].slice.call(rangeFilterElement.querySelectorAll('.range__btn'));
  var rangePricesElement = sidebarElement.querySelector('.range__prices');
  var rangeMinPriceElement = rangePricesElement.querySelector('.range__price--min');
  var rangeMaxPriceElement = rangePricesElement.querySelector('.range__price--max');
  var rangeLeftBtnElement = rangeFilterElement.querySelector('.range__btn--left');
  var rangeRightBtnElement = rangeFilterElement.querySelector('.range__btn--right');
  var rangeLineFillElement = rangeFilterElement.querySelector('.range__fill-line');
  var filterShowAllBtnElement = sidebarElement.querySelector('.catalog__submit');
  var rangeWidth = rangeFilterElement.offsetWidth;

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
    var cards = window.data.products.slice();
    var filteredCards = cards.filter(function (it) {
      return setProductTypeFilter(it.kind, selectedProductTypes) &&
        setPropertyFilter(it.nutritionFacts, selectedProductProperties) &&
        setProductPriceFilter(it.price, currentMinPrice, currentMaxPrice);
    });
    window.catalog.deleteCards();

    if (filteredCards.length === 0) {
      showFilterEmptyMsg();
    } else {
      hideFilterEmptyMsg();
    }

    window.catalog.renderCards(sortProducts(filteredCards));
  });

  // Сортирует массив товаров в зависимости от выбранного способа сортировки
  var sortProducts = function (products) {
    var radioBtnValue = sidebarElement.querySelector('.input-btn__input--radio[name="sort"]:checked').value;
    var sortedProducts;

    switch (radioBtnValue) {
      case 'popular':
        sortedProducts = products;
        break;
      case 'expensive':
        sortedProducts = products.sort(sortByPriceDecrease);
        break;
      case 'cheep':
        sortedProducts = products.sort(sortByPriceIncrease);
        break;
      case 'rating':
        sortedProducts = products.sort(sortByRatingDecrease);
        break;
    }

    return sortedProducts;
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
    window.filter.setPriceRangeDefault();
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
    window.catalog.deleteCards();
    window.catalog.renderCards(window.data.products);
  };

  // Добавляет обработчик события клик на кнопку "Показать всё"
  filterShowAllBtnElement.addEventListener('click', showAllCards);

  // Отображает сообщение о том, что ни один товар не подходит под выбранные фильтры
  var showFilterEmptyMsg = function () {
    var emptyFilterMsgElement = catalogListElement.querySelector('.catalog__empty-filter');
    if (emptyFilterMsgElement === null) {
      var msgElement = filterEmptyMsgTemplateElement.cloneNode(true);
      catalogListElement.appendChild(msgElement);
    } else {
      emptyFilterMsgElement.classList.remove('visually-hidden');
    }
  };

  // Скрывает сообщение о том, что ни один товар не подходит под выбранные фильтры
  var hideFilterEmptyMsg = function () {
    var emptyFilterMsgElement = catalogListElement.querySelector('.catalog__empty-filter');
    if (emptyFilterMsgElement !== null) {
      emptyFilterMsgElement.classList.add('visually-hidden');
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
  var setProductTypeFilter = function (productKind, types) {
    if (types.length === 0) {
      return true;
    } else {
      var typeIndex = types.indexOf(productKind);
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
  var setPropertyFilter = function (productProperty, properties) {
    var result;
    if (properties.length === 0) {
      result = true;
    } else {
      result = properties.every(function (selectedProperty) {
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

  // Добавляет обработчики перетаскивания на ползунки слайдера фильтра цены
  rangeBtnElements.forEach(function (rangeBtn) {
    rangeBtn.addEventListener('mousedown', function (evt) {
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
  });

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

  // Находит минимальное значение цены среди товаров
  var findMinPrice = function (products) {
    var minimum = products[0].price;
    products.forEach(function (product) {
      if (product.price < minimum) {
        minimum = product.price;
      }
    });
    minPrice = minimum;
  };

  // Находит максимальное значение цены среди товаров
  var findMaxPrice = function (products) {
    var maximum = 0;
    products.forEach(function (product) {
      if (product.price > maximum) {
        maximum = product.price;
      }
    });
    maxPrice = maximum;
  };

  // Задает значение полей наибольшей и наименьшей цены при перемещении ползунка фильтра по цене
  var setPriceValue = function (btn) {
    var positionX = btn.offsetLeft;
    var priceValue = Math.round((positionX * maxPrice) / rangeWidth);

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

  // Отрисовывает карточки товаров, добавленных в "Избранное"
  var showFavoriteProducts = function (evt) {
    if (evt.target.checked === true) {
      window.catalog.deleteCards();
      resetNotStrictFilters();
      filterAvailabilityElement.checked = false;
      if (window.data.favorites.length === 0) {
        showFilterEmptyMsg();
      } else {
        hideFilterEmptyMsg();
      }
      window.catalog.renderCards(window.data.favorites);
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
  var filterByAvalaibility = function (products) {
    var filteredProducts = products.slice().filter(function (it) {
      return it.amount > 0;
    });
    return filteredProducts;
  };

  // Отрисовывает карточки товров, количество которых больше 0
  var showAvailableProducts = function (evt) {
    if (evt.target.checked === true) {
      window.catalog.deleteCards();
      resetNotStrictFilters();
      hideFilterEmptyMsg();
      filterFavoriteElement.checked = false;
      var availableProducts = filterByAvalaibility(window.data.products);
      window.catalog.renderCards(availableProducts);
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
      var products = window.data.products.slice();
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
    var filteredItems = filterByAvalaibility(window.data.products);
    counter.textContent = '(' + filteredItems.length + ')';
  };

  window.filter = {
    // Переключает фильтр цены в стартовое состояние
    setPriceRangeDefault: function () {
      findMinPrice(window.data.products);
      findMaxPrice(window.data.products);
      rangeLeftBtnElement.style.left = Math.round((minPrice * rangeWidth) / maxPrice) + 'px';
      rangeRightBtnElement.style.left = MAX_POS_X + 'px';
      changeRangeLineFill();
      setPriceValue(rangeLeftBtnElement);
      setPriceValue(rangeRightBtnElement);
    },

    // Выводит количество товаров, добавленных в "Избранное", в блок .input-btn__item-count фильтра "Только избранное"
    calculateFavoriteItemsCount: function () {
      var counter = filterFavoriteElement.parentElement.querySelector('.input-btn__item-count');
      counter.textContent = '(' + window.data.favorites.length + ')';
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
