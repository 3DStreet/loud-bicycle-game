import { Vector3 } from 'super-three';
import { gameData, SIDE_STREET_URL } from "./level-data";
import { playerController } from './player-controller';
import { lerp } from './helpers/math'
import { getRandomMessage } from './messages';


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
    {
        type: 'female',
        id: '#cyclist4-asset'
    },
    {
        type: 'male',
        id: '#cyclist5-asset'
    },
    {
        type: 'female',
        id: '#cyclist-dutch-asset'
    },
]

export let GAME_STATE = GAME_STATES.MENU;

const SIDE_STREET_LENGTH = 160;

export let gameManager;

export let gameScore = 0;

// export let finalAnimationTimeMS = 2000;
export let finalAnimationTimeMS = 3500;

const SMOG_SCORE = 1;

const FOG_FADE_OUT_DURATION = 9.0;

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
        this.loseSoundEl = document.querySelector('#game-over');
        this.currentAvatarIndex = -1;
        this.currentShoutIndex = 0;
        this.lastKillVehicle = null;
        this.shareText = 'Can you keep the kids safe in the Loud Bicycle Game?';
        this.appendToLink = '';

        // Add timer properties
        this.timerTitle = null;
        this.timerSubtitle = null;
        this.timerSubtitle2 = null;
        this.tutorialTimer1 = null;
        this.tutorialTimer2 = null;

        this.justBeatLevel = null;
        this.userStars = this.getUserStars();
        this.checkHandlebarEnabled(this.userStars);
        this.justBeat12Stars = false;
//                  for debugging if you want to fail right away
                    // instant fail:
                    // setTimeout(() => {
                    //     this.failLevel();
                        
                    // }, 1000);

                    // for debugging if you want to end screen right away
                    // setTimeout(() => {
                    //     this.endLevel();
                        
                    // }, 1000);



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
                const button = document.querySelector(id);
                button.addEventListener('click', () => {
                    // if(button.classList.contains('level-button-grayscale')) return;
                    this.generateLevel(i);
                    this.playLevel();
                    setMenuEnabled(false);
                    setLevelSelectionEnabled(false)
                })
            }
            document.querySelector('#level-5-button').addEventListener('click', () => {
                // this.generateLevel(3);
                // this.playLevel();
                // setMenuEnabled(false);
                // setLevelSelectionEnabled(false)

                window.open('https://loudbicycle.com/collections/shop', '_blank');
            })

            // create the button action for the very first play button.
            const id = `#tutorial-play`;
            document.querySelector(id).addEventListener('click', () => {
                this.generateLevel(0);
                this.playLevel();
                setMenuEnabled(false);
                setLevelSelectionEnabled(false);
                // set to intro-modal to class to disabled
                document.querySelector('#intro-modal').classList.add('disabled');
            })
                       
           

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

            // this.tick = AFRAME.utils.throttleTick(this.tick, 500, this);

        }, 100);
    },
    disableAmbientAudio: function() {
        this.ambientAudio.volume = 0.0;
        this.musicAudio.volume = 0.15;
    },
        enableAmbientAudio: function() {
        this.ambientAudio.volume = 0.4;
        this.musicAudio.volume = 0.2;
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
    updateEndScreenImages: function(levelId, currentStars) {
        // Get the image elements
        let levelImage = document.getElementById("level-end-image");
        let starsImage = document.getElementById("level-end-stars");
    
        // Update the src attributes
        levelImage.src = `assets/levels/${levelId}.png`;
        starsImage.src = `assets/levels/0-stars.png`;
        levelImage.style.display = "block";
        starsImage.style.display = "block";
    
        // loop setting star images from 0 to currentStars, with 200ms in between each switch
        let starCnt = 1;
        const starInterval = setInterval(() => {
            // Now using a lambda function (arrow function) to maintain context (the value of `this`)
            this.updateStarImage(starsImage, starCnt, currentStars, starInterval);
            starCnt++;
        }, 300);
    },
    updateStarImage: function(starsImage, starCnt, currentStars, starInterval) {
        // update the star image one at a time. play the pop sound
        this.powerupAudio = document.querySelector('#pop-sound');
        this.powerupAudio.currentTime = 0; // Reset the audio to the start
        this.powerupAudio.play();
        starsImage.src = `assets/levels/${starCnt}-stars.png`;
        if (starCnt >= currentStars) {
            clearInterval(starInterval);
        }
    },
    // this is when you win winlevel (as apposed to fail)
    endLevel: function() {
        this. clearTitleTimers();

        this.playEndAnimation();

        // stop the sound, but not the music
        this.stopLevel(false);
        
        // Calculate user stars for the completed level
        let currentLevel = this.getLevelIndex(); // Get the index of the completed level
        let bikeMemberCount = this.bikeMemberCount;
        let lives = playerController.lives;

        // if you did better than the last time, update your score
        let newStars = this.calculateUserStars(currentLevel, bikeMemberCount, lives);
        let currentStars = this.userStars[`level${currentLevel + 1}`];
        // check if you just unlocked a new level, beat a level you never beat before
        if ((currentStars === null || currentStars === 0 ) && newStars > 0){
            console.log("just beat level: " + currentLevel + " for the first time");
            this.justBeatLevel = currentLevel + 1;
        }


        // Send the event to Google Analytics
        console.log("Logging amazing news that a level was beaten.");
        gtag('event', 'beat_level_' + currentLevel, {
            'event_category': 'game',
            'event_label': 'Level ' + currentLevel,
            'value': newStars  // Optional. You can use this to assign a numeric value to the event.
        });
        

        this.justBeat12Stars = false;
        if (currentStars === null || newStars > currentStars) {
            this.userStars[`level${currentLevel + 1}`] = newStars;
            this.saveUserStars();

            // check if all three stars are now unlocked
            if (this.checkThreeStars(this.userStars)) {
                console.log("You beat ALL the levels with THREE stars!!!");
                gtag('event', 'beat_level_all', {
                    'event_category': 'game',
                    'event_label': '12 stars',
                    'value': playerController.hitCounter  // Optional. You can use this to assign a numeric value to the event.
                });
                this.justBeat12Stars = true;
            }
                
        }

        // set level-end-image-container to be enabled
        let levelEndImageContainer = document.getElementById("level-end-image-container");
        levelEndImageContainer.classList.remove("gone");

        let levelEndImageContainerFail = document.getElementById("level-end-image-container-fail");
        levelEndImageContainerFail.classList.add("gone");        

        // update z-index to 13
        // levelEndImageContainer.style.zIndex = 13;

        let congratsAnimation = document.getElementById("congrats-animation");
        // set timeout for .5 seconds
        setTimeout(() => {

            // enable the congrats-animation div
            congratsAnimation.classList.remove("disabled");
            congratsAnimation.classList.add("enabled");

            this.updateEndScreenImages(this.levelData.nameId, newStars);
        }, 500);

        setTimeout(() => {
            // set replay-button-text
            let replayButtonText = document.getElementById("replay-button-text");
            replayButtonText.innerText = "Replay";

            // set continue-button-text
            let continueButtonText = document.getElementById("continue-button-text");
            continueButtonText.innerText = "Continue";

            congratsAnimation.classList.remove("enabled");
            congratsAnimation.classList.add("disabled");


            setEndScreenEnabled(true, this.levelData.getLevelEndMessage(this.bikeMemberCount));

            // if its the voting thing - make that work plz
            // Check if the elements exist before adding event listeners
            var yesButton = document.getElementById('yesBtn');
            var noButton = document.getElementById('noBtn');
            var ballotButtons = document.querySelector('.ballot-buttons');
            var results = document.getElementById('results');

            if (yesButton && noButton) {
                yesButton.addEventListener('click', showResults);
                noButton.addEventListener('click', showResults);
            }

            function showResults() {
                // Hide the buttons if they exist
                if (ballotButtons) {
                    ballotButtons.style.display = 'none';
                }

                // Show the results if it exists
                if (results) {
                    results.style.display = 'block';
                }
            }




            this.shareBasedOnLevel(currentLevel);

            // change this here to be class removed
            this.removeLevel();
            document.querySelector('#game-menu-bg').style.opacity = 1;

            // if you won any new things, then give them to you now:
            setTimeout(() => {
                            // log current level
                console.log("current level: " + currentLevel);

                // remove highlights
                const handlebarIds = ['handlebar-mini', 'handlebar-raygun', 'handlebar-screws'];
                handlebarIds.forEach(id => {
                    const element = document.getElementById(id).querySelector('img');
                    element.classList.remove('handlebar-highlighted');
                });

                let keyElement = null;

                // switch case on current level
                switch (currentLevel) {
                    case 0:
                            keyElement = document.getElementById('handlebar-mini').querySelector('img');
                            break;
                    case 1:
                            keyElement = document.getElementById('handlebar-raygun').querySelector('img');
                            break;
                    case 3:
                            keyElement = document.getElementById('handlebar-screws').querySelector('img');
                            break;
                }

                if (keyElement != null ){
                    keyElement.classList.remove('handlebar-disabled');
                    keyElement.classList.add('handlebar-enabled');
                    keyElement.classList.add('handlebar-highlighted');
                    this.powerupAudio = document.querySelector('#sparkle-sound');
                    this.powerupAudio.currentTime = 0; // Reset the audio to the start
                    this.powerupAudio.play();
                }

                        
        
                }, 300);

            
        }, finalAnimationTimeMS);
    },
    shareBasedOnLevel: function(currentLevel) {
        switch(currentLevel) {
            case 0:
                this.shareText = "I won Loud Mini playing the Loud Bicycle Game!";
                this.appendToLink = '?v=f2s6s';
                break;
            case 1:
                this.shareText = "I won a ray gun in the Loud Bicycle Game!";
                this.appendToLink = '?v=91sna';
                break;
            case 2:
                this.shareText = "I voted for protected bike lanes in the Loud Bicycle Game!";
                this.appendToLink = '';
                break;
            case 3:
                this.shareText = "I won the whole Loud Bicycle Game!";
                this.appendToLink = '';
                break;
        }
        let shareTextSpan = document.getElementById("share-text-span");
        shareTextSpan.innerText = "win";

    },    
    shareFailureBasedOnVehicle: function(lastKillVehicle) {
        switch(lastKillVehicle) {
            case 'BMW':
                this.shareText = "I got run over by a BMW playing the Loud Bicycle Game.";
                this.appendToLink = '?v=x1abc';
                break;
            case 'SUV':
                this.shareText = "I got run over by an SUV playing the Loud Bicycle Game.";
                this.appendToLink = '?v=y2def';
                break;
            case 'Taxi':
                this.shareText = "I got run over by a Taxi playing the Loud Bicycle Game.";
                this.appendToLink = '?v=z3ghi';
                break;
            case 'Truck':
                this.shareText = "I got run over by a Truck playing the Loud Bicycle Game.";
                this.appendToLink = '?v=a4jkl';
                break;
            case 'Unknown':
                this.shareText = "I got run over playing the Loud Bicycle Game.";
                this.appendToLink = '?v=b5mno';
                break;
        }        // Constructing the full message     
        
        // update the share-text-span to share your story
        let shareTextSpan = document.getElementById("share-text-span");
        shareTextSpan.innerText = "story";


    },
    
    getLevelIndex: function() {
        // Find the index of the completed level in the gameData.levels array
        for (let i = 0; i < gameData.levels.length; i++) {
            if (this.levelData === gameData.levels[i]) {
                return i;
            }
        }
        return -1; // If levelData not found in the gameData.levels array
    },
    
    quitLevel: function() {
        console.log("quitLevel");
        this.stopLevel(true);
        
        this.clearTitleTimers();

        this.musicAudio.pause();
        this.musicAudio.currentTime = 0;

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
    // when you lose the game
    failLevel: function() {

        // disable the level-end-image-container div
        let levelEndImageContainer = document.getElementById("level-end-image-container");
        levelEndImageContainer.classList.add("gone");

        let levelEndImageContainerFail = document.getElementById("level-end-image-container-fail");
        levelEndImageContainerFail.classList.remove("gone");

        this.stopLevel(true);
        this.clearTitleTimers();
        console.log("failLevel");
        console.log("hitCounter: " + playerController.hitCounter);
        setEndScreenEnabled(true, getRandomMessage('fail', playerController.hitCounter, this.lastKillVehicle));


        let currentLevel = this.getLevelIndex(); // Get the index of the completed level

        // Send the event to Google Analytics
        console.log("Logging sad news that a level was lost.");
        gtag('event', 'lose_level_' + currentLevel, {
            'event_category': 'game',
            'event_label': 'Level ' + currentLevel,
            'value': playerController.hitCounter  // Optional. You can use this to assign a numeric value to the event.
        });
        

        //change the fail image to the vehicle:
        let levelImageFail = document.getElementById("level-end-image-fail-image");
        levelImageFail.src = `./assets/screenshots/${this.lastKillVehicle}.jpg`;

        this.loseSoundEl.play();
        // <img class="level-end-images" src="./assets/loud_mini.png">                                        
                                
        let levelImage = document.getElementById("level-end-image");
        let starsImage = document.getElementById("level-end-stars");

        // Update the src attributes
        levelImage.src = `./assets/loud_mini.png`;
        levelImage.style.display = 'inline-block';
        starsImage.style.display = 'none';

        // set replay-button-text
        let replayButtonText = document.getElementById("replay-button-text");
        replayButtonText.innerText = "Retry";

        // set continue-button-text
        let continueButtonText = document.getElementById("continue-button-text");
        continueButtonText.innerText = "Levels";
        
        this.removeLevel();

        console.log("lastKillVehicle: " + this.lastKillVehicle);
        this.shareFailureBasedOnVehicle(this.lastKillVehicle);

    },
    stopLevel: function(shouldMusicStop) {
        this.ambientAudio.pause();
        // The music stops only if shouldMusicStop is true
        if (shouldMusicStop) {
            this.musicAudio.pause();
            this.musicAudio.currentTime = 0;
            // this.musicAudio.currentTime = 17;
        }
    
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
            let path;
            if(this.avatarObject && this.avatarObject.type)
                path = `#shout-${this.avatarObject.type}-sound-${this.currentShoutIndex}`;
            else 
                path = '#shout-female-sound-0';
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
        if(this.bikeMemberCount > 0 && !this.levelData.bikePoolIsAdult) {
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
        // log the avator object chosen
        console.log("avatarObject: ");
        console.log(this.avatarObject)
        playerController.setAvatar(this.avatarObject.id);
        this.currentShoutIndex = 0;

        this.ambientAudio.pause();
        this.ambientAudio = document.querySelector(this.levelData.ambientSoundId)
        this.ambientAudio.volume = 0.2;
        this.ambientAudio.play();

        // reset the previous song
        this.musicAudio.pause();
        this.musicAudio.currentTime = 0;
        // this.musicAudio.currentTime = 17;

        // start playing the new song.
        this.musicAudio = document.querySelector(this.levelData.musicSoundId)
        this.musicAudio.volume = 0.4;
        // this.musicAudio.currentTime = 17;
        // maybe this one isn't needed
        this.musicAudio.currentTime = 0;
        this.musicAudio.play();
        

        // flash the UI elemets for the tutorial
        if (this.levelData.tutorial) {
            this.blinkIcon('#bell', 3500, 17000); // Start blinking the bell (named shout accidentally)
            this.blinkIcon('#main', 2000, 22000);  // Start blinking the #horn icon
            this.blinkSwipeInstrucions();

            // set timeout for the text instructions to pick shout to stay safe

            this.timerSubtitle2 = setTimeout(() => {
                console.log('starting up the little window');
                    document.querySelector('#title').style.display = 'none';
                    document.querySelector('#meta-title-container').style.display = 'flex';
                    document.querySelector('#subtitle').innerHTML = 'Shout to stop people running you over';
                    document.querySelector('#subtitle').style.display = 'flex';

                    this.tutorialTimer1 = setTimeout(() => {
                        document.querySelector('#meta-title-container').style.display = 'none';
                    }
                    , 4000);
                }
            , 22000);
        }

        this.blinkTitle();
                
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
        document.querySelector('#main img').src = './assets/loud_mini.png';
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
        document.querySelector('#main img').src = './assets/shout.svg';
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
            element.setAttribute('position', (i * 3.3) + ' 0.8 -' + (this.levelData.endDistance - 2));
            this.currentLevel.append(element);
        };
    },
    spawnHearts: function() {
        let i = 2;
        const element = document.createElement('a-entity');
        element.setAttribute('item', {type: 'heart'});
        element.setAttribute('gltf-model', '#prop-heart-asset');
        element.setAttribute('scale', '1 1 1');
        // element.setAttribute('position', (i * 3.3) + ' 0.8 -' + (this.levelData.endDistance - 134));
        element.setAttribute('position', (i * 3.3) + ' 0.8 -' + (this.levelData.endDistance - 54 - 3));

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
        this.currentFarFog = levelData.fogFar;
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

        const finishEl = document.createElement('a-entity');

        finishEl.setAttribute('position', {x: 1.5, y: 0, z: lastSpawnPosition})
        finishEl.setAttribute('rotation', {x: 0, y: 0, z: 0})
        finishEl.setAttribute('gltf-model', '#prop-finish-asset')

        this.currentLevel.append(finishEl);
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
        console.log("we are clearning the fog!");
        let fogPushAmount = 60;

        this.targetFarFog = this.currentFarFog + fogPushAmount;
        this.targetNearFog = this.currentNearFog + fogPushAmount + 500;

        let directionalLight = document.querySelector('#directional-light');

        // brighten the lights when the fog goes away
        directionalLight.setAttribute('light', 'intensity:3');
        // bring the fog back in ten steps

        // First change immediately sets intensity to 3.0
        // Second change reduces intensity to 2.74
        setTimeout(() => {
            directionalLight.setAttribute('light', 'intensity:2.74');
        }, 1000); // 2 seconds after execution
        
        // Continue reducing intensity
        setTimeout(() => {
            directionalLight.setAttribute('light', 'intensity:2.48');
        }, 1500); // 3 seconds after execution
        
        setTimeout(() => {
            directionalLight.setAttribute('light', 'intensity:2.22');
        }, 2000); // 4 seconds after execution
        
        setTimeout(() => {
            directionalLight.setAttribute('light', 'intensity:1.96');
        }, 2500); // 5 seconds after execution
        
        setTimeout(() => {
            directionalLight.setAttribute('light', 'intensity:1.7');
        }, 3000); // 6 seconds after execution
        
        setTimeout(() => {
            directionalLight.setAttribute('light', 'intensity:1.44');
        }, 3500); // 7 seconds after execution
        
        setTimeout(() => {
            directionalLight.setAttribute('light', 'intensity:1.18');
        }, 4000); // 8 seconds after execution
        
        setTimeout(() => {
            directionalLight.setAttribute('light', 'intensity:0.92');
        }, 4500); // 9 seconds after execution
        
        setTimeout(() => {
            directionalLight.setAttribute('light', 'intensity:0.66');
        }, 5000); // 10 seconds after execution


        this.lerpFog = true;
        this.lerpFogUp = true;
        this.lerpFogTimer = FOG_FADE_OUT_DURATION;
        this.lerpFogAmount = 0.0;
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

    // Function to toggle the border color of one icon div
    toggleIconBorder(selector) {
        const iconDiv = document.querySelector(selector);
        // blink the border
        iconDiv.style.border = iconDiv.style.border === '2px solid rgb(255, 175, 83)' ? 'none' : '2px solid rgb(255, 175, 83)';
        iconDiv.style.boxShadow = '0 0 40px rgb(255, 175, 83, 1.0)';
        iconDiv.style.height = iconDiv.style.height === '110px' ? '120px' : '110px';
        iconDiv.style.width = iconDiv.style.width === '110px' ? '120px' : '110px';
    },
    // Start blinking an icon and stop after a certain duration
    blinkSwipeInstrucions() {
        this.tutorialTimer1 = setTimeout(() => {
            // Stop the blinking after blinkDuration milliseconds
            setTimeout(() => {
                document.querySelector('#instructions2').style.display = 'none';
            }, 9000);
        this.tutorialTimer1 = document.querySelector('#instructions2').style.display = 'flex';
        }, 3000);
    },
    blinkTitle() {
        // change the contenxt of the title and subtitle to be the meta title and subtitle
        let titleText = document.getElementById("title");
        let subtitleText = document.getElementById("subtitle");
        titleText.innerHTML = this.levelData.title;
        subtitleText.innerHTML = this.levelData.subtitle;
        
        document.querySelector('#meta-title-container').style.display = 'flex';
        document.querySelector('#title').style.display = 'flex';
        
        // first remove the subtitle
        document.querySelector('#subtitle').style.display = 'none';

        this.timerSubtitle = setTimeout(() => {
            // Stop the blinking after blinkDuration milliseconds
            this.timerTitle = setTimeout(() => {
                // console.log("setting to non");
                document.querySelector('#meta-title-container').style.display = 'none';
            }, 7000);
        document.querySelector('#subtitle').style.display = 'flex';
        }, 13500);  
    },
    // function to clear the title timers
    clearTitleTimers() {

        let mtcnt = document.querySelector('#meta-title-container');
        if (mtcnt){
            mtcnt.style.display = 'none';
        }
        let inst = document.querySelector('#instructions2');
        if (inst){
            inst.style.display = 'none';
        }

        clearTimeout(this.timerSubtitle);
        clearTimeout(this.timerSubtitle2);
        clearTimeout(this.timerTitle);
        clearTimeout(this.tutorialTimer1);
        clearTimeout(this.tutorialTimer2);
    },
    // Start blinking an icon and stop after a certain duration
    blinkIcon(selector, blinkDuration = 2000, blinkStartDelay = 0) {
        setTimeout(() => {
            const blinkingInterval = setInterval(() => this.toggleIconBorder(selector), 200);

            // Stop the blinking after blinkDuration milliseconds
            setTimeout(() => {
                clearInterval(blinkingInterval);
                // Clear border and boxShadow styles after blinking
                const iconDiv = document.querySelector(selector);
                iconDiv.style.border = 'none';
                iconDiv.style.boxShadow = 'none';
                iconDiv.style.height = '120px';
            }, blinkDuration);
        }, blinkStartDelay);
    },


    // get the initial user stars from localStorage, or create it
    getUserStars: function() {
        let userStars = localStorage.getItem("userStars");

        if (userStars) {
            // Parse stored JSON string to object
            return JSON.parse(userStars);
        } else {
            // First time running, set initial stars
            let initialStars = { level1: null, level2: null, level3: null, level4: null };

            // Save initial stars to localStorage .... seems like this one isn't needed???
            localStorage.setItem("userStars", JSON.stringify(initialStars));

            return initialStars;
        }
    },
    checkThreeStars: function(stars) {
        console.log("checking if you just beat all the levels");
        for (let level in stars) {
            if (stars[level] !== 3) {
                return false;
            }
        }
        return true;
    },
    checkHandlebarEnabled: function(stars) {
        console.log("checking if we need to enable some handlebar images");
        let keyElement = null;
        for (let level in stars) {
            // check if stars[level] is NOT null
            if (stars[level] !== null) {
                // switch case on current level
                keyElement = null;
                switch (level) {
                    case 'level1':
                            keyElement = document.getElementById('handlebar-mini').querySelector('img');
                            break;
                    case 'level2':
                            keyElement = document.getElementById('handlebar-raygun').querySelector('img');
                            break;
                    case 'level3':
                            keyElement = document.getElementById('handlebar-screws').querySelector('img');
                            break;
                }

                if (keyElement != null ){
                    keyElement.classList.remove('handlebar-disabled');
                    keyElement.classList.add('handlebar-enabled');
                }
            }
        }
        return true;
    },
    saveUserStars: function() {
        localStorage.setItem("userStars", JSON.stringify(this.userStars));
    },
    getGameState() {
        return GAME_STATE;
    },
    calculateUserStars: function(level, bikeMemberCount, lives) {
        console.log("calculateUserStars");
        let curLevel = level + 1;
        // perfect number of hearts is 4 except on level 3 where it's 3
        let perfectHearts = curLevel === 3 ? 3 : 4;
        // perfect number of bike pool members is 2 except on levels 3, 4, where it is zero
        let perfectBikeMembers = curLevel === 3 || curLevel === 4 ? 0 : 2;
    
        // calculate if you have a perfect score
        let perfectScore = bikeMemberCount === perfectBikeMembers && lives === perfectHearts;
    
        let stars;
        
        if (perfectScore) {
            // if you have a perfect score, return 3
            stars = 3;
        } else if (curLevel === 1 || curLevel === 2) {
            // if you don't have a perfect score, for levels 1 and 2,
            // assign 1 or 2 depending on how many bike members you saved
            stars = bikeMemberCount === 0 ? 1 : 2;
        } else {
            // if you don't have a perfect score, for levels 3 and 4,
            // assign 1 or 2 depending on how many lives you have left
            stars = lives === 1 ? 1 : 2;
        }
    
        return stars;
    },
    setLastKillVehicle: function(vehicleType) {
        const vehicleMap = {
            'rightHook': 'Taxi',
            'leftCross': 'Unknown', // I see you left this blank, ensure you fill it in if needed
            'rightCross': 'Truck',
            'side': 'BMW',
            'driveway': 'SUV'
        };

        if(vehicleMap.hasOwnProperty(vehicleType)) {
            this.lastKillVehicle = vehicleMap[vehicleType];
        } else {
            this.lastKillVehicle = 'Unknown';
        }
    },

    tick: function(t, dt) {
        if(GAME_STATE === GAME_STATES.PLAYING && this.getLevelPosition() > this.levelData.endDistance) {
            this.endLevel();
        }

        if(this.lerpFog && GAME_STATE === GAME_STATES.PLAYING) {
            if(this.lerpFogUp) {
                this.currentNearFog = lerp(this.levelData.fogNear, this.targetNearFog, this.lerpFogAmount);
                this.currentFarFog = lerp(this.levelData.fogFar, this.targetFarFog, this.lerpFogAmount);


                this.lerpFogAmount = this.lerpFogAmount + dt/1000;
                if(this.lerpFogAmount >= 1.0) {
                    this.lerpFogAmount = FOG_FADE_OUT_DURATION;
                    this.lerpFogUp = false;
                }
            } else {
                this.currentNearFog = lerp(this.levelData.fogNear, this.targetNearFog, this.lerpFogAmount / FOG_FADE_OUT_DURATION);
                this.currentFarFog = lerp(this.levelData.fogFar, this.targetFarFog, this.lerpFogAmount / FOG_FADE_OUT_DURATION);


                this.lerpFogAmount -= dt/1000;
                if(this.lerpFogAmount <= 0) {
                    this.lerpFog = false;
                }
            }
    
            let scene = document.querySelector('a-scene');
            scene.setAttribute('fog', {'near': this.currentNearFog, 'far': this.currentFarFog});
            // fix this todo->
            // scene.setAttribute('fog', {'near': this.currentNearFog, 'far': this.currentFarFog});

        }
    }
});