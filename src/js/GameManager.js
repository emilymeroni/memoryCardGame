/* global $, memoryCardGame */

memoryCardGame.GameManager = function (params) {

    'use strict';

    var CONST = {
        CSS: {
            ROOT: 'memory-card-game',
            BOARD_CLASS: 'memory-board',
            CARDS_CLASS: 'memory-cards',
            SINGLE_CARD_CLASS: 'memory-card'
        },
        CARD_COPIES: 2,
        DEFAULT_IMAGES: [
            'Hydrangeas.jpg',
            'Jellyfish.jpg',
            'Koala.jpg',
            'Penguins.jpg',
            'Tulips.jpg'
        ],
        HTML: {
            CARD_LIST: '<ul></ul>'
        },
        IMAGE_BASE_URL: 'src\\images',
        TIME_FOR_FLIP: 500
    };

    var config = {
        cardsClass: CONST.CSS.CARDS_CLASS,
        gameClass: CONST.CSS.ROOT,
        singleCardClass: CONST.CSS.SINGLE_CARD_CLASS
    };

    // Merge incoming params with internal config
    $.extend(config, params);

    var cards = [];

    var discoveredSameCards = 0;

    var imageMap = [];

    var imagePosition = 0;

    var attemptsCounter = 0;

    var flippedOverCards = [];

    this.container = $('<div></div>').addClass(config.gameClass);

    var stats;

    var timer = 0;

    var persistentData = {
        bestScoreCounter: null
    };

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
        imageMap = imageMap.concat(CONST.DEFAULT_IMAGES);
        prepareCards();
        shuffleCards();
        draw();
        startTimer();
    };

    var changeImagePosition = function () {
        imagePosition++;
    };

    //TODO Base loop on imageMap size
    var createSameCards = function () {
        for (var i = 0; i < CONST.CARD_COPIES; i++) {
            var card = new memoryCardGame.Card({
                id: cards.length,
                image: getImage(),
                gameManager: self
            });
            cards.push(card);
        }
        changeImagePosition();
    };

    var setDiscoveredCards = function (flippedOverCards) {
        for (var i = 0; i < flippedOverCards.length; i++) {
            flippedOverCards[i].setDiscovered();
        }
        discoveredSameCards++;
    };

    var draw = function () {
        drawCards();
        $('body').append(self.container);
    };

    var drawCards = function () {
        var cardList = $(CONST.HTML.CARD_LIST).addClass(config.cardsClass);
        for (var i = 0; i < cards.length; i++) {
            var cardNode = cards[i].getNode();
            cardList.append(cardNode);
        }
        self.container.append(cardList);
    };

    var coverCards = function (flippedOverCards) {
        setTimeout(function () {
            for (var i = 0; i < flippedOverCards.length; i++) {
                flippedOverCards[i].getCardNodeAndFlip();
            }
        }, CONST.TIME_FOR_FLIP);
    };

    //TODO: Cleanup timer
    var endGame = function () {
        stats.saveStats();
    };

    var getImage = function () {
        return CONST.IMAGE_BASE_URL + '\\' + imageMap[imagePosition];
    };

    var prepareCards = function () {
        for (var i = 0; i < CONST.DEFAULT_IMAGES.length; i++) {
            createSameCards();
        }
    };

    var shuffleCards = function () {
        cards = cards.sort(function () {
            return 0.5 - Math.random();
        });
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
        return discoveredSameCards * CONST.CARD_COPIES === cards.length;
    };

    this.onCardSelected = function (card) {
        flippedOverCards.push(card);
        if (flippedOverCards.length <= 1) {
            return;
        }
        if (getPreviousCardFromDeck().getImage() === card.getImage()) {
            if (flippedOverCards.length === CONST.CARD_COPIES) {
                setDiscoveredCards(flippedOverCards);
                flippedOverCards = [];
                stats.updateAttemptsCounter();
                if (isGameEnded() === true) {
                    endGame();
                }
            }
        }
        else {
            coverCards(flippedOverCards);
            flippedOverCards = [];
            stats.updateAttemptsCounter();
        }
    };

    init.call(this);
};