/* global $, memoryCardGame */

memoryCardGame.UserOptions = function(params){

	'use strict';

	var CONST = {
		CSS: {
			USER_OPTIONS_WRAPPER: 'user-options-wrapper',
			OPTION_PANEL_CLASS: 'user-options-panel'
		},
		TEXT: {
			PICTURE_NUMBER: 'Number of pictures:',
			USER_OPTION_PANEL: 'User option panel',
			CLOSE: 'Close'
		}
	};

	var config = {
		cardCopies: null
	};

	// Merge incoming params with internal config
	$.extend(config, params);

	var self = this;

	self.container = $('<div></div>').addClass(CONST.CSS.USER_OPTIONS_WRAPPER);

	var init = function () {
		draw();
	};

	var draw = function() {
		//TODO: Create utils library for dom elements
		var userOptionsPanel = $('<div></div>').addClass(CONST.CSS.OPTION_PANEL_CLASS);
		drawHeader(userOptionsPanel);
		drawOptionsForm(userOptionsPanel);
		drawFooter(userOptionsPanel);
		self.container.append(userOptionsPanel);
		//TODO: Create a global class for memoryGame and append panel to it
		$('body').append(self.container);
	};

	var drawHeader = function(rootNode) {
		var userOptionsTitle = $('<h2></h2>').text(CONST.TEXT.USER_OPTION_PANEL);
		rootNode.append(userOptionsTitle);
	};

	var drawOptionsForm = function(rootNode) {
		var howManyPicturesLabel = $('<label></label>').text(CONST.TEXT.PICTURE_NUMBER);
		var howManyPictures = $('<input type="text">');
		howManyPicturesLabel.append(howManyPictures);
		rootNode.append(howManyPicturesLabel);
	};

	var drawFooter = function(rootNode) {
		var closeButton = $('<button></button>').text(CONST.TEXT.CLOSE);
		closeButton.click(function(){
			self.container.hide();
			new memoryCardGame.GameManager();
		});
		rootNode.append(closeButton);
	};

	init.call(this);

};

