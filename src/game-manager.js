import { gameData } from "./level-data";

export const GAME_STATES = {
    PLAYING: 0,
    END: 1,
    MENU: 2,
}

export let GAME_STATE = GAME_STATES.MENU;

export let gameManager;

export let gameScore = 0;

const COIN_SCORE = 1;


AFRAME.registerComponent('game-manager', {
    schema: {
    },
    init: function() {
        gameManager = this;
        this.currentLevelStreetEls = [];
        setTimeout(() => {
            this.interactablePool = document.querySelector('[interactable-pool]').components['interactable-pool'];
            this.coinPool = document.querySelector('[coin-pool]').components['coin-pool'];
            this.bikePool = document.querySelector('[bike-train-pool]').components['bike-train-pool'];
            this.level = document.querySelector('#level');
            this.levelAnimation = level.components.animation;
            this.headerLabel = document.querySelector('#game-state-header');
            this.gameScoreLabel = document.querySelector('#score');
            this.playLevel();
            this.coinAudio = this.el.components.sound;

            // TODO: Chosen by menu
            this.generateLevel(0);
        }, 100);
    },
    stopLevel: function() {
        this.levelAnimation.animation.pause();
        this.interactablePool.stop();
        this.coinPool.stop();
        this.bikePool.stop();
        GAME_STATE = GAME_STATES.END;
        this.headerLabel.innerText = "Stopped"
    },
    playLevel: function() {
        gameScore = 0;
        this.gameScoreLabel.innerText = gameScore;
        this.levelAnimation.animation.play();
        this.interactablePool.start();
        this.coinPool.start();
        this.bikePool.start();
        GAME_STATE = GAME_STATES.PLAYING;
        this.headerLabel.innerText = "Playing"
    },
    increaseScore: function() {
        gameScore += COIN_SCORE;
        this.gameScoreLabel.innerText = gameScore;
        this.coinAudio.playSound();
    },
    generateLevel: function(index) {
        const levelData = gameData.levels[index];
        this.currentLevelStreetEls = []
        let isIntersection = false;
        let spawnDistance = levelData.streetLength / 2;
        for (let i = 0; i < 7; i++) {
            const el = document.createElement('a-entity');

            if(isIntersection) {    
                el.setAttribute('position', {x: 2, y: 0, z: -(spawnDistance - levelData.streetWidth / 2)})
                el.setAttribute('intersection', `dimensions: ${levelData.streetWidth} ${levelData.streetWidth}; northeastcurb: 4.572 4.572; southwestcurb: 4.572 4.572; southeastcurb: 4.572 4.572; northwestcurb: 4.572 4.572; trafficsignal: 1 1 1 1; crosswalk: 1 1 1 1`);
                el.setAttribute('class', 'intersection');
                spawnDistance += levelData.streetLength;
            } else {
                el.setAttribute('position', {x: 1.5, y: 0, z: -(spawnDistance - levelData.streetLength / 2)})
                el.setAttribute('street', {length: levelData.streetLength})
                el.setAttribute('streetmix-loader', {streetmixAPIURL: levelData.streetUrls[i]})
                el.setAttribute('class', `street`)
                el.length = levelData.streetLength;
                spawnDistance += levelData.streetWidth;
            }
            isIntersection = !isIntersection;
            this.level.append(el);
            this.currentLevelStreetEls.push(el);
        }
    }, 
    removeLevel: function() {

    }
});
