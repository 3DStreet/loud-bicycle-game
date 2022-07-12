import { Vector3 } from 'super-three';
import { GAME_STATE, GAME_STATES } from "./game-manager";
import { lerp } from './helpers/math'

AFRAME.registerComponent('interactable', {
    schema: {
        event: {type: 'string', default: ''},
        type: {default: 'front', oneOf: ['front', 'side', 'driveway']}
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
        const elX = this.el.object3D.position.x;
        const elY = this.el.object3D.position.y;
        const elZ = this.el.object3D.position.z;
        this.el.setAttribute('animation', {
            property: 'position',
            'to': {x: elX, y: elY+1, z: elZ},
            easing: 'linear',
            dur: 200
        });
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
    },
});
