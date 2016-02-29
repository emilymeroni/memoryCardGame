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

    var config = {};

    // Merge incoming params with internal config
    $.extend(config, params);

    var attempts = 0;

    /**
     * @type {jQuery}
     */
    var attemptsNumber = $('<span></span>').addClass(CONST.CSS.ATTEMPTS_NUMBER);

    /**
     * @type {jQuery}
     */
    var bestScoreNumber = $('<span></span>').addClass(CONST.CSS.BEST_SCORE_NUMBER);

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
        attemptsNumber.text(attempts);

        currentMoves.append(attemptsText);
        currentMoves.append(attemptsNumber);

        self.container.append(currentMoves);

        var bestScoreCounter = memoryCardGame.utils.getFromLocalStorage('bestScoreCounter');

        if (bestScoreCounter) {
            var bestScore = $('<div></div>').addClass(CONST.CSS.BEST_SCORE);
            var bestScoreText = $('<span></span>').addClass(CONST.CSS.BEST_SCORE_TEXT).text(CONST.TEXT.BEST_SCORE);
            bestScoreNumber.text(bestScoreCounter);

            bestScore.append(bestScoreText);
            bestScore.append(bestScoreNumber);
            self.container.append(bestScore);
        }
    };

    this.updateAttemptsCounter = function () {
        attempts++;
        attemptsNumber.text(attempts);
    };

    this.saveStats = function () {
        var bestScoreCounter = memoryCardGame.utils.getFromLocalStorage('bestScoreCounter');
        if ((bestScoreCounter === undefined || attempts < bestScoreCounter)) {
            memoryCardGame.utils.addDataInLocalStorage({bestScoreCounter: attempts});
        }
    };

    init.call(this);
};

