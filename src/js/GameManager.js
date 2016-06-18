/**
 * Game Manager widget
 * The GameManager widget allows the user to create and start a new Memory card game.
 *
 * @param {jQuery} params.rootNode  The root node of the widget
 * @constructor
 *
 * @listens chosenOptions
 * @listens handFinished
 * @listens handInvalid
 * @listens cardsAllFlipped
 */
memoryCardGame.GameManager = function (params) {

    'use strict';

    var CONST = {
        CSS: {
            ROOT: 'memory-card-game',
            GAME_CONTAINER: 'game-container',
            BOARD_CLASS: 'memory-board',
            TIMER_CLASS: 'timer'
        },
        DATA: {
            URL: 'dist/themes.json'
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

    /**
     * @type {json}
     */
    var cardThemesData;

    /**
     * @type {memoryCardGame.Deck}
     */
    var deck;

    /**
     * @type {memoryCardGame.Stats}
     */
    var stats;

    /**
     * @type {number}
     */
    var timer = 0;

    /**
     * @type {number}
     */
    var timerInterval;

    /**
     * @type {jQuery}
     */
    var gameContainer = $('<div></div>').addClass(CONST.CSS.GAME_CONTAINER);

    /**
     * @type {jQuery}
     */
    this.container = $('<div></div>').addClass(CONST.CSS.ROOT);

    /**
     * @type {memoryCardGame.GameManager}
     */
    var self = this;

    var init = function () {
        cardThemesData = getCardThemesData();
        var cardThemesList = getCardThemesList();

        var userOptions = new memoryCardGame.UserOptions(cardThemesList);
        userOptions.addObserver(self);
        self.container.append(userOptions.container);
        config.rootNode.append(self.container);
    };

    /**
     * Gets all the available card themes with their respective cards
     */
    var getCardThemesData = function () {
        $.ajax({
            type: 'POST',
            url: CONST.DATA.URL,
            async: true,
            success: function(cardThemesJson) {
                return cardThemesJson;
            },
            error: function() {
                console.log('could not load data');
            }
        });
    };

    var getCardThemesList = function () {
        var cardThemesList = [];
        $.each(cardThemesData, function (key, val) {
            cardThemesList.push(val);
        });
        return cardThemesList;
    };

    /**
     * Initialises all the needed objects to play a game and displays them
     * on the page with the selected theme.
     *
     * @param {String} selectedTheme
     */
    var startGame = function (selectedTheme) {
        stats = new memoryCardGame.Stats();
        gameContainer.append(stats.container);

        deck = new memoryCardGame.Deck({
            cardList: cardThemesData[selectedTheme]
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

    /**
     * Listens to the "chosenOptions" event notifications broadcast by the UserOptions
     */
    this.onChosenOptionsHandler = function (data) {
        startGame(data.selectedTheme);
    };

    /**
     * Listens to the "handFinished" event notification broadcast by the Deck
     */
    this.onHandFinishedHandler = function () {
        stats.updateAttemptsCounter();
    };

    /**
     * Listens to the "handInvalid" event notification broadcast by the Deck
     */
    this.onHandInvalidHandler = function () {
        stats.updateAttemptsCounter();
    };


    /**
     * Listens to the "cardsAllFlipped" event notification broadcast by the Deck
     */
    this.onCardsAllFlippedHandler = function () {
        endGame();
    };

    init.call(this);
};