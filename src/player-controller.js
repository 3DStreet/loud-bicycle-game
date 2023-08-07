import { GAME_STATE, GAME_STATES, gameManager } from "./game-manager";
import { lerp } from './helpers/math'

export let playerController;

const TOUCH_SWIPE_THRESHHOLD = 20;

AFRAME.registerComponent('player-controller', {
    schema: {
        defaultLives: {default: 3},
        speed: {default: 1.0},
    },
    init: function () {
        playerController = this;
        this.currentLane = 0;
        this.lives = this.data.defaultLives;
        this.hitCounter = 0;
        window.addEventListener("keydown", this.onKeyPressed.bind(this));
        
        let touchStartX = 0;
        let touchEndX = 0;
        document.addEventListener("touchstart", e => {
            touchStartX = e.changedTouches[0].screenX;
        })
        document.addEventListener("touchend", e => {
            touchEndX = e.changedTouches[0].screenX;
            const diff = touchEndX - touchStartX;
            const isValid = Math.abs(diff) > TOUCH_SWIPE_THRESHHOLD;
            if(!isValid) return
            if(touchEndX < touchStartX) this.goLeft();
            else if(touchEndX > touchStartX) this.goRight();
        })

        setTimeout(() => {
            this.collider = this.el.components['aabb-collider'];
            this.animationMixer = this.el.querySelector('[animation-mixer]').components['animation-mixer'];
            this.sound = this.el.components['sound'];
            this.cameraEl = document.querySelector('a-camera');
            this.cameraEl.object3D.position.x = gameManager.laneWidth * Math.floor(gameManager.lanes / 2)
        }, 100);

        this.currentPosition = 0;
        this.targetPosition = 0;
        this.lerpT = 0;

        this.playerAvatar = document.querySelector('#player-cyclist');
        this.lifeContainer = document.querySelector('#life-indicator-container');
    },
    setAnimationPaused: function(b) {
        b ? this.animationMixer.pause() : this.animationMixer.play();
    },
    reset: function() {
        this.lives = this.data.defaultLives;
        this.lifeContainer.innerHTML = '';
        for (let i = 0; i < this.lives; i++) {
            let div = document.createElement('div');
            div.setAttribute('class', 'life-indicator');
            this.lifeContainer.appendChild(div);
        }
        this.collided = false;
        this.el.object3D.visible = true;
    },
    setLane: function(lane) {
        this.currentLane = lane;
        this.setPosition();
        this.el.object3D.position.x = this.currentLane * gameManager.laneWidth;
    },
    setAvatar: function(gltfPath) {
        this.playerAvatar.removeAttribute("gltf-model");
        this.playerAvatar.setAttribute('gltf-model', gltfPath);
    },
    onKeyPressed: function(e) {
        if(GAME_STATE !== GAME_STATES.PLAYING || e.repeat) return;
        switch(e.key) {
            case 'd':
            case 'ArrowRight':
                this.goRight()
                break;
            case 'a':
            case 'ArrowLeft':
                this.goLeft()
                break;
            case 'p':
            case 'P':
            case 'Escape': 
                gameManager.togglePauseLevel()
                break;
        }
    },
    goRight: function() {
        if(this.currentLane === gameManager.lanes - 1) return;
        let prevLane = this.currentLane;
        this.currentLane++;
        this.currentLane = Math.min(this.currentLane, gameManager.lanes);
        if(prevLane !== this.currentLane)
            this.setPosition();
    },
    goLeft: function() {
        if(this.currentLane === -1) return;
        let prevLane = this.currentLane;
        this.currentLane--;
        this.currentLane = Math.max(this.currentLane, -1);
        if(prevLane !== this.currentLane)
            this.setPosition();
    },
    setPosition: function() {
        this.currentPosition = this.el.object3D.position.x;
        this.targetPosition = this.currentLane * gameManager.laneWidth;
        this.lerpT = 0;
    },
    tick: function(t, dt) {
        if(GAME_STATE === GAME_STATES.PLAYING) {
            if(this.collider && this.collider.collisions.length) {
                for (let index = 0; index < this.collider.collisions.length; index++) {
                    const element = this.collider.collisions[index];
                    
                    if(element.object3D.visible) {
                        if(element.components.smog) {
                            element.components.smog.onCollision();
                        } else if(element.components.interactable){
                            element.components.interactable.onCollision();
                            this.onCollided();
                        } else if(element.components.item){
                            element.components.item.onCollision();
                        }
                    }
                }
            }
            this.el.object3D.position.x = lerp(this.currentPosition, this.targetPosition, this.lerpT)
            this.el.object3D.position.z -= this.el.object3D.position.z / 100;
            this.lerpT += this.data.speed * dt / 1000;
            this.lerpT = Math.max(Math.min(this.lerpT,1),0);

            let dist = this.targetPosition - this.el.object3D.position.x;
            const targetRotation = Math.sin(-dist) / 2;
            this.el.object3D.rotation.y = lerp(this.el.object3D.rotation.y, targetRotation, this.lerpT)

            if(this.cameraEl) this.cameraEl.object3D.position.x = this.el.object3D.position.x;

            // make the person blink when collided
            if(this.collided) {
                this.collidedTimer += dt / 1000;
                if(Math.floor((this.collidedTimer % 1) * 10) % 2) {
                    this.el.object3D.visible = false;
                } else {
                    this.el.object3D.visible = true;
                }
            }
        }
    },
    addLife: function() {
        this.lives++;
        console.log('ADD LIFE');
        let div = document.createElement('div');
        div.setAttribute('class', 'life-indicator');
        this.lifeContainer.appendChild(div);
    },
    onCollided: function() {

        if(this.collided) return;

        this.collided = true;
        this.collidedTimer = 0;
        this.lives--;
        this.hitCounter++;
        console.log('HIT COUNTER', this.hitCounter);

        if(this.lifeContainer.children.length > this.lives)
            this.lifeContainer.removeChild(this.lifeContainer.lastChild);
        gameManager.playGetHurt();
        if(this.lives === 0) {
            gameManager.failLevel();
        } else {
            // set the time for how long somebody will blink for when collided
            setTimeout(() => {
                this.collided = false;
                this.el.object3D.visible = true;
            }, 2000);
        }
    }
  });