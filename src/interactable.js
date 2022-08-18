import { Vector3 } from 'super-three';
import { GAME_STATE, GAME_STATES } from "./game-manager";
import { lerp } from './helpers/math'
import { playerController } from './player-controller'

export const interactableTypes = ['rightHook', 'side', /*'leftCross', 'driveway'*/];
export const isSideType = (type) => {
    return type === 'side' || type === 'driveway';
}

const INTERACTABLE_HORIZONTAL_ACCELERATION = 0.1;
const HORIZONTAL_ATTACK_WAIT_TIME = 2.0;
const HORIZONTAL_FOLLOW_ATTACK_SPEED = 1.0;
const INTERACTABLE_BEHIND_ACCELERATION = 0.1;
// const INTERACTABLE_SIDE_ATTACK_DELAY_AFTER_SPAWN = 3.7;
const INTERACTABLE_SIDE_ATTACK_START_Z_DISTANCE = 5;

AFRAME.registerComponent('interactable', {
    schema: {
        event: {type: 'string', default: ''},
        type: {default: 'side', oneOf: interactableTypes}
    },
    init: function() {
        this.isHit = false;
        this.playerEl = document.querySelector('[player-controller]');
        this.tempVec = new Vector3();
        setTimeout(() => {
            this.sound = this.el.components['sound'];
        }, 100);
    },
    play: function() {
        this.fromX = this.el.object3D.position.x;
        this.toX = this.el.object3D.position.x;
        this.counter = 0;
    },
    onCollision: function() {
        if(this.isHit) return;
        this.isHit = true;
        this.sound.playSound();
    },
    followPlayerDepth: function() {
        this.lerpToPlayer = false;
        this.followPlayer = true;
        this.counter = 0;
    },
    update: function() {
        var data = this.data;
    },
    tick: function(t, dt) {
        if(GAME_STATE === GAME_STATES.PLAYING) {
            switch(this.data.type) {
                case 'rightHook':
                    this.followPlayerHorizontal(dt)
                    break;
                case 'leftCross':
                    break;
                case 'side':
                    this.attackPlayerFromSide(dt);
                    break;
            }
        }
    },
    attackPlayerFromSide: function(dt) {
        if(!this.isHit) {
            const worldZ = this.el.object3D.position.z + this.el.object3D.parent.position.z 
            if(worldZ > -INTERACTABLE_SIDE_ATTACK_START_Z_DISTANCE) {
                this.speed += INTERACTABLE_HORIZONTAL_ACCELERATION * (dt / 1000);
                this.el.object3D.position.x += this.direction * this.speed;
            }
        } else {
            this.speed -= INTERACTABLE_HORIZONTAL_ACCELERATION * (dt / 1000) * 3;
            this.speed = Math.max(0, this.speed);
            this.el.object3D.position.x += this.direction * this.speed;
        }
    },
    followPlayerHorizontal: function(dt) {
        if(!this.isHit && this.followPlayer) {
            this.el.object3D.getWorldPosition(this.tempVec);
            if(this.tempVec.z > 0) {
                if(this.counter !== 0) {
                    this.el.object3D.position.z -= this.tempVec.z;
                } else {
                    this.el.object3D.position.z -= INTERACTABLE_BEHIND_ACCELERATION * (dt / 1000) * 75;
                }
            }
    
            if(Math.round(this.tempVec.z) === 0) {
                this.counter += dt / 1000;
                if(this.counter > HORIZONTAL_ATTACK_WAIT_TIME && !this.lerpToPlayer) {
                    this.lerpToPlayer = true;
                    this.lerpT = 0.0;
                    this.fromX = this.el.object3D.position.x;
                    this.toX = this.playerEl.object3D.position.x;
                } else if(this.lerpToPlayer) {
                    this.el.object3D.position.x = lerp(this.fromX, this.toX, this.lerpT)
                    this.lerpT += HORIZONTAL_FOLLOW_ATTACK_SPEED * dt / 1000;
                }
            }
        }
    }
});
