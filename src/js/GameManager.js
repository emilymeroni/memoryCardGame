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
		IMAGE_BASE_URL: 'src\\images'
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
		for(var i = 0; i < CONST.CARD_COPIES; i++){
			var card = new memoryCardGame.Card({
				id: imagePosition + cardCounter,
				image: getImage(),
				gameManager: self
			});
			cardCounter++;
			sameCards.push(card);
		}

		changeImagePosition();
		return sameCards;
	};

	var draw = function(){
		var memoryCardGame = $("#" + config.gameId);

		var cardList = $(CONST.HTML.CARD_LIST).addClass(config.cardsClass);

		for (var i = 0; i < cards.length; i++) {
			var cardHtmlNode = cards[i].getHtmlNode();
			cardList.append(cardHtmlNode);
		}
		memoryCardGame.append(cardList);
	};

	var getImage = function(){
		return CONST.IMAGE_BASE_URL + "\\" + imageMap[imagePosition];
	};

	var getShuffledCards = function(){
		for(var i = 0; i < CONST.DEFAULT_IMAGES.length; i++) {
			cards = cards.concat(createSameCards());
		}
		return shuffleCards(cards);
	};

	var shuffleCards = function(cards){
		cards = cards.sort(function() {
			return 0.5 - Math.random();
		});
		return cards;
	};

	this.onCardSelected = function(card) {
	};

	init.call(this);
};