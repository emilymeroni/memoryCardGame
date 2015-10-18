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

	var init = function() {
	};

	this.flip = function(cardNode) {
		config.flipped = !config.flipped;

		if(config.flipped){
			cardNode.append(getImageNode());
		}
		else {
			cardNode.find(imageNode).remove();
		}
	};

	this.getHtmlNode = function() {
		var cardNode = $(CONST.HTML.CARD_NODE);
		cardNode.addClass(CONST.CSS.SINGLE_CARD_CLASS).attr(CONST.DATA.CARD_ID, config.id);
		cardNode.click(function(){
			if(!discovered) {
				self.flip(cardNode);
				if(config.flipped) {
					var cardId = $(this).attr(CONST.DATA.CARD_ID);
					config.gameManager.onCardSelected(cardId);
				}
			}
		});
		return cardNode;
	};

	this.getId = function() {
		return config.id;
	};

	this.getImage = function() {
		return config.image;
	};

	var getImageNode = function() {
		imageNode.attr('src', config.image);
		return imageNode;
	};

	this.setDiscovered = function() {
		discovered = true;
	};

	init.call(this);
};

