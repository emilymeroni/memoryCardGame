memoryCardGame.GameManager = function (params) {

    'use strict';

    var CONST = {
        CSS: {
            ROOT: 'memory-card-game',
            BOARD_CLASS: 'memory-board',
            TIMER_CLASS: 'timer'
        },
        SELECTOR: {
            CONTAINER: 'body',
            TIMER_SELECTOR: '.timer'
        },
        TIMER: 1000
    };

    var config = {
        gameContainer: CONST.SELECTOR.CONTAINER
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

    this.container = $('<div></div>').addClass(CONST.CSS.ROOT);

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

        startTimer();

        $(config.gameContainer).append(self.container);
    };

    var endGame = function () {
        stats.saveStats();
        clearInterval(timerInterval);
    };

    var startTimer = function () {
        var timerContainer = $('<div></div>').addClass(CONST.CSS.TIMER_CLASS);
        self.container.append(timerContainer.text(timer));
        timerInterval = setInterval(function () {
            timerContainer.text(++timer);
        }, CONST.TIMER);
    };

    this.onHandFinishedHandler = function () {
        stats.updateAttemptsCounter();
    };

    this.onHandInvalidHandler = function () {
        stats.updateAttemptsCounter();
    };

    this.onCardsAllFlippedHandler = function () {
        endGame();
    };

    init.call(this);
};