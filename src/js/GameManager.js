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
        rootNode: $('body')
    };

    // Merge incoming params with internal config
    $.extend(config, params);

    var deck;

    var stats;

    var timer = 0;

    var timerInterval;

    this.container = $('<div></div>').addClass(CONST.CSS.ROOT);

    var self = this;

    var init = function () {
        var userOptions = new memoryCardGame.UserOptions(config.rootNode);
        userOptions.addObserver(self);
    };

    var startGame = function (selectedTheme) {
        stats = new memoryCardGame.Stats();
        self.container.append(stats.container);

        deck = new memoryCardGame.Deck({
            cardsClass: config.cardsClass,
            singleCardClass: config.singleCardClass,
            selectedTheme: selectedTheme
        });
        deck.addObserver(self);
        self.container.append(deck.container);

        startTimer();

        config.rootNode.append(self.container);
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

    this.onChosenOptionsHandler = function (data) {
        startGame(data.selectedTheme);
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