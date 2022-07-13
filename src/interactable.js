import { Vector3 } from 'super-three';
import { GAME_STATE, GAME_STATES } from "./game-manager";
import { lerp } from './helpers/math'

export const interactableTypes = ['init', 'rightHook', 'leftCross', 'side', 'driveway'];
export const isSideType = (type) => {
    return type === 'side' || type === 'driveway';
}

AFRAME.registerComponent('interactable', {
    schema: {
        event: {type: 'string', default: ''},
        acceleration: {type: 'float', default: 0.1},
        type: {default: 'init', oneOf: interactableTypes}
    },
    init: function() {
        this.isHit = false;
        this.playerEl = document.querySelector('[player-controller]');
        this.tempVec = new Vector3();
    },
    play: function() {
        this.fromX = this.el.object3D.position.x;
        this.toX = this.el.object3D.position.x;
        this.counter = 0;
    },
    onCollision: function() {
        if(this.isHit) return;
        this.isHit = true;
        if(isSideType(this.data.type)) {

        } else {
            const elX = this.el.object3D.position.x;
            const elY = this.el.object3D.position.y;
            const elZ = this.el.object3D.position.z;
            this.el.setAttribute('animation', {
                property: 'position',
                'to': {x: elX, y: elY+1, z: elZ},
                easing: 'linear',
                dur: 200
            });
        }
    },
    followPlayerDepth: function() {
        this.lerpToPlayer = false;
        this.followPlayer = true;
    },
    update: function() {
        var data = this.data;
    },
    tick: function(t, dt) {
        // follow player
        if(GAME_STATE === GAME_STATES.PLAYING && this.followPlayer && !this.isHit) {
            this.followPlayerHorizontal(dt)
        } else if(GAME_STATE === GAME_STATES.PLAYING && this.data.type === 'side') {
            if(!this.isHit) {
                if(this.counter > this.startDelay) {
                    this.speed += this.data.acceleration * (dt / 1000);
                    this.el.object3D.position.x += this.direction * this.speed;
                } else {
                    this.counter += dt / 1000;
                }
            } else {
                this.speed -= this.data.acceleration * (dt / 1000) * 3;
                this.speed = Math.max(0, this.speed);
                this.el.object3D.position.x += this.direction * this.speed;
            }
        }
    },
    followPlayerHorizontal: function(dt) {
        this.el.object3D.getWorldPosition(this.tempVec);
        if(this.tempVec.z > 0) {
            this.el.object3D.position.z -= this.tempVec.z;
        }

        if(Math.round(this.tempVec.z) === 0) {
            this.counter += dt / 1000;
            if(this.counter > 2.0 && !this.lerpToPlayer) {
                this.lerpToPlayer = true;
                this.lerpT = 0.0;
                this.fromX = this.el.object3D.position.x;
                this.toX = this.playerEl.object3D.position.x;
            } else if(this.lerpToPlayer) {
                this.el.object3D.position.x = lerp(this.fromX, this.toX, this.lerpT)
                this.lerpT += dt / 1000;
            }
        }
    }
});
