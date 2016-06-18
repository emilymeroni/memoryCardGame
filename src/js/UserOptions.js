memoryCardGame.UserOptions = function (params) {

    'use strict';

    luga.extend(luga.Notifier, this);

    var CONST = {
        CSS: {
            ROOT: 'user-options-wrapper',
            OPTION_PANEL_CLASS: 'user-options-panel'
        },
        EVENT: {
            CHOSEN_OPTIONS: 'chosenOptions'
        },
        TEXT: {
            CARD_THEME: 'Card theme:',
            PICTURE_NUMBER: 'Number of pictures:',
            USER_OPTION_PANEL: 'User option panel',
            CLOSE: 'Close'
        }
    };

    var config = {
        cardThemesList: null
    };

    // Merge incoming params with internal config
    $.extend(config, params);

    var self = this;

    self.container = $('<div></div>').addClass(CONST.CSS.ROOT);

    var init = function () {
        draw();
    };

    var draw = function () {
        //TODO: Create utils library for dom elements
        var userOptionsPanel = $('<div></div>').addClass(CONST.CSS.OPTION_PANEL_CLASS);
        drawHeader(userOptionsPanel);
        drawOptionsForm(userOptionsPanel);
        drawFooter(userOptionsPanel);
        self.container.append(userOptionsPanel);
    };

    var drawHeader = function (rootNode) {
        var userOptionsTitle = $('<h2></h2>').text(CONST.TEXT.USER_OPTION_PANEL);
        rootNode.append(userOptionsTitle);
    };

    var drawOptionsForm = function (rootNode) {
        drawCardThemeForm(rootNode);
    };

    var drawHowManyPicturesForm = function (rootNode) {
        var howManyPicturesLabel = $('<label></label>').text(CONST.TEXT.PICTURE_NUMBER);
        var howManyPictures = $('<input type="text">');
        howManyPicturesLabel.append(howManyPictures);
        rootNode.append(howManyPicturesLabel);
    };

    //TODO: Put some picture preview
    var drawCardThemeForm = function (rootNode) {
        var cardTemeText = $('<span></span>').text(CONST.TEXT.CARD_THEME);
        rootNode.append(cardTemeText);

        for (var i = 0; i < config.cardThemesList.length; i++) {
            var option = $('<label><input name="theme" type="radio"></label>');
            var cardTheme = config.cardThemesList[i];
            option.val(cardTheme);
            option.text(cardTheme.toUpperCase());
            rootNode.append(option);
        }
    };

    var drawFooter = function (rootNode) {
        var closeButton = $('<button></button>').text(CONST.TEXT.CLOSE);
        closeButton.click(function () {
            self.container.hide();
            var selectedTheme = $('input:radio[name=\'theme\']:checked').val();
            self.notifyObservers(CONST.EVENT.CHOSEN_OPTIONS, {
                selectedTheme: selectedTheme
            });
        });
        rootNode.append(closeButton);
    };

    init.call(this);

};

