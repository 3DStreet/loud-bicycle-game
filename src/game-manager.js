import { Vector3 } from 'super-three';
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
        window.gameManager = this;
        gameManager = this;
        this.tempVec = new Vector3();
        this.currentLevelStreetEls = [];
        this.bikeMemberCount = 0;
        this.winSoundEl = document.querySelector('#win-sound');

        setTimeout(() => {
            this.interactablePool = document.querySelector('[interactable-pool]').components['interactable-pool'];
            this.smogPool = document.querySelector('[smog-pool]').components['smog-pool'];
            this.bikePool = document.querySelector('[bike-train-pool]').components['bike-train-pool'];
            this.level = document.querySelector('#level');
            this.levelAnimation = level.components.animation;
            this.headerLabel = document.querySelector('#game-state-header');
            this.gameScoreLabel = document.querySelector('#score');
            this.smogAudio = this.el.components.sound;
            
            document.querySelector('#level-1-button').addEventListener('click', () => {
                this.generateLevel(0);
                this.playLevel();
                setMenuEnabled(false);
            })

            // TODO: Disables menu by default, remove in the future
            const queryString = window.location.search;
            const urlParams = new URLSearchParams(queryString);
            const showMenu = urlParams.get('menu');

            if(!showMenu) {
                this.generateLevel(0);
                this.playLevel();
                setMenuEnabled(false);
            }

            this.tick = AFRAME.utils.throttleTick(this.tick, 500, this);
        }, 100);
    },
    endLevel: function() {
        this.stopLevel();
        this.headerLabel.innerText = "Finished";
        setEndScreenEnabled(true, this.levelData.getLevelEndMessage(this.bikeMemberCount));
        this.winSoundEl.play();
        this.removeLevel();
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
        this.bikeMemberCount = 0;
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
        const levelData = this.levelData = gameData.levels[index];
        this.currentLevelStreetEls = []
        let isIntersection = false;
        let spawnDistance = levelData.streetLength / 2;
        for (let i = 0; i < 7; i++) {
            const el = document.createElement('a-entity');

            if(isIntersection) {    
                el.setAttribute('position', {x: 2, y: 0, z: -(spawnDistance - levelData.streetWidth / 2)})
                el.setAttribute('intersection', `dimensions: ${levelData.streetWidth} ${levelData.streetWidth}; northeastcurb: 4.572 4.572; southwestcurb: 4.572 4.572; southeastcurb: 4.572 4.572; northwestcurb: 4.572 4.572; trafficsignal: 1 1 1 1; crosswalk: 1 1 1 1`);
                el.setAttribute('class', 'intersection');
                el.halfLength = levelData.streetWidth / 2;
                spawnDistance += levelData.streetLength;
            } else {
                el.setAttribute('position', {x: 1.5, y: 0, z: -(spawnDistance - levelData.streetLength / 2)})
                el.setAttribute('street', {length: levelData.streetLength, showVehicles: false})
                el.setAttribute('streetmix-loader', {streetmixAPIURL: levelData.streetUrls[i]})
                el.setAttribute('class', `street`)  
                el.halfLength = levelData.streetLength                                                                                                                                                                                                                                                                                   / 2;
                spawnDistance += levelData.streetWidth;
            }
            isIntersection = !isIntersection;
            this.level.append(el);
            this.currentLevelStreetEls.push(el);
        }
    },
    removeLevel: function() {

    },
    getLevelPosition: function() {
        this.level.object3D.getWorldPosition(this.tempVec);
        return this.tempVec.z;
    },
    getCurrentStreetIndex: function() {
        if(!this.currentLevelStreetEls) return;

        for (let i = 0; i < this.currentLevelStreetEls.length; i++) {
            const street = this.currentLevelStreetEls[i];
            street.object3D.getWorldPosition(this.tempVec);

            if(this.tempVec.z + street.halfLength > 0 && this.tempVec.z - street.halfLength < 0 )
                return i
        }
        return -1;
    },
    getStreetObject3D: function(index) {
        return this.currentLevelStreetEls[index].object3D;
    },
    incrementBikePoolMemberCount: function() {
        this.bikeMemberCount++;
    },
    tick: function() {
        if(GAME_STATE === GAME_STATES.PLAYING && this.getLevelPosition() > this.levelData.endDistance) {
            this.endLevel();
        }
    }
});
