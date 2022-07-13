import { GAME_STATE, GAME_STATES, gameManager } from "./game-manager";
import { lerp } from './helpers/math'

export let playerController;

AFRAME.registerComponent('player-controller', {
    schema: {
        speed: {default: 1.0},
    },
    init: function () {
        if(window.lanes === 1) {
            document.querySelector('#right-lane').object3D.visible = false;
            document.querySelector('#left-lane').object3D.visible = false;
        }
        playerController = this;
        this.currentLane = 0;
        this.lives = 3;
        window.addEventListener("keypress", this.onKeyPressed.bind(this));
        setTimeout(() => {
            this.collider = this.el.components['aabb-collider'];
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
        if(window.lanes === 1) return;
        let prevLane = this.currentLane;
        this.currentLane++;
        this.currentLane = Math.min(this.currentLane, 1);
        if(prevLane !== this.currentLane)
            this.setPosition();
    },
    goLeft: function() {
        if(window.lanes === 1) return;
        let prevLane = this.currentLane;
        this.currentLane--;
        this.currentLane = Math.max(this.currentLane, -1);
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
        if(this.lives === 0) {
            gameManager.stopLevel();
        } else {
            setTimeout(() => {
                this.collided = false;
                this.el.object3D.visible = true;
            }, 1000);
        }
    }
  });