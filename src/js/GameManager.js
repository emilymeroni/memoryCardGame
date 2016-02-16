/* global $, memoryCardGame */

memoryCardGame.GameManager = function (params) {

    'use strict';

    var CONST = {
        CSS: {
            ROOT: 'memory-card-game',
            BOARD_CLASS: 'memory-board',
            TIMER_CLASS: 'timer'
        },
        SELECTOR: {
          TIMER_SELECTOR: '.timer'
        },
        TIMER: 1000
    };

    var config = {
        cardsClass: CONST.CSS.CARDS_CLASS,
        gameClass: CONST.CSS.ROOT,
        singleCardClass: CONST.CSS.SINGLE_CARD_CLASS
    };

    // Merge incoming params with internal config
    $.extend(config, params);

    var deck;

    var stats;

    var timer = 0;

    var timerInterval;

    var persistentData = {
        bestScoreCounter: null
    };

    this.container = $('<div></div>').addClass(config.gameClass);

    var self = this;

    var init = function () {
        var memoryLocalStorage = memoryCardGame.utils.retrieveFromLocalStorage();
        if (memoryLocalStorage !== null) {
            persistentData = memoryLocalStorage;
        }

        stats = new memoryCardGame.Stats({
            bestScoreCounter: persistentData.bestScoreCounter
        });
        self.container.append(stats.container);

        deck = new memoryCardGame.Deck({
            cardsClass: config.cardsClass,
            singleCardClass: config.singleCardClass
        });

        deck.addObserver(self);
        self.container.append(deck.container);

        self.container.append($('<div></div>').addClass(CONST.CSS.TIMER_CLASS));

        $('body').append(self.container);
        startTimer();
    };

    var endGame = function () {
        stats.saveStats();
        clearInterval(timerInterval);
    };

    var startTimer = function () {
        timerInterval = setInterval(function () {
            $(CONST.SELECTOR.TIMER_SELECTOR).text(timer++);
        }, CONST.TIMER);
    };

    this.onHandFinishedHandler = function() {
        stats.updateAttemptsCounter();
    };

    this.onHandInvalidHandler = function() {
        stats.updateAttemptsCounter();
    };

    this.onCardsAllFlippedHandler = function() {
        endGame();
    };

    init.call(this);
};