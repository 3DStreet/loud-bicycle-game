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
        window.addEventListener("keypress", this.onKeyPressed.bind(this));
        setTimeout(() => {
            this.collider = this.el.components['aabb-collider'];
        }, 100);

        this.currentPosition = 0;
        this.targetPosition = 0;
        this.lerpT = 0;
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
        }
    },
    onCollided: function() {
        this.collided = true;
        gameManager.stopLevel();
    }
  });