/* global $, memoryCardGame */

memoryCardGame.Deck = function(params){

    'use strict';

    memoryCardGame.extend(memoryCardGame.Notifier, this);

    var CONST = {
        CSS: {
            ROOT: 'memory-cards',
            SINGLE_CARD_CLASS: 'memory-card'
        },
        CARD_COPIES: 2,
        TIME_FOR_FLIP: 500,
        DEFAULT_IMAGES: [
            'Hydrangeas.jpg',
            'Jellyfish.jpg',
            'Koala.jpg',
            'Penguins.jpg',
            'Tulips.jpg'
        ],
        IMAGE_BASE_URL: 'src\\images',
        EVENT: {
            HAND_FINISHED: 'handFinishedRequest',
            HAND_INVALID: 'handInvalidRequest',
            CARDS_ALL_FLIPPED: 'cardsAllFlippedRequest'
        }
    };

    var config = {
        cardsClass: CONST.CSS.CARDS_CLASS,
        singleCardClass: CONST.CSS.SINGLE_CARD_CLASS
    };

    // Merge incoming params with internal config
    $.extend(config, params);

    var cards = [];

    var flippedCards = [];

    var imageMap = [];

    this.container = $('<ul></ul>').addClass(config.cardsClass);

    var self = this;

    var init = function () {
        imageMap = imageMap.concat(CONST.DEFAULT_IMAGES);
        createCards();
        shuffleCards();
        drawCards();
    };

    var createCards = function() {
        for (var i = 0; i < imageMap.length; i++) {
            for (var j = 0; j < CONST.CARD_COPIES; j++) {
                var card = new memoryCardGame.Card({
                    id: cards.length,
                    image: CONST.IMAGE_BASE_URL + '\\' + imageMap[i]
                });
                card.addObserver(self);
                cards.push(card);
            }
        }
    };

    var shuffleCards = function () {
        cards = cards.sort(function () {
            return 0.5 - Math.random();
        });
    };

    var drawCards = function () {
        for (var i = 0; i < cards.length; i++) {
            var cardNode = cards[i].getNode();
            self.container.append(cardNode);
        }
    };

    var getPreviousFlippedCard = function()  {
        return flippedCards[flippedCards.length - 2];
    };

    var isNewHandStarted = function () {
        return self.getFlippedCardsNumber() % CONST.CARD_COPIES === 1;
    };

    var isHandFinished = function () {
        return self.getFlippedCardsNumber() % CONST.CARD_COPIES === 0;
    };

    var isAllCardsFlipped = function () {
        return self.getFlippedCardsNumber() === self.getCardsNumber();
    };

    var setDiscoveredCards = function () {
        for (var i = 1; i <= CONST.CARD_COPIES; i++) {
            flippedCards[flippedCards.length - i].setDiscovered();
        }
    };

    this.getFlippedCardsNumber = function () {
        return flippedCards.length;
    };

    this.getCardsNumber = function() {
        return cards.length;
    };

    //TODO: Create onSuccess and onFailure to notify game manager and remove public methods

    var coverLatestHandFlippedCards = function () {
        setTimeout(function () {
            for (var i = 0; i < CONST.CARD_COPIES; i++) {
                flippedCards[self.getFlippedCardsNumber() - 1].getCardNodeAndFlip();
                flippedCards.pop();
            }
        }, CONST.TIME_FOR_FLIP);
    };

    this.onSelectedCardRequestHandler = function(data) {
        flippedCards.push(data.card);
        if (isNewHandStarted()) {
            return;
        }
        if (getPreviousFlippedCard().getImage() === data.card.getImage()) {
            if (isHandFinished()) {
                setDiscoveredCards();
                self.notifyObservers(CONST.EVENT.HAND_FINISHED, {});
                if (isAllCardsFlipped()) {
                    self.notifyObservers(CONST.EVENT.CARDS_ALL_FLIPPED, {});
                }
            }
        }
        else {
            coverLatestHandFlippedCards();
            self.notifyObservers(CONST.EVENT.HAND_INVALID, {});
        }
    };

    init.call(this);

};

