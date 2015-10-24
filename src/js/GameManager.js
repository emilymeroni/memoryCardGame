/* global $, memoryCardGame */

memoryCardGame.GameManager = function(params){

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

	var cardCounter = 0;

	var imageMap = [];

	var imagePosition = 0;

	var flippedOverCardsId = [];

	var self = this;

	var init = function() {
		imageMap = imageMap.concat(CONST.DEFAULT_IMAGES);
		cards = getShuffledCards();
		draw();
	};

	var changeImagePosition = function(){
		imagePosition++;
	};

	var createSameCards = function(){
		var sameCards = [];
		var cardId;
		for(var i = 0; i < CONST.CARD_COPIES; i++){
			cardId = cardCounter++;
			var card = new memoryCardGame.Card({
				id: cardId,
				image: getImage(),
				gameManager: self
			});
			sameCards.push(card);
		}
		changeImagePosition();
		return sameCards;
	};

	var setDiscoveredCardsById =  function(flippedOverCardsId) {
		for(var i = 0; i < flippedOverCardsId.length; i++) {
			cards[flippedOverCardsId[i]].setDiscovered();
		}
	};

	var draw = function(){
		var memoryCardGame = $("#" + config.gameId);

		var cardList = $(CONST.HTML.CARD_LIST).addClass(config.cardsClass);

		for (var cardId in cards) {
			//TODO: Find way of iterating by key that is not an incremental
			var cardHtmlNode = cards[cardId].makeHtmlNode();
			cardList.append(cardHtmlNode);
		}

		memoryCardGame.append(cardList);
	};

	var flipCardsDownById = function(flippedOverCardsId) {
		for (var i = 0; i < flippedOverCardsId.length; i++) {
			cards[flippedOverCardsId[i]].getCardNodeAndFlip();
		}
	};

	var getImage = function(){
		return CONST.IMAGE_BASE_URL + "\\" + imageMap[imagePosition];
	};

	var getShuffledCards = function(){
		for(var i = 0; i < CONST.DEFAULT_IMAGES.length; i++) {
			cards = cards.concat(createSameCards());
		}
		var cardsWithShuffle = shuffleCards(cards);
		var tmp = [];

		for(var j = 0; j < cardsWithShuffle.length; j++) {
			tmp[cardsWithShuffle[j].getId()] = cardsWithShuffle[j];
		}

		cards = tmp;
		return cards;
	};

	var shuffleCards = function(cards){
		cards = cards.sort(function() {
			return 0.5 - Math.random();
		});
		return cards;
	};

	this.onCardSelected = function(cardId)  {
		flippedOverCardsId.push(cardId);
		if(flippedOverCardsId.length > 1){
			if(cards[flippedOverCardsId[flippedOverCardsId.length - 2]].getImage() === cards[cardId].getImage()) {
				if((flippedOverCardsId.length) % CONST.CARD_COPIES === 0){
					setDiscoveredCardsById(flippedOverCardsId);
					flippedOverCardsId = [];
				}
				else {
					flippedOverCardsId.push(cardId);
				}
			}
			else {
				flipCardsDownById(flippedOverCardsId);
				flippedOverCardsId = [];
			}
		}
	};

	init.call(this);
};