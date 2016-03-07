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
                TIMER: '.timer'
            } ,
            ROOT_NODE: $('.dummy')
        };

        gameManager = new memoryCardGame.GameManager({
            rootNode: CONST.ROOT_NODE
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

    describe('the game timer:', function () {

        xit('is the time in seconds that is passing by during the game that is being played', function () {
            jasmine.clock().install();
            var timerContainer = gameManager.container.find(CONST.SELECTOR.TIMER);
            jasmine.clock().tick(1001);
            expect(parseInt(timerContainer.text())).toEqual(1);
            jasmine.clock().uninstall();
        });
    });

    describe('.onHandFinishedHandler():', function () {

        it('increases the attempts counter by one', function () {
            var attemptsNumber = gameManager.container.find(CONST.SELECTOR.ATTEMPTS_NUMBER);
            gameManager.onHandFinishedHandler();
            expect(parseInt(attemptsNumber.text(), 10)).toEqual(1);
        });
    });

    describe('.onHandInvalidHandler():', function () {

        it('increases the attempts counter by one', function () {
            var attemptsNumber = gameManager.container.find(CONST.SELECTOR.ATTEMPTS_NUMBER);
            gameManager.onHandInvalidHandler();
            expect(parseInt(attemptsNumber.text(), 10)).toEqual(1);
        });
    });

    describe('.onCardsAllFlippedHandler():', function () {

        it('calls the .saveStats() method of the Stats class', function () {
            var StatsClass = memoryCardGame.Stats;
            var spy = jasmine.createSpy('spy');

            memoryCardGame.Stats = function() {
                this.saveStats = function() {
                    spy();
                };
            };

            var memoryTest = new memoryCardGame.GameManager({
                rootNode: CONST.ROOT_NODE
            });

            memoryTest.onCardsAllFlippedHandler();
            expect(spy).toHaveBeenCalled();

            memoryCardGame.Stats = StatsClass;
        });

        xit('clears the timer', function () {
            var timerContainer = gameManager.container.find(CONST.SELECTOR.TIMER);
            jasmine.clock().install();
            jasmine.clock().tick(1000);
            gameManager.onCardsAllFlippedHandler();
            expect(parseInt(timerContainer.text())).toEqual(0);
            jasmine.clock().uninstall();
        });
    });

});