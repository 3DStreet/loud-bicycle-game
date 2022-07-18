import { GAME_STATE, GAME_STATES, gameManager } from "./game-manager";
import { lerp } from './helpers/math'

export let playerController;

const TOUCH_SWIPE_THRESHHOLD = 20;

AFRAME.registerComponent('player-controller', {
    schema: {
        speed: {default: 1.0},
    },
    init: function () {
        playerController = this;
        this.currentLane = 0;
        this.lives = 3;
        window.addEventListener("keypress", this.onKeyPressed.bind(this));
        
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
            this.animationMixer = this.el.components['animation-mixer'];
            this.sound = this.el.components['sound'];
            this.cameraEl = document.querySelector('a-camera');
            this.cameraEl.object3D.position.x = 2.5 * Math.floor(window.lanes / 2)
        }, 100);

        this.currentPosition = 0;
        this.targetPosition = 0;
        this.lerpT = 0;

        this.liveEls = document.querySelector('#life-indicator-container').children;
    },
    onKeyPressed: function(e) {
        if(GAME_STATE !== GAME_STATES.PLAYING) return;
        switch(e.key) {
            case 'd':
                this.goRight()
                break;
            case 'a':
                this.goLeft()
                break;
            case 'w':
                break;
            case 's':
                break;
        }
    },
    goRight: function() {
        if(this.currentLane === window.lanes - 1) return;
        let prevLane = this.currentLane;
        this.currentLane++;
        this.currentLane = Math.min(this.currentLane, window.lanes);
        if(prevLane !== this.currentLane)
            this.setPosition();
    },
    goLeft: function() {
        if(this.currentLane === 0) return;
        let prevLane = this.currentLane;
        this.currentLane--;
        this.currentLane = Math.max(this.currentLane, 0);
        if(prevLane !== this.currentLane)
            this.setPosition();
    },
    setPosition: function() {
        this.currentPosition = this.el.object3D.position.x;
        this.targetPosition = this.currentLane * 2.5
        this.lerpT = 0;
    },
    tick: function(t, dt) {
        if(GAME_STATE === GAME_STATES.PLAYING) {
            if(this.collider && this.collider.collisions.length) {
                for (let index = 0; index < this.collider.collisions.length; index++) {
                    const element = this.collider.collisions[index];
                    if(element.object3D.visible)
                        this.onCollided();
                }
            }
            this.el.object3D.position.x = lerp(this.currentPosition, this.targetPosition, this.lerpT)
            this.lerpT += this.data.speed * dt / 1000;
            this.lerpT = Math.max(Math.min(this.lerpT,1),0);

            let dist = this.targetPosition - this.el.object3D.position.x;
            const targetRotation = Math.sin(-dist) / 2;
            this.el.object3D.rotation.y = lerp(this.el.object3D.rotation.y, targetRotation, this.lerpT)

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
    onCollided: function() {
        if(this.collided) return;
        this.collided = true;
        this.collidedTimer = 0;
        this.lives--;
        this.liveEls[this.liveEls.length - this.lives - 1].style.visibility = 'hidden';
        this.sound.playSound();
        if(this.lives === 0) {
            gameManager.stopLevel();
            this.animationMixer.stopAction();
        } else {
            setTimeout(() => {
                this.collided = false;
                this.el.object3D.visible = true;
            }, 1000);
        }
    }
  });