memoryCardGame.GameManager = function (params) {

    'use strict';

    var CONST = {
        CSS: {
            ROOT: 'memory-card-game',
            GAME_CONTAINER: 'game-container',
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

    var gameContainer = $('<div></div>').addClass(CONST.CSS.GAME_CONTAINER);

    this.container = $('<div></div>').addClass(CONST.CSS.ROOT);

    var self = this;

    var init = function () {
        var userOptions = new memoryCardGame.UserOptions();
        userOptions.addObserver(self);
        self.container.append(userOptions.container);
        config.rootNode.append(self.container);
    };

    var startGame = function (selectedTheme) {
        stats = new memoryCardGame.Stats();
        gameContainer.append(stats.container);

        deck = new memoryCardGame.Deck({
            cardsClass: config.cardsClass,
            singleCardClass: config.singleCardClass,
            selectedTheme: selectedTheme
        });
        deck.addObserver(self);
        gameContainer.append(deck.container);

        startTimer();

        self.container.empty().append(gameContainer);
        config.rootNode.append(self.container);
    };

    var endGame = function () {
        stats.saveStats();
        clearInterval(timerInterval);
    };

    var startTimer = function () {
        var timerContainer = $('<div></div>').addClass(CONST.CSS.TIMER_CLASS);
        gameContainer.append(timerContainer.text(timer));
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