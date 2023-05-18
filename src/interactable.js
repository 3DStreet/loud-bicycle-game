import { Vector3, Vector2, SplineCurve } from 'super-three';
import { gameManager, GAME_STATE, GAME_STATES } from "./game-manager";
import { lerp } from './helpers/math'
import { noiseIndicator } from './noise-indicator';
import { playerController } from './player-controller'

var DbgDraw = require('three-debug-draw')(THREE);
const isDebug = false;

export const interactableTypes = ['rightHook', 'side', 'leftCross', 'rightCross', 'driveway'];
export const isSideType = (type) => {
    return type === 'side' || type === 'driveway';
}

const INTERACTABLE_HORIZONTAL_ACCELERATION = 0.1;
const HORIZONTAL_ATTACK_WAIT_TIME = 2.0;
const HORIZONTAL_FOLLOW_ATTACK_SPEED = 1.0;
const INTERACTABLE_BEHIND_ACCELERATION = 0.1;
// const INTERACTABLE_SIDE_ATTACK_DELAY_AFTER_SPAWN = 3.7;
const INTERACTABLE_SIDE_ATTACK_START_Z_DISTANCE = 5;

// Left Cross
const INTERACTABLE_LEFT_CROSS_ATTACK_START_Z_DISTANCE = 25;
const INTERACTABLE_LEFT_CROSS_ATTACK_SPEED_MULTIPLIER = 0.4;
const INTERACTABLE_LEFT_CROSS_V1_OFFSET = new Vector3( 0, 0, 15 );
const INTERACTABLE_LEFT_CROSS_V2_OFFSET = new Vector3( 0, 0, 15 );
const INTERACTABLE_LEFT_CROSS_V3_OFFSET = new Vector3( 10, 0, 15 );
// const INTERACTABLE_LEFT_CROSS_Z_DISTANCE = 15;
// const INTERACTABLE_LEFT_CROSS_X_DISTANCE = 10;


// Right Cross
const INTERACTABLE_RIGHT_CROSS_ATTACK_START_Z_DISTANCE = 0;
const INTERACTABLE_RIGHT_CROSS_ATTACK_SPEED_MULTIPLIER = .7;

// will use the following structure: Vector2 (x, z)
const SPLINE_VECTORS_RIGHT_CROSS = [    
	new Vector2(0.0, 0.0),
	new Vector2(0.0, -5.5),
	new Vector2(0.0, -11.0),
	new Vector2(0.0, -17.7),
	new Vector2(-0.0, -25.0),
	new Vector2(-1.0, -33.5),
	new Vector2(-3.0, -41.0),
	new Vector2(2.0, -43.5),
	new Vector2(10.0, -44.0),
	new Vector2(20.0, -44.0),
	new Vector2(30.0, -44.0),
	new Vector2(40.0, -44.0),
]

const INTERACTABLE_RIGHT_CROSS_SPLINE = new SplineCurve(SPLINE_VECTORS_RIGHT_CROSS);

const INTERACTABLE_DISABLE_Z = 10;

AFRAME.registerComponent('interactable', {
    schema: {
        event: {type: 'string', default: ''},
        type: {default: 'side', oneOf: interactableTypes}
    },
    init: function() {
        this.curveVec0 = new Vector3();
        this.curveVec1 = new Vector3();
        this.curveVec2 = new Vector3();
        this.curveVec3 = new Vector3();
        this.interactableWorldPosition = new Vector3();
        this.splineVec = new Vector2();
        // this.obb = new OBB();
        this.isHit = false;
        this.playerEl = document.querySelector('[player-controller]');
        this.tempVec = new Vector3();
        setTimeout(() => {
            this.sound = this.el.components['sound'];
        }, 100);

        this.el.addEventListener('raycaster-intersection', evt => {
            this.isHit = true;
        });
    },
    play: function() {
        this.fromX = this.el.object3D.position.x;
        this.toX = this.el.object3D.position.x;
        this.counter = 0;
        this.spawned = true;
    },
    onCollision: function(isHonk) {
        if(this.isHit || !this.spawned) return;
        if(isHonk) {
            // Randomization of reaction speed
            let time = Math.round(noiseIndicator.isLoudMini ? 100 + Math.random() * 200 : 300 + Math.random() * 200) 
            setTimeout(() => {
                this.isHit = true;
                this.sound.playSound();
            }, time);
        } else {
            this.isHit = true;
            this.sound.playSound();
        }
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
        if(GAME_STATE === GAME_STATES.PAUSED) return;

        if(GAME_STATE === GAME_STATES.PLAYING) {
            switch(this.data.type) {
                case 'rightHook':
                    this.followPlayerHorizontal(dt)
                    break;
                case 'leftCross':
                    this.attackPlayerLeftCross(dt)
                    break;
                case 'rightCross':
                    this.attackPlayerRightCross(dt)
                    break;
                case 'side':
                    this.attackPlayerFromSide(dt);
                    break;
            }
        }

        this.el.object3D.getWorldPosition(this.tempVec);

        if(this.returnFunction && this.tempVec.z > INTERACTABLE_DISABLE_Z) {
            this.returnFunction();
        }
        if(isDebug && this.el.sceneEl.object3D) {
            DbgDraw.render(this.el.sceneEl.object3D);
        }
    },
    setBezierCurveLeftCross: function(startZ) {
        this.startZ = startZ;

        this.curveVec0.copy(this.el.object3D.position);

        // this.curveVec1.copy(this.curveVec0);
        // this.curveVec1.add(INTERACTABLE_LEFT_CROSS_V1_OFFSET);
        // this.curveVec2.copy(this.curveVec1);
        // this.curveVec2.add(INTERACTABLE_LEFT_CROSS_V2_OFFSET);
        // this.curveVec3.copy(this.curveVec1);
        // this.curveVec3.add(INTERACTABLE_LEFT_CROSS_V3_OFFSET);
        // this.curveVec3.copy(this.curveVec1);
        // this.curveVec3.add(INTERACTABLE_LEFT_CROSS_V4_OFFSET);

        this.speed = 0;
    },
    setBezierCurveRightCross: function() {
        this.curveVec0.copy(this.el.object3D.position);
        
        // this.curveVec1.copy(this.curveVec0);
        // this.curveVec1.add(INTERACTABLE_RIGHT_CROSS_V1_OFFSET);
        // this.curveVec2.copy(this.curveVec0);
        // this.curveVec2.add(INTERACTABLE_RIGHT_CROSS_V2_OFFSET);
        // this.curveVec3.copy(this.curveVec1);
        // this.curveVec3.add(INTERACTABLE_RIGHT_CROSS_V3_OFFSET);
        // this.curveVec3.copy(this.curveVec1);
        // this.curveVec3.add(INTERACTABLE_RIGHT_CROSS_V4_OFFSET);

        this.speed = 0;
    },
    attackPlayerLeftCross: function(dt) {
        if(!this.isHit) {
            // if(this.startZ < this.el.object3D.position.z)
            //     return this.el.object3D.position.z += 0.1;
            const worldZ = this.el.object3D.position.z + this.el.object3D.parent.position.z
            if(worldZ > -INTERACTABLE_LEFT_CROSS_ATTACK_START_Z_DISTANCE) {
                this.speed += INTERACTABLE_LEFT_CROSS_ATTACK_SPEED_MULTIPLIER * (dt / 1000);
                this.speed = Math.min(1, this.speed);
                if(this.speed === 1) {
                    this.el.object3D.position.x += this.speed / 10;
                } else {
                    let pos = getPointOnCurve(this.curveVec0, this.curveVec1, this.curveVec2, this.curveVec3, this.speed);
                    this.el.object3D.position.copy(pos)
                    let pos2 = getPointOnCurve(this.curveVec0, this.curveVec1, this.curveVec2, this.curveVec3, this.speed+0.001);
                    this.el.object3D.lookAt(this.el.object3D.parent.localToWorld(pos2));
                }
            }
        }
    },
    attackPlayerRightCross: function(dt) {
        if(!this.isHit) {
            if(isDebug) {
                this.interactableWorldPosition.copy(this.el.object3D.parent.position);
                this.interactableWorldPosition.add(this.curveVec0);
                for (let i = 0; i < 50; i++) {
                    INTERACTABLE_RIGHT_CROSS_SPLINE.getPoint( i / 50.0, this.splineVec);
                    this.curveVec1.x = this.splineVec.x;
                    this.curveVec1.y = 0.4;
                    this.curveVec1.z = this.splineVec.y;
    
                    this.curveVec1.add(this.interactableWorldPosition);
                    
                    DbgDraw.drawSphere(
                        this.curveVec1,
                        0.5,
                    'red');
                }
            }
            const worldZ = this.el.object3D.position.z + this.el.object3D.parent.position.z;
            if(worldZ > -INTERACTABLE_RIGHT_CROSS_ATTACK_START_Z_DISTANCE) this.followPlayer = true;
            if(this.followPlayer) {
                this.speed += (INTERACTABLE_RIGHT_CROSS_ATTACK_SPEED_MULTIPLIER * (dt / 1000)) / (SPLINE_VECTORS_RIGHT_CROSS.length);
                this.speed = Math.min(1, this.speed);
                if(this.speed === 1) {
                    this.el.object3D.position.x += this.speed / 10;
                } else {
                    INTERACTABLE_RIGHT_CROSS_SPLINE.getPoint(this.speed, this.splineVec);
                    this.curveVec1.x = this.splineVec.x;
                    this.curveVec1.y = 0;
                    this.curveVec1.z = this.splineVec.y;
                    this.curveVec1.add(this.curveVec0);
                    this.el.object3D.position.copy(this.curveVec1)
                    // let pos = getPointOnCurve(this.curveVec0, this.curveVec1, this.curveVec2, this.curveVec3, this.speed);
                    INTERACTABLE_RIGHT_CROSS_SPLINE.getPoint(this.speed+0.001, this.splineVec);
                    // let pos2 = getPointOnCurve(this.curveVec0, this.curveVec1, this.curveVec2, this.curveVec3, this.speed+0.001);
                    this.curveVec1.x = this.splineVec.x;
                    this.curveVec1.y = 0;
                    this.curveVec1.z = this.splineVec.y;
                    this.curveVec1.add(this.curveVec0);
                    this.el.object3D.lookAt(this.el.object3D.parent.localToWorld(this.curveVec1));
                }
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
                    while(this.tempVec > 3 && this.lane === playerController.currentLane){
                        this.changeLane = true;
                        this.lane = Math.floor(Math.random() * gameManager.lanes);
                        this.el.object3D.position.set(this.lane * gameManager.laneWidth,0,5);
                    }
                    this.el.object3D.position.z -= INTERACTABLE_BEHIND_ACCELERATION * (dt / 1000) * 75;
                    this.changeLane = false;
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

let out = new Vector3();

export function getPointOnCurve(a, b, c, d, t) {
    let inverseFactor = 1 - t;
    let inverseFactorTimesTwo = inverseFactor * inverseFactor;
    let factorTimes2 = t * t;
    let factor1 = inverseFactorTimesTwo * inverseFactor;
    let factor2 = 3 * t * inverseFactorTimesTwo;
    let factor3 = 3 * factorTimes2 * inverseFactor;
    let factor4 = factorTimes2 * t;
    out.x = a.x * factor1 + b.x * factor2 + c.x * factor3 + d.x * factor4;
    out.y = a.y * factor1 + b.y * factor2 + c.y * factor3 + d.y * factor4;
    out.z = a.z * factor1 + b.z * factor2 + c.z * factor3 + d.z * factor4;
    return out;
}
