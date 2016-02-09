/* global $, memoryCardGame */

window.memoryCardGame.utils = {};

(function () {
    'use strict';

    memoryCardGame.utils.persistInLocalStorage = function (dataToPersist) {
        localStorage.setItem('memoryCardGame', JSON.stringify(dataToPersist));
    };

    memoryCardGame.utils.retrieveFromLocalStorage = function () {
        return JSON.parse(localStorage.getItem('memoryCardGame'));
    };
})();
