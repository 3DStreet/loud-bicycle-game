import { Vector3 } from 'super-three';
import { gameData, SIDE_STREET_URL } from "./level-data";
import { playerController } from './player-controller';

export const GAME_STATES = {
    PLAYING: 0,
    PAUSED: 1,
    END: 2,
    MENU: 3,
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
        this.lanes = 3;
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
            
            // Pause Menu
            let pauseContinueButton = document.querySelector('#pause-menu-container #continue');
            let pauseQuitButton = document.querySelector('#pause-menu-container #quit');

            pauseContinueButton.addEventListener('click', () => {
                this.togglePauseLevel();
            })

            pauseQuitButton.addEventListener('click', () => {
                this.quitLevel();
            })

            // Level Buttons
            for (let i = 0; i < 4; i++) {
                const id = `#level-${i+1}-button`;
                document.querySelector(id).addEventListener('click', () => {
                    this.generateLevel(i);
                    this.playLevel();
                    setMenuEnabled(false);
                    setLevelSelectionEnabled(false)
                })
            }

            // TODO: Disables menu by default, remove in the future
            const queryString = window.location.search;
            const urlParams = new URLSearchParams(queryString);
            const showMenu = urlParams.get('menu');
            
            if(!showMenu) {
                const levelParam = Number(urlParams.get('level')) || 0;
                this.generateLevel(levelParam);
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
    quitLevel: function() {
        this.stopLevel();
        setMenuEnabled();
        this.removeLevel();
        setPauseEnabled(false);
        setLevelSelectionEnabled(true);
        this.levelAnimation.animation.play();
        this.el.sceneEl.play();
        playerController.setAnimationPaused(false);
    },
    togglePauseLevel: function() {
        if(!(GAME_STATE === GAME_STATES.PLAYING || GAME_STATE === GAME_STATES.PAUSED)) return;
        GAME_STATE = GAME_STATE === GAME_STATES.PAUSED ? GAME_STATES.PLAYING : GAME_STATES.PAUSED;
        if(GAME_STATE === GAME_STATES.PAUSED) {
            this.levelAnimation.animation.pause();
            this.el.sceneEl.pause();
            playerController.setAnimationPaused(true);
            setPauseEnabled(true);
        } else {
            this.levelAnimation.animation.play();
            this.el.sceneEl.play();
            playerController.setAnimationPaused(false);
            setPauseEnabled(false);
        }
    },
    failLevel: function() {
        this.stopLevel();
        this.headerLabel.innerText = "Failed";
        setEndScreenEnabled(true, "Try again!");
        // this.winSoundEl.play();
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
        playerController.reset();
        this.levelAnimation.animation.restart();
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
    upgradeToHorn: function() {
        document.querySelector('[noise-indicator]').components['noise-indicator'].upgradeLoudMini();
        document.querySelector('#horn').src = './assets/loud_mini.jpg';
        document.querySelector('#horn-noise').setAttribute('sound', {src: 'url(./assets/horn.mp3)'});
    },
    downgradeToShout: function() {
        document.querySelector('[noise-indicator]').components['noise-indicator'].downgradeShout();
        document.querySelector('#horn').src = './assets/shout.jpg';
        document.querySelector('#horn-noise').setAttribute('sound', {src: 'url(./assets/shout.mp3)'});
    },
    spawnMinis: function() {
        // <a-entity item="type: horn" gltf-model="#loud-bicycle-mini-asset" position="0 0.8 -16" scale="4 4 4"></a-entity>
        for (let i = 0; i < 3; i++) {
            const element = document.createElement('a-entity');
            element.setAttribute('item', {type: 'horn'});
            element.setAttribute('gltf-model', '#loud-bicycle-mini-asset');
            element.setAttribute('scale', '4 4 4');
            element.setAttribute('position', (i * 2.5) + ' 0.8 -' + (this.levelData.endDistance - 10));
            this.currentLevel.append(element);
        };

    },
    generateLevel: function(index) {
        const levelData = this.levelData = gameData.levels[index];
        this.laneWidth = levelData.laneWidth;
        this.lanes = levelData.amountLanes;
        if(levelData.startWithMini) this.upgradeToHorn();
        else this.downgradeToShout();
        document.querySelector('[player-controller]').components['player-controller'].setLane(levelData.startingLane);
        
        this.currentLevel = document.createElement('a-entity');
        this.level.append(this.currentLevel);
        if(levelData.spawnMinis) this.spawnMinis();
        
        this.currentLevelStreetEls = []
        let isIntersection = false;
        let spawnDistance = levelData.streetLength / 2;
        let lastSpawnPosition = 0;
        for (let i = 0; i < levelData.streetUrls.length; i++) {
            const el = document.createElement('a-entity');

            if(isIntersection) {    
                let positionZ = -(spawnDistance - levelData.streetWidth / 2);
                el.setAttribute('position', {x: 0, y: 0, z: positionZ})
                el.setAttribute('intersection', `dimensions: ${levelData.streetWidth + levelData.intersectionWidthOffset} ${levelData.streetWidth}; northeastcurb: 7.0 4.6; southwestcurb: 10 4.6; southeastcurb: 7.0 4.6; northwestcurb: 10 4.6; trafficsignal: 1 1 1 1; crosswalk: 1 1 1 1`);
                el.setAttribute('class', 'intersection');

                const rightSideStreet = document.createElement('a-entity');
                rightSideStreet.setAttribute('position', {x: (levelData.streetWidth / 2) + 18 + levelData.intersectionWidthOffset / 2, y: 0, z: positionZ})
                rightSideStreet.setAttribute('rotation', {x: 0, y: 90, z: 0})
                rightSideStreet.setAttribute('street', {length: 40, showVehicles: false})
                rightSideStreet.setAttribute('streetmix-loader', {streetmixAPIURL: SIDE_STREET_URL, showBuildings: false})
                rightSideStreet.setAttribute('class', `side-street`)  
                this.currentLevel.append(rightSideStreet);

                const left = document.createElement('a-entity');
                left.setAttribute('position', {x: -(levelData.streetWidth / 2) - 18 - levelData.intersectionWidthOffset / 2, y: 0, z: positionZ})
                left.setAttribute('rotation', {x: 0, y: 90, z: 0})
                left.setAttribute('street', {length: 40, showVehicles: false})
                left.setAttribute('streetmix-loader', {streetmixAPIURL: SIDE_STREET_URL, showBuildings: false})
                left.setAttribute('class', `side-street`)  
                this.currentLevel.append(left);

                el.halfLength = levelData.streetWidth / 2;
                lastSpawnPosition = positionZ - el.halfLength;
                spawnDistance += levelData.streetLength;
            } else {
                let positionZ = -(spawnDistance - levelData.streetLength / 2);
                el.setAttribute('position', {x: 1.5, y: 0, z: positionZ})
                el.setAttribute('street', {length: levelData.streetLength, showVehicles: false})
                el.setAttribute('streetmix-loader', {streetmixAPIURL: levelData.streetUrls[i]})
                el.setAttribute('class', `street`)  
                el.halfLength = levelData.streetLength                                                                                                                                                                                                                                                                                   / 2;
                lastSpawnPosition = positionZ - el.halfLength;
                spawnDistance += levelData.streetWidth;
            }
            isIntersection = !isIntersection;
            this.currentLevel.append(el);
            this.currentLevelStreetEls.push(el);
        }
        const el = document.createElement('a-entity');

        el.setAttribute('position', {x: 1.5, y: 0, z: lastSpawnPosition - levelData.lastBuildingOffset})
        el.setAttribute('rotation', {x: 0, y: 180, z: 0})
        el.setAttribute('gltf-model', levelData.lastBuildingAssetId)
        this.currentLevel.append(el);
    },
    removeLevel: function() {
        this.interactablePool.returnAll();
        this.bikePool.returnAll();
        this.smogPool.returnAll();
        this.currentLevel.parentNode.removeChild(this.currentLevel);
        this.currentLevel = null;
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
        const street = this.currentLevelStreetEls[index];
        return street ? street.object3D : null;
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
