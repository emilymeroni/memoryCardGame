describe('GameManager', function () {

    'use strict';

    var CONST;
    var gameManager;
    var rootNode;
    var data;

    beforeEach(function () {

        rootNode = $('<div>');

        CONST = {
            CSS: {
                ROOT: 'memory-card-game'
            },
            SELECTOR: {
                ATTEMPTS_NUMBER: '.attempts-number',
                DECK: '.memory-cards',
                STATS: '.current-stats-container',
                TIMER: '.timer'
            }
        };

        gameManager = new memoryCardGame.GameManager({
            rootNode: rootNode
        });

        data = {
            selectedTheme: 'dogs'
        };
    });

    it('is the class that I need to instantiate to play a new memory game', function () {
        expect(gameManager).toBeDefined();
    });

    it('launches a user option panel to allow the user to choose his settings before starting to play the game', function () {
    });

    describe('it\'s container property:', function () {

        it('is a jQuery object holding the HTML node that contains all the elements for you to play', function () {
            expect(gameManager.container).toExist();
        });

        describe('when the user has decided his options for the game:', function () {

            it('is contained within a configurable container', function () {
                gameManager.onChosenOptionsHandler(data.selectedTheme);
                expect(rootNode.children().length).toEqual(1);
                expect(rootNode.children().first()).toEqual(gameManager.container);
            });

            it('is associated to the "memory-card-game" CSS class', function () {
                gameManager.onChosenOptionsHandler(data.selectedTheme);
                expect(gameManager.container).toHaveClass(CONST.CSS.ROOT);
            });

            describe('contains:', function () {

                it('an instance of a deck', function () {
                    gameManager.onChosenOptionsHandler(data.selectedTheme);
                    expect(gameManager.container.find(CONST.SELECTOR.DECK).length).toEqual(1);
                });

                it('an instance of a statistics panel', function () {
                    gameManager.onChosenOptionsHandler(data.selectedTheme);
                    expect(gameManager.container.find(CONST.SELECTOR.STATS).length).toEqual(1);
                });

                it('a timer', function () {
                    gameManager.onChosenOptionsHandler(data.selectedTheme);
                    expect(gameManager.container.find(CONST.SELECTOR.TIMER).length).toEqual(1);
                });
            });
        });
    });

    xdescribe('the game timer:', function () {

        it('is the time in seconds that is passing by during the game that is being played', function () {
            gameManager.onChosenOptionsHandler(data.selectedTheme);
            jasmine.clock().install();
            var timerContainer = gameManager.container.find(CONST.SELECTOR.TIMER);
            jasmine.clock().tick(1001);
            expect(parseInt(timerContainer.text())).toEqual(1);
            jasmine.clock().uninstall();
        });
    });

    describe('.onHandFinishedHandler():', function () {

        it('increases the attempts counter by one', function () {
            gameManager.onChosenOptionsHandler(data.selectedTheme);
            var attemptsNumber = gameManager.container.find(CONST.SELECTOR.ATTEMPTS_NUMBER);
            gameManager.onHandFinishedHandler();
            expect(parseInt(attemptsNumber.text(), 10)).toEqual(1);
        });
    });

    describe('.onHandInvalidHandler():', function () {

        it('increases the attempts counter by one', function () {
            gameManager.onChosenOptionsHandler(data.selectedTheme);
            var attemptsNumber = gameManager.container.find(CONST.SELECTOR.ATTEMPTS_NUMBER);
            gameManager.onHandInvalidHandler();
            expect(parseInt(attemptsNumber.text(), 10)).toEqual(1);
        });
    });

    describe('.onCardsAllFlippedHandler():', function () {

        it('calls the .saveStats() method of the Stats class', function () {
            var StatsClass = memoryCardGame.Stats;
            var spy = jasmine.createSpy('spy');

            memoryCardGame.Stats = function () {
                this.saveStats = function () {
                    spy();
                };
            };

            var memoryTest = new memoryCardGame.GameManager({
                rootNode: rootNode
            });


            memoryTest.onChosenOptionsHandler(data.selectedTheme);

            memoryTest.onCardsAllFlippedHandler();
            expect(spy).toHaveBeenCalled();

            memoryCardGame.Stats = StatsClass;
        });

        xit('clears the timer', function () {
            gameManager.onChosenOptionsHandler(data.selectedTheme);
            var timerContainer = gameManager.container.find(CONST.SELECTOR.TIMER);
            jasmine.clock().install();
            jasmine.clock().tick(1000);
            gameManager.onCardsAllFlippedHandler();
            expect(parseInt(timerContainer.text())).toEqual(0);
            jasmine.clock().uninstall();
        });
    });

});