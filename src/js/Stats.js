memoryCardGame.Stats = function (params) {

    'use strict';

    var CONST = {
        CSS: {
            ROOT: 'current-stats-container',
            BEST_SCORE: 'best-score',
            BEST_SCORE_TEXT: 'best-score-text',
            BEST_SCORE_NUMBER: 'best-score-number',
            ATTEMPTS: 'attempts',
            ATTEMPTS_TEXT: 'attempts-text',
            ATTEMPTS_NUMBER: 'attempts-number'
        },
        SELECTOR: {
            ATTEMPTS_NUMBER: '.attempts-number'
        },
        TEXT: {
            ATTEMPTS: 'Attempts: ',
            BEST_SCORE: 'Best score: '
        }
    };

    var config = {
        bestScoreCounter: null,
        attempts: 0

    };

    // Merge incoming params with internal config
    $.extend(config, params);

    /**
     * @type {jQuery}
     */
    this.container = $('<div></div>').addClass(CONST.CSS.ROOT);

    var self = this;

    var init = function () {
        draw();
    };

    var draw = function () {

        var currentMoves = $('<div></div>').addClass(CONST.CSS.ATTEMPTS);
        var attemptsText = $('<span></span>').addClass(CONST.CSS.ATTEMPTS_TEXT).text(CONST.TEXT.ATTEMPTS);
        var attemptsNumber = $('<span></span>').addClass(CONST.CSS.ATTEMPTS_NUMBER).text(config.attempts);

        currentMoves.append(attemptsText);
        currentMoves.append(attemptsNumber);

        self.container.append(currentMoves);

        if (config.bestScoreCounter !== null) {
            var bestScore = $('<div></div>').addClass(CONST.CSS.BEST_SCORE);
            var bestScoreText = $('<span></span>').addClass(CONST.CSS.BEST_SCORE_TEXT).text(CONST.TEXT.BEST_SCORE);
            var bestScoreNumber = $('<span></span>').addClass(CONST.CSS.BEST_SCORE_NUMBER).text(config.bestScoreCounter);

            bestScore.append(bestScoreText);
            bestScore.append(bestScoreNumber);
            self.container.append(bestScore);
        }
    };

    this.updateAttemptsCounter = function () {
        config.attempts++;
        self.container.find(CONST.SELECTOR.ATTEMPTS_NUMBER).text(config.attempts);
    };

    this.saveStats = function () {
        if ((config.bestScoreCounter === null || config.attempts < config.bestScoreCounter)) {
            memoryCardGame.utils.addDataInLocalStorage({bestScoreCounter: config.attempts});
        }
    };

    init.call(this);
};

