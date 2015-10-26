/* global $, memoryCardGame */

memoryCardGame.Card = function(params){

	'use strict';

	var CONST = {
		CSS: {
			SINGLE_CARD_CLASS: 'memory-card'
		},
		DATA: {
			CARD_ID: 'data-card-id'
		},
		HTML: {
			CARD_NODE: '<li></li>',
			IMAGE_NODE: '<img>'
		}
	};

	var config = {
		id: null,
		flipped: false,
		image: null,
		gameManager: null
	};

	// Merge incoming params with internal config
	$.extend(config, params);

	var discovered = false;

	var imageNode = $(CONST.HTML.IMAGE_NODE);

	var self = this;

	 var flip = function(cardNode) {
		config.flipped = !config.flipped;

		if(config.flipped === true){
			cardNode.append(getImageNode());
		}
		else {
			cardNode.find(imageNode).remove();
		}
	};

	this.getCardNodeAndFlip = function() {
		var cardNode = $('.' + CONST.CSS.SINGLE_CARD_CLASS + '[' + CONST.DATA.CARD_ID + '=' + config.id + ']');
		flip(cardNode);
	};

	this.getImage = function() {
		return config.image;
	};

	var getImageNode = function() {
		imageNode.attr('src', config.image);
		return imageNode;
	};

	this.getNode = function() {
		var cardNode = $(CONST.HTML.CARD_NODE);
		cardNode.addClass(CONST.CSS.SINGLE_CARD_CLASS).attr(CONST.DATA.CARD_ID, config.id);
		cardNode.click(function(){
			if(discovered === false) {
				flip(cardNode);
				if(config.flipped === true) {
					config.gameManager.onCardSelected(self);
				}
			}
		});
		return cardNode;
	};

	this.setDiscovered = function() {
		discovered = true;
	};
};

