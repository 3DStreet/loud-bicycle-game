import { Vector3 } from 'super-three';
import { gameData, SIDE_STREET_URL } from "./level-data";
import { playerController } from './player-controller';
import { lerp } from './helpers/math'

export const GAME_STATES = {
    PLAYING: 0,
    PAUSED: 1,
    END: 2,
    MENU: 3,
}

export const avatarData = [
    {
        type: 'female',
        id: '#cyclist1-asset'
    },
    {
        type: 'male',
        id: '#cyclist2-asset'
    },
]

export let GAME_STATE = GAME_STATES.MENU;

const SIDE_STREET_LENGTH = 160;

export let gameManager;

export let gameScore = 0;

export let finalAnimationTimeMS = 2000;

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
        this.currentAvatarIndex = -1;
        this.currentShoutIndex = 0;

        setTimeout(() => {
            this.interactablePool = document.querySelector('[interactable-pool]').components['interactable-pool'];
            this.smogPool = document.querySelector('[smog-pool]').components['smog-pool'];
            this.bikePool = document.querySelector('[bike-train-pool]').components['bike-train-pool'];
            this.level = document.querySelector('#level');
            this.levelAnimation = level.components.animation;
            this.gameScoreLabel = document.querySelector('#score');
            this.smogAudio = this.el.components.sound;

            this.ambientAudio = document.querySelector('#ambient-sound-a');
            this.musicAudio = document.querySelector('#music-1');

            document.querySelector('#model').setAttribute('animation__position',
                {'property': 'position', 'to': {x: -3, y: 0, z: -5}, 'startEvents': 'playend', 'dur': finalAnimationTimeMS});
            document.querySelector('#model').setAttribute('animation__rotation',
                {'property': 'rotation', 'to': '0 90 0', 'startEvents': 'playend', 'dur': finalAnimationTimeMS});

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
            const hideMenu = urlParams.get('menu');
            const isCheat = urlParams.get('cheat');
            
            if(isCheat) {
                AFRAME.ANIME.speed = gameData.cheatSpeed;
                document.querySelector('[player-controller]').setAttribute('player-controller', {defaultLives: 1000})
                document.querySelector('[player-controller]').components['player-controller'].lives = 1000;
            }
            
            // Important for initial setup
            const levelParam = Number(urlParams.get('level')) || 0;
            this.generateLevel(levelParam);
            if(hideMenu) {
                this.playLevel();
                setMenuEnabled(false);
            } else {
                setTimeout(() => {
                    this.removeLevel();
                }, 1000);
            }

            this.tick = AFRAME.utils.throttleTick(this.tick, 500, this);
        }, 100);
    },
    disableAmbientAudio: function() {
        // this.originalAmbientVolume = this.ambientAudio.data.volume;
        // this.ambientAudio.el.setAttribute('sound', {volume: 0.0})     
        // this.ambientAudio.pause();
        // this.musicAudio.pause();     
        this.ambientAudio.volume = 0.0;
        this.musicAudio.volume = 0.0;
    },
    enableAmbientAudio: function() {
        this.ambientAudio.volume = 0.2;   
        this.musicAudio.volume = 0.1;
    },
    pauseAmbientAudio: function() {
        this.ambientAudio.pause();
        this.musicAudio.pause();
    },
    resumeAmbientAudio: function() {
        this.ambientAudio.play();
        this.musicAudio.play();
    },
    stopAmbientAudio: function() {
        this.ambientAudio.stop();
        this.musicAudio.stop();
    },
    playEndAnimation: function() {
        document.querySelector('#model').emit('playend', null, false);
    },
    endLevel: function() {
        this.playEndAnimation();
        this.stopLevel();
        this.winSoundEl.play();
        setTimeout(() => {
            setEndScreenEnabled(true, this.levelData.getLevelEndMessage(this.bikeMemberCount));
            this.removeLevel();
            document.querySelector('#game-menu-bg').style.opacity = 1;
        }, finalAnimationTimeMS);
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
        document.querySelector('#game-menu-bg').style.opacity = 1;
    },
    togglePauseLevel: function() {
        if(!(GAME_STATE === GAME_STATES.PLAYING || GAME_STATE === GAME_STATES.PAUSED)) return;
        GAME_STATE = GAME_STATE === GAME_STATES.PAUSED ? GAME_STATES.PLAYING : GAME_STATES.PAUSED;
        if(GAME_STATE === GAME_STATES.PAUSED) {
            this.levelAnimation.animation.pause();
            this.el.sceneEl.pause();
            playerController.setAnimationPaused(true);
            this.pauseAmbientAudio();
            setPauseEnabled(true);
        } else {
            this.levelAnimation.animation.play();
            this.el.sceneEl.play();
            playerController.setAnimationPaused(false);
            this.resumeAmbientAudio();
            setPauseEnabled(false);
        }
    },
    failLevel: function() {
        this.stopLevel();
        setEndScreenEnabled(true, "Try again!");
        // this.winSoundEl.play();
        
        this.removeLevel();
    },
    stopLevel: function() {
        this.ambientAudio.pause();
        this.musicAudio.pause();
        this.musicAudio.currentTime = 0;

        this.levelAnimation.animation.pause();
        this.interactablePool.stop();
        this.smogPool.stop();
        this.bikePool.stopSpawn();
        GAME_STATE = GAME_STATES.END;
    },
    getAvatarObject: function() {
        let index = Math.floor(Math.random() * avatarData.length);
        while(index === this.currentAvatarIndex) {
            index = Math.floor(Math.random() * avatarData.length);
        }
        this.currentAvatarIndex = index;
        return avatarData[index];
    },
    playShout: function() {
        if(this.isLoudMini) {
            let audio = document.querySelector('#horn-sound');
            audio.play();
        } else {
            let path = `#shout-${this.avatarObject.type}-sound-${this.currentShoutIndex}`;
            let audio = document.querySelector(path);
            audio.play();
            this.currentShoutIndex = (this.currentShoutIndex + 1) % 3;
        }
    },
    stopShout: function() {
        if(this.isLoudMini) {
            let audio = document.querySelector('#horn-sound');
            audio.pause();
        }
    },
    playGetHurt: function() {
        if(this.bikeMemberCount > 0) {
            let path = `#ouch-baby-sound-${Math.floor(Math.random() * 2)}`; // 0 or 1
            let audio = document.querySelector(path);
            audio.play();
        } else {
            let path = `#ouch-${this.avatarObject.type}-sound`;
            let audio = document.querySelector(path);
            audio.play();
        }
    },
    playLevel: function() {
        this.avatarObject = this.getAvatarObject();
        playerController.setAvatar(this.avatarObject.id);
        this.currentShoutIndex = 0;

        this.ambientAudio = document.querySelector(this.levelData.ambientSoundId)
        this.ambientAudio.volume = 0.2;
        this.ambientAudio.play();

        this.musicAudio = document.querySelector(this.levelData.musicSoundId)
        this.musicAudio.volume = 0.1;
        this.musicAudio.play();

        gameScore = 0;
        this.bikeMemberCount = 0;
        this.gameScoreLabel.innerText = gameScore;
        playerController.reset();
        this.levelAnimation.animation.restart();
        this.interactablePool.start();
        this.smogPool.start();
        if(!this.levelData.disableBikePool) this.bikePool.startSpawn();
        GAME_STATE = GAME_STATES.PLAYING;
        document.querySelector('#game-menu-bg').style.opacity = 0;
    },
    increaseScore: function() {
        gameScore += SMOG_SCORE;
        this.gameScoreLabel.innerText = gameScore;
        this.smogAudio.playSound();
    },
    upgradeToHorn: function() {
        this.isLoudMini = true;
        document.querySelector('[noise-indicator]').components['noise-indicator'].upgradeLoudMini();
        document.querySelector('#horn img').src = './assets/loud_mini.png';
        // document.querySelector('#horn-noise').setAttribute('sound', {src: 'url(./assets/horn.webm)'});
    },
    setRaygunActive: function(b) {
        document.querySelector('#ray').style.display = b ? 'unset' : 'none';
        document.querySelector('#ray-meter').style.display = b ? 'unset' : 'none';
        const rayNoise = document.querySelector('#ray-noise')
        if(rayNoise && rayNoise.components['noise-meter'])
            rayNoise.components['noise-meter'].enabled = b;
    },
    downgradeToShout: function() {
        document.querySelector('[noise-indicator]').components['noise-indicator'].downgradeShout();
        document.querySelector('#horn img').src = './assets/shout.svg';
        // document.querySelector('#horn-noise').setAttribute('sound', {src: 'url(./assets/shout.webm)'});
    },
    spawnMinis: function() {
        // <a-entity item="type: horn" gltf-model="#loud-bicycle-mini-asset" position="0 0.8 -16" scale="4 4 4"></a-entity>
        for (let i = 0; i < 3; i++) {
            const element = document.createElement('a-entity');
            element.setAttribute('item', {type: 'horn'});
            element.setAttribute('gltf-model', '#loud-bicycle-mini-asset');
            element.setAttribute('scale', '6 6 6');
            element.setAttribute('position', (i * 3.3) + ' 0.8 -' + (this.levelData.endDistance - 10));
            this.currentLevel.append(element);
        };
    },
    spawnRaygun: function() {
        for (let i = 0; i < 3; i++) {
            const element = document.createElement('a-entity');
            element.setAttribute('item', {type: 'raygun'});
            element.setAttribute('gltf-model', '#prop-raygun-asset');
            element.setAttribute('scale', '2 2 2');
            element.setAttribute('position', (i * 3.3) + ' 0.8 -' + (this.levelData.endDistance - 20));
            this.currentLevel.append(element);
        };
    },
    spawnHearts: function() {
        let i = 2;
        const element = document.createElement('a-entity');
        element.setAttribute('item', {type: 'heart'});
        element.setAttribute('gltf-model', '#prop-heart-asset');
        element.setAttribute('scale', '1 1 1');
        element.setAttribute('position', (i * 3.3) + ' 0.8 -' + (this.levelData.endDistance - 134));

        this.currentLevel.append(element);
    },
    generateLevel: function(index) {
        const levelData = this.levelData = gameData.levels[index];
        this.laneWidth = levelData.laneWidth;
        this.lanes = levelData.amountLanes;
        this.isLoudMini = false;
        if(levelData.startWithMini) this.upgradeToHorn();
        else this.downgradeToShout();
        this.setRaygunActive(!!levelData.startWithRaygun);
        document.querySelector('[player-controller]').components['player-controller'].setLane(levelData.startingLane);
        
        this.currentLevel = document.createElement('a-entity');
        this.level.append(this.currentLevel);
        if(levelData.spawnMinis) this.spawnMinis();
        if(levelData.spawnRaygun) this.spawnRaygun();
        if(levelData.spawnHearts) this.spawnHearts();

        // Lights & Fog
        let scene = document.querySelector('a-scene');
        this.currentNearFog = levelData.fogNear;
        scene.setAttribute('fog', {'near': levelData.fogNear, 'far': levelData.fogFar, 'color': levelData.fogColor});
        let ambientLight = document.querySelector('#ambient-light');
        ambientLight.setAttribute('light', {'color': levelData.ambientLightColor});
        let directionalLight = document.querySelector('#directional-light');
        directionalLight.setAttribute('light', {'color': levelData.directionalLightColor, 'intensity': levelData.directionalLightIntensity});
        directionalLight.setAttribute('position', levelData.directionalLightPosition);
        let spotLight = document.querySelector('#spot-light');
        spotLight.setAttribute('visible', levelData.hasBikeLight);


        this.currentLevelStreetEls = []
        let isIntersection = false;
        let spawnDistance = levelData.streetLength / 2;
        let lastSpawnPosition = 0;
        for (let i = 0; i < levelData.streetUrls.length * 2; i++) {
            const el = document.createElement('a-entity');

            if(isIntersection) {    
                let positionZ = -(spawnDistance - levelData.streetWidth / 2);
                el.setAttribute('position', {x: 0, y: 0, z: positionZ})
                el.setAttribute('intersection', `dimensions: ${levelData.streetWidth + levelData.intersectionWidthOffset} ${levelData.streetWidth}; northeastcurb: ${levelData.intersectionCurbMargins.right} ${levelData.intersectionCurbMargins.top}; southwestcurb: ${levelData.intersectionCurbMargins.left} ${levelData.intersectionCurbMargins.bottom}; southeastcurb: ${levelData.intersectionCurbMargins.right} ${levelData.intersectionCurbMargins.bottom}; northwestcurb: ${levelData.intersectionCurbMargins.left} ${levelData.intersectionCurbMargins.top}; trafficsignal: 1 1 1 1; crosswalk: 1 1 1 1`);
                el.setAttribute('class', 'intersection');

                const rightSideStreet = document.createElement('a-entity');
                rightSideStreet.setAttribute('position', {x: (levelData.streetWidth / 2) + ((SIDE_STREET_LENGTH / 2)) + levelData.intersectionWidthOffset / 2, y: 0, z: positionZ})
                rightSideStreet.setAttribute('rotation', {x: 0, y: 90, z: 0})
                rightSideStreet.setAttribute('street', {length: SIDE_STREET_LENGTH, showVehicles: false})
                rightSideStreet.setAttribute('streetmix-loader', {streetmixAPIURL: SIDE_STREET_URL, showBuildings: false})
                rightSideStreet.setAttribute('class', `side-street`)  
                this.currentLevel.append(rightSideStreet);

                const left = document.createElement('a-entity');
                left.setAttribute('position', {x: -(levelData.streetWidth / 2) - ((SIDE_STREET_LENGTH / 2)) - levelData.intersectionWidthOffset / 2, y: 0, z: positionZ})
                left.setAttribute('rotation', {x: 0, y: 90, z: 0})
                left.setAttribute('street', {length: SIDE_STREET_LENGTH, showVehicles: false})
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
                el.setAttribute('streetmix-loader', {streetmixAPIURL: levelData.streetUrls[Math.floor(i/2)]})
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
        if(levelData.lastBuildingAdditionalAssetId) {
            const additionalEl = document.createElement('a-entity');

            additionalEl.setAttribute('position', {x: -2.33, y: 5.477, z: lastSpawnPosition - levelData.lastBuildingOffset + 6})
            additionalEl.setAttribute('rotation', {x: 90, y: 0, z: 0})
            additionalEl.setAttribute('scale', {x: 9.520, y: 9.520, z: 9.520})
            additionalEl.setAttribute('gltf-model', levelData.lastBuildingAdditionalAssetId)

            this.currentLevel.append(additionalEl);
        }

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
    clearFog: function() {
        // this.targetNearFog = 400;
        // this.lerpFog = true;
        // this.lerpFogTimer = 10.0;
        // this.lerpFogAmount = 0.0;
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
    tick: function(t, dt) {
        if(GAME_STATE === GAME_STATES.PLAYING && this.getLevelPosition() > this.levelData.endDistance) {
            this.endLevel();
        }

        if(this.lerpFog && GAME_STATE === GAME_STATES.PLAYING) {
            if(this.lerpFogTimer >= 0) {
                this.currentNearFog = lerp(this.levelData.fogNear, this.targetNearFog, this.lerpFogAmount);
                this.lerpFogAmount = Math.min(1.0, this.lerpFogAmount + dt/1000);
                this.lerpFogTimer -= dt/1000;
            } else {
                this.currentNearFog = lerp(this.levelData.fogNear, this.targetNearFog, this.lerpFogAmount);
                this.lerpFogAmount -= dt/1000;
                if(this.lerpFogAmount <= 0) {
                    this.lerpFog = false;
                }
            }

            let scene = document.querySelector('a-scene');
            scene.setAttribute('fog', {'near': this.currentNearFog});

        }
    }
});