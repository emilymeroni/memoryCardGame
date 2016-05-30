memoryCardGame.Deck = function (params) {

    'use strict';

    luga.extend(luga.Notifier, this);

    var CONST = {
        CSS: {
            ROOT: 'memory-cards',
            SINGLE_CARD_CLASS: 'memory-card'
        },
        CARD_COPIES: 2,
        TIME_FOR_FLIP: 500,
        IMAGE_BASE_URL: 'src\\cardthemes',
        EVENT: {
            HAND_FINISHED: 'handFinished',
            HAND_INVALID: 'handInvalid',
            CARDS_ALL_FLIPPED: 'cardsAllFlipped'
        },
        HTML: {
            DECK: '<ul></ul>'
        }
    };

    var config = {
        selectedTheme: null
    };

    // Merge incoming params with internal config
    $.extend(config, params);

    var cards = [];

    var flippedCards = [];

    this.container = $(CONST.HTML.DECK).addClass(CONST.CSS.ROOT);

    var self = this;

    var init = function () {
        createCards();
        shuffleCards();
        drawCards();
    };

    var createCards = function () {

        $.ajaxSetup({
            async: false
        });

        $.getJSON('dist/themes.json', function(json) {

            var selectedThemeCards = json[config.selectedTheme];
            $.each(selectedThemeCards, function( key, val ) {
                for (var j = 0; j < CONST.CARD_COPIES; j++) {

                    var card = new memoryCardGame.Card({
                        id: cards.length,
                        image: CONST.IMAGE_BASE_URL + '\\' + val
                    });
                    card.addObserver(self);
                    cards.push(card);
                }
            });
        });

        $.ajaxSetup({
            async: true
        });

    };

    var shuffleCards = function () {
        cards = cards.sort(function () {
            return 0.5 - Math.random();
        });
    };

    var drawCards = function () {
        for (var i = 0; i < cards.length; i++) {
            self.container.append(cards[i].container);
        }
    };

    var getPreviousFlippedCard = function () {
        return flippedCards[flippedCards.length - 2];
    };

    var isNewHandStarted = function () {
        return flippedCards.length % CONST.CARD_COPIES === 1;
    };

    var isHandFinished = function () {
        return flippedCards.length % CONST.CARD_COPIES === 0;
    };

    var isAllCardsFlipped = function () {
        return flippedCards.length === cards.length;
    };

    var setDiscoveredCards = function () {
        for (var i = 1; i <= CONST.CARD_COPIES; i++) {
            flippedCards[flippedCards.length - i].setDiscovered();
        }
    };

    var coverLatestHandFlippedCards = function () {
        setTimeout(function () {
            for (var i = 0; i < CONST.CARD_COPIES; i++) {
                flippedCards[flippedCards.length - 1].getCardNodeAndFlip();
                flippedCards.pop();
            }
        }, CONST.TIME_FOR_FLIP);
    };

    this.onSelectedCardHandler = function (data) {
        var card = data.card;
        flippedCards.push(card);
        if (isNewHandStarted()) {
            return;
        }
        if (getPreviousFlippedCard().getImage() === card.getImage()) {
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

