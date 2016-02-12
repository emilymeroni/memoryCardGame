/* global $, memoryCardGame */

memoryCardGame.GameManager = function (params) {

    'use strict';

    var CONST = {
        CSS: {
            ROOT: 'memory-card-game',
            BOARD_CLASS: 'memory-board'
        },
        CARD_COPIES: 2,
        TIME_FOR_FLIP: 500
    };

    var config = {
        cardsClass: CONST.CSS.CARDS_CLASS,
        gameClass: CONST.CSS.ROOT,
        singleCardClass: CONST.CSS.SINGLE_CARD_CLASS
    };

    // Merge incoming params with internal config
    $.extend(config, params);

    var flippedOverCards = [];

    var deck;

    var stats;

    var timer = 0;

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
            gameManager: self,
            cardsClass: config.cardsClass,
            singleCardClass: config.singleCardClass
        });

        self.container.append(deck.container);

        $('body').append(self.container);
        startTimer();
    };

    var setDiscoveredCards = function (flippedOverCards) {
        for (var i = 1; i <= CONST.CARD_COPIES; i++) {
            flippedOverCards[flippedOverCards.length - i].setDiscovered();
        }
    };

    var coverCards = function (flippedOverCards) {
        setTimeout(function () {
            for (var i = 0; i < CONST.CARD_COPIES; i++) {
                var lastElement = flippedOverCards.length - 1;
                lastElement.getCardNodeAndFlip();
                flippedOverCards.splice(lastElement, 1);
            }
        }, CONST.TIME_FOR_FLIP);
    };

    //TODO: Cleanup timer
    var endGame = function () {
        stats.saveStats();
    };

    //TODO: Change interval milliseconds to constant
    var startTimer = function () {
        setInterval(function () {
            timer++;
        }, 1000);
    };

    var getPreviousCardFromDeck = function () {
        return flippedOverCards[flippedOverCards.length - 2];
    };

    var isGameEnded = function () {
        return flippedOverCards.length === deck.getCardsNumber();
    };

    this.onCardSelected = function (card) {
        flippedOverCards.push(card);
        if (flippedOverCards.length % CONST.CARD_COPIES === 1) {
            return;
        }
        if (getPreviousCardFromDeck().getImage() === card.getImage()) {
            if (flippedOverCards.length % CONST.CARD_COPIES === 0) {
                setDiscoveredCards(flippedOverCards);
                stats.updateAttemptsCounter();
                if (isGameEnded() === true) {
                    endGame();
                }
            }
        }
        else {
            coverCards(flippedOverCards);
            stats.updateAttemptsCounter();
        }
    };

    init.call(this);
};