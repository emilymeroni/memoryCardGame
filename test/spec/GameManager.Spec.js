describe('GameManager', function () {

    'use strict';

    var CONST;
    var gameManager;

    beforeEach(function () {

        CONST = {
            CSS: {
                ROOT: 'memory-card-game'
            },
            SELECTOR: {
                ATTEMPTS_NUMBER: '.attempts-number',
                DECK: '.memory-cards',
                STATS: '.current-stats-container',
                TIMER: '.timer',
                GAME_CONTAINER: '.dummy'
            }
        };

        gameManager = new memoryCardGame.GameManager({
            gameContainer: CONST.SELECTOR.GAME_CONTAINER
        });
    });

    it('is the class that I need to instantiate to play a new memory game', function () {
        expect(gameManager).toBeDefined();
    });

    describe('it\'s container property:', function () {

        it('is a jQuery object holding the HTML node that contains all the elements for you to play', function () {
            expect(gameManager.container).toExist();
        });

        xit('is contained within a configurable container', function () {
        });

        it('is associated to the "memory-board" CSS class', function () {
            expect(gameManager.container).toHaveClass(CONST.CSS.ROOT);
        });

        describe('contains:', function () {

            it('an instance of a deck', function () {
                expect(gameManager.container.find(CONST.SELECTOR.DECK).length).toEqual(1);
            });

            it('an instance of a statistics panel', function () {
                expect(gameManager.container.find(CONST.SELECTOR.STATS).length).toEqual(1);
            });

            it('a timer', function () {
                expect(gameManager.container.find(CONST.SELECTOR.TIMER).length).toEqual(1);
            });
        });
    });

    describe('.onHandFinishedHandler():', function () {

        it('increases the attempts counter by one', function () {
            var attemptsNumber = gameManager.container.find(CONST.SELECTOR.ATTEMPTS_NUMBER);
            expect(parseInt(attemptsNumber.text(), 10)).toEqual(0);
            gameManager.onHandFinishedHandler();
            expect(parseInt(attemptsNumber.text(), 10)).toEqual(1);
        });
    });

    describe('.onHandInvalidHandler():', function () {

        it('increases the attempts counter by one', function () {
            var attemptsNumber = gameManager.container.find(CONST.SELECTOR.ATTEMPTS_NUMBER);
            expect(parseInt(attemptsNumber.text(), 10)).toEqual(0);
            gameManager.onHandInvalidHandler();
            expect(parseInt(attemptsNumber.text(), 10)).toEqual(1);
        });
    });

    xdescribe('.onCardsAllFlippedHandler():', function () {
    });

});