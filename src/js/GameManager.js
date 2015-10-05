/* global $, memoryCardGame */

memoryCardGame.GameManager = function(){

	'use strict';

	var CONST = {
		CSS: {

		},
		CARD_COPIES: 2,
		DEFAULT_IMAGES: [
			'Hydrangeas.jpg', 
			'Jellyfish.jpg', 
			'Koala.jpg', 
			'Penguins.jpg', 
			'Tulips.jpg'
		],	
		IMAGE_BASE_URL: '..\\src\\images'
	};

	var cards = [];
	var imageMap = [];
	var imagePosition = 0;
	var cardCounter = 0;

	var init = function() {
		imageMap = imageMap.concat(CONST.DEFAULT_IMAGES);
		cards = getShuffledCards();
		draw();
	};

	var getShuffledCards = function(){
		for(var i = 0; i < CONST.DEFAULT_IMAGES.length; i++) {
			cards = cards.concat(createSameCards());
		}
		return shuffleCards(cards);
	};

	var createSameCards = function(){
		var sameCards = [];
		for(var i = 0; i < CONST.CARD_COPIES; i++){
			var card = new memoryCardGame.Card({
				id: imagePosition + cardCounter,
				image: getImage()
			});
			cardCounter++;
			sameCards.push(card);
		}

		changeImagePosition();
		return sameCards;
	};

	var changeImagePosition = function(){
		imagePosition++;
	};

	var getImage = function(){
		return CONST.IMAGE_BASE_URL + "\\" + imageMap[imagePosition];
	};

	var draw = function(){
		var html = "";
	};

	var shuffleCards = function(cards){
		cards = cards.sort(function() {
			return 0.5 - Math.random();
		});
		return cards;
	};

	init.call(this);
};