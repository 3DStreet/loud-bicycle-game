import { gameData } from "./level-data";

export const GAME_STATES = {
    PLAYING: 0,
    END: 1,
    MENU: 2,
}

export let GAME_STATE = GAME_STATES.MENU;

export let gameManager;

export let gameScore = 0;

const SMOG_SCORE = 1;


AFRAME.registerComponent('game-manager', {
    schema: {
    },
    init: function() {
        gameManager = this;
        this.currentLevelStreetEls = [];
        setTimeout(() => {
            this.interactablePool = document.querySelector('[interactable-pool]').components['interactable-pool'];
            this.smogPool = document.querySelector('[smog-pool]').components['smog-pool'];
            this.bikePool = document.querySelector('[bike-train-pool]').components['bike-train-pool'];
            this.level = document.querySelector('#level');
            this.levelAnimation = level.components.animation;
            this.headerLabel = document.querySelector('#game-state-header');
            this.gameScoreLabel = document.querySelector('#score');
            this.playLevel();
            this.smogAudio = this.el.components.sound;

            // TODO: Chosen by menu
            this.generateLevel(0);
        }, 100);
    },
    stopLevel: function() {
        this.levelAnimation.animation.pause();
        this.interactablePool.stop();
        this.smogPool.stop();
        this.bikePool.stop();
        GAME_STATE = GAME_STATES.END;
        this.headerLabel.innerText = "Stopped"
    },
    playLevel: function() {
        gameScore = 0;
        this.gameScoreLabel.innerText = gameScore;
        this.levelAnimation.animation.play();
        this.interactablePool.start();
        this.smogPool.start();
        this.bikePool.start();
        GAME_STATE = GAME_STATES.PLAYING;
        this.headerLabel.innerText = "Playing"
    },
    increaseScore: function() {
        gameScore += SMOG_SCORE;
        this.gameScoreLabel.innerText = gameScore;
        this.smogAudio.playSound();
    },
    generateLevel: function(index) {
        const levelData = gameData.levels[index];
        this.currentLevelStreetEls = []
        let isLastStreet = false;
        let spawnDistance = levelData.streetLength / 2;
        for (let i = 0; i < 10; i++) {
            const el = document.createElement('a-entity');

            if(isLastStreet) {
                el.setAttribute('position', {x: 2, y: -0.1, z: -(spawnDistance - levelData.streetWidth / 2)})
                el.setAttribute('rotation', {x: -90, y: 0, z: 0})
                el.setAttribute('geometry', {width: levelData.streetWidth, height: levelData.streetWidth, primitive: 'plane'})
                el.setAttribute('material', `src:url(${levelData.intersectionUrls[0]})`)
                el.setAttribute('class', `intersection`)
                el.length = levelData.streetWidth;
                spawnDistance += levelData.streetLength;
            } else {
                el.setAttribute('position', {x: 1.5, y: 0, z: -(spawnDistance - levelData.streetLength / 2)})
                el.setAttribute('street', {length: levelData.streetLength})
                el.setAttribute('streetmix-loader', {streetmixStreetURL: levelData.streetUrls[0]})
                el.setAttribute('class', `street`)
                el.length = levelData.streetLength;
                spawnDistance += levelData.streetWidth;
            }
            isLastStreet = !isLastStreet;
            this.level.append(el);
            this.currentLevelStreetEls.push(el);
        }
    }, 
    removeLevel: function() {

    }
});
