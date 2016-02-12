/* global $, memoryCardGame */

memoryCardGame.GameManager = function (params) {

    'use strict';

    var CONST = {
        CSS: {
            ROOT: 'memory-card-game',
            BOARD_CLASS: 'memory-board'
        }
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

    var isGameEnded = function () {
        return deck.isAllCardsFlipped();
    };

    this.onCardSelected = function (card) {
        deck.addFlippedCard(card);
        if (deck.isNewHandStarted()) {
            return;
        }
        if (deck.getPreviousFlippedCard().getImage() === card.getImage()) {
            if (deck.isHandFinished()) {
                deck.setDiscoveredCards();
                stats.updateAttemptsCounter();
                if (isGameEnded() === true) {
                    endGame();
                }
            }
        }
        else {
            deck.coverLatestHandFlippedCards();
            stats.updateAttemptsCounter();
        }
    };

    init.call(this);
};