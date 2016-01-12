'use strict';

var CONST;
var gameManager;

beforeEach(function() {

    CONST = {
        CSS: {
            ROOT: 'memory-board',
            CARDS_CLASS: 'memory-cards'
        },
        SELECTOR: {
            CARDS_CLASS: '.memory-cards'
        }
    };

    gameManager = new memoryCardGame.GameManager();

});

describe('GameManager', function() {

    it('is the class that I need to instantiate to play a new memory game', function() {
        expect(gameManager).toBeDefined();
    });

    describe('it\'s container property:', function() {

        it('is a jQuery object holding the HTML node that contains all the elements to play', function() {
            expect(gameManager.container).toExist();
        });
    });

});