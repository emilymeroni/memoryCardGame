/* global $, memoryCardGame */

window.memoryCardGame.utils = {};

(function () {
    'use strict';

    memoryCardGame.utils.persistInLocalStorage = function (data) {
        localStorage.setItem('memoryCardGame', JSON.stringify(data));
    };

    memoryCardGame.utils.addDataInLocalStorage = function (data) {
        var persistedData = memoryCardGame.utils.retrieveFromLocalStorage();
        if (persistedData !== null) {
            $.extend( persistedData, data );
        }
        memoryCardGame.utils.persistInLocalStorage(persistedData);
    };

        memoryCardGame.utils.retrieveFromLocalStorage = function () {
        return JSON.parse(localStorage.getItem('memoryCardGame'));
    };
})();
