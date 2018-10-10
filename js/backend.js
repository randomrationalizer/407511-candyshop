// Модуль для работы с сервером

'use strict';

(function () {
  var DOWNLOAD_URL = 'https://js.dump.academy/candyshop/data';
  var UPLOAD_URL = 'https://js.dump.academy/candyshop';
  var SUCCESS_CODE = 200;
  var REQUEST_TIMEOUT = 10000;

  window.backend = {
    // Загружает данные с сервера
    download: function (onSuccess, onError) {
      var xhr = new XMLHttpRequest();
      xhr.responseType = 'json';

      xhr.addEventListener('load', function () {
        if (xhr.status === SUCCESS_CODE) {
          onSuccess(xhr.response);
        } else {
          onError('Статус ответа: ' + xhr.status + xhr.statusText);
        }
      });

      xhr.addEventListener('error', function () {
        onError('Ошибка соединения');
      });
      xhr.addEventListener('timeout', function () {
        onError('Зарос не успел выполниться за ' + xhr.timeout + ' мс');
      });
      xhr.timeout = REQUEST_TIMEOUT;

      xhr.open('GET', DOWNLOAD_URL);
      xhr.send();
    },

    // Отправляет данные на сервер
    upload: function (data, onSuccess, onError) {
      var xhr = new XMLHttpRequest();
      xhr.responseType = 'json';

      xhr.addEventListener('load', function () {
        if (xhr.status === SUCCESS_CODE) {
          onSuccess(xhr.response);
        } else {
          onError('Произошла ошибка. Статус ответа: ' + xhr.status + xhr.statusText);
        }
      });

      xhr.addEventListener('error', function () {
        onError('Ошибка соединения');
      });
      xhr.addEventListener('timeout', function () {
        onError('Зарос не успел выполниться за ' + xhr.timeout + ' мс');
      });
      xhr.timeout = REQUEST_TIMEOUT;

      xhr.open('POST', UPLOAD_URL);
      xhr.send(data);
    }
  };
})();
