/* global $, memoryCardGame */

memoryCardGame.GameManager = function (params) {

    'use strict';

    var CONST = {
        GAME_ID: 'memoryCardGame',
        CSS: {
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
        gameId: CONST.GAME_ID,
        singleCardClass: CONST.CSS.SINGLE_CARD_CLASS
    };

    // Merge incoming params with internal config
    $.extend(config, params);

    var cards = [];

    var discoveredSameCards = 0;

    var imageMap = [];

    var imagePosition = 0;

    var flippedOverCardsIds = [];

    var self = this;

    var timer = 0;

    var init = function () {
        imageMap = imageMap.concat(CONST.DEFAULT_IMAGES);
        prepareCards();
        shuffleCards();
        draw();
        startTimer();
    };

    var changeImagePosition = function () {
        imagePosition++;
    };

    var createSameCards = function () {
        var cardId;
        for (var i = 0; i < CONST.CARD_COPIES; i++) {
            cardId = cards.length;
            var card = new memoryCardGame.Card({
                id: cardId,
                image: getImage(),
                gameManager: self
            });
            cards[cardId] = card;
        }
        changeImagePosition();
    };

    var setDiscoveredCardsById = function (flippedOverCardsIds) {
        for (var i = 0; i < flippedOverCardsIds.length; i++) {
            getCardInDeckById(flippedOverCardsIds[i]).setDiscovered();
        }
        discoveredSameCards++;
    };

    var draw = function () {
        var memoryCardGame = $("#" + config.gameId);
        var cardList = $(CONST.HTML.CARD_LIST).addClass(config.cardsClass);
        for (var i = 0; i < cards.length; i++) {
            var cardHtmlNode = cards[i].makeHtmlNode();
            cardList.append(cardHtmlNode);
        }
        memoryCardGame.append(cardList);
    };

    var coverCardsById = function (flippedOverCardsIds) {
        setTimeout(function () {
            for (var i = 0; i < flippedOverCardsIds.length; i++) {
                getCardInDeckById(flippedOverCardsIds[i]).getCardNodeAndFlip();
            }
        }, CONST.TIME_FOR_FLIP);
    };

    //TODO: Create a map
    var getCardInDeckById = function (cardId) {
        for (var i = 0; i < cards.length; i++) {
            if (cards[i].getId() === parseInt(cardId)) {
                return cards[i];
            }
        }
    };

    var endGame = function() {
    };

    var getImage = function () {
        return CONST.IMAGE_BASE_URL + "\\" + imageMap[imagePosition];
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

    var startTimer = function () {
        setInterval(function () {
            timer++;
        }, 1000);
    };

    this.onCardSelected = function (cardId) {
        flippedOverCardsIds.push(cardId);
        if (flippedOverCardsIds.length > 1) {
            if (getCardInDeckById(flippedOverCardsIds[flippedOverCardsIds.length - 2]).getImage() === getCardInDeckById(cardId).getImage()) {
                if ((flippedOverCardsIds.length) % CONST.CARD_COPIES === 0) {
                    setDiscoveredCardsById(flippedOverCardsIds);
                    flippedOverCardsIds = [];
                    if(discoveredSameCards * CONST.CARD_COPIES === cards.length) {
                        endGame();
                    }
                }
            }
            else {
                coverCardsById(flippedOverCardsIds);
                flippedOverCardsIds = [];
            }
        }
    };

    init.call(this);
};