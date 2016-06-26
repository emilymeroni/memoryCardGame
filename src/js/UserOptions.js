/**
 * User Options widget
 *
 * The User Options widget allows the user to choose which options he or she would like to play a new game with.
 *
 * @param {array} params.cardThemesList     A list of all the available decks
 *
 * @constructor
 * @extends luga.Notifier
 *
 * @fires chosenOptions
 */

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

    $.extend(config, params);

    /**
     * @type {memoryCardGame.UserOptions}
     */
    var self = this;

    /**
     * @type {jQuery}
     */
    self.container = $('<div></div>').addClass(CONST.CSS.ROOT);

    var init = function () {
        draw();
    };

    var draw = function () {
        var userOptionsPanel = $('<div></div>').addClass(CONST.CSS.OPTION_PANEL_CLASS);
        drawHeader(userOptionsPanel);
        drawOptionsForm(userOptionsPanel);
        drawFooter(userOptionsPanel);
        self.container.append(userOptionsPanel);
    };

    /**
     * Draws the title
     * @param {jQuery} rootNode
     */
    var drawHeader = function (rootNode) {
        var userOptionsTitle = $('<h2></h2>').text(CONST.TEXT.USER_OPTION_PANEL);
        rootNode.append(userOptionsTitle);
    };

    /**
     * Draws all the available options
     * @param {jQuery} rootNode
     */
    var drawOptionsForm = function (rootNode) {
        drawCardThemeForm(rootNode);
    };

    /**
     * Draws the theme options
     * @param {jQuery} rootNode
     */
    //TODO: Put some picture preview
    var drawCardThemeForm = function (rootNode) {
        var cardTemeText = $('<span></span>').text(CONST.TEXT.CARD_THEME);
        rootNode.append(cardTemeText);

        for (var i = 0; i < config.cardThemesList.length; i++) {
            var optionWrapper = $('<label class="themeOption"></label>');
            var option = $('<input name="theme" type="radio">');
            var cardTheme = config.cardThemesList[i];
            option.val(cardTheme);
            optionWrapper.text(cardTheme);
            optionWrapper.prepend(option);
            rootNode.append(optionWrapper);
        }
    };

    /**
     * Draws the footer area
     * @param {jQuery} rootNode
     * @fires chosenOptions
     */
    var drawFooter = function (rootNode) {
        var footerContainer = $('<div></div>');
        var closeButton = $('<button></button>').text(CONST.TEXT.CLOSE);
        closeButton.click(function () {
            self.container.hide();
            var selectedTheme = $('input:radio[name=\'theme\']:checked').val();
            self.notifyObservers(CONST.EVENT.CHOSEN_OPTIONS, {
                selectedTheme: selectedTheme
            });
        });
        footerContainer.append(closeButton);
        rootNode.append(footerContainer);
    };

    init.call(this);

};

