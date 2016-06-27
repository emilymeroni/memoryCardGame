window.memoryCardGame.utils = {};

(function () {
    'use strict';

    /**
     * @param {array} data The information to be persisted
     */
    memoryCardGame.utils.persistInLocalStorage = function (data) {
        localStorage.setItem('memoryCardGame', JSON.stringify(data));
    };

    /**
     * @param {array} data The new information to be merged with the existing persisted data
     */
    memoryCardGame.utils.addDataInLocalStorage = function (data) {
        var persistedData = memoryCardGame.utils.retrieveFromLocalStorage();
        var mergedData = $.extend({}, persistedData, data);
        memoryCardGame.utils.persistInLocalStorage(mergedData);
    };

    memoryCardGame.utils.retrieveFromLocalStorage = function () {
        return JSON.parse(localStorage.getItem('memoryCardGame'));
    };

    /**
     * @param {string} key the identifier for the stored information
     */
    memoryCardGame.utils.getFromLocalStorage = function (key) {
        var persistedData = memoryCardGame.utils.retrieveFromLocalStorage();
        if(persistedData !== null) {
            return persistedData[key];
        }
    };
})();
