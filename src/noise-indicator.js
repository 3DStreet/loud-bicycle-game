import { playerController } from './player-controller'
import { GAME_STATE, GAME_STATES } from "./game-manager";

const INDICATOR_SPEED = 3;

export let noiseIndicator;

AFRAME.registerComponent('noise-indicator', {
    init: function() {
        noiseIndicator = this;
        this.isActive = false;
        this.isLoudMini = false;
        this.collider = this.el.children[0].components['aabb-collider']; 
        this.yOffset = 0;
        this.el.addEventListener('object3dset', () => {
            this.texture = this.el.getObject3D('mesh').children[0].material.map;
        })      
    },
    display: function(isBell) {
        if(GAME_STATE !== GAME_STATES.PLAYING) return;

        this.isBell = isBell;
        isBell ? this.scaleSmall() : this.isLoudMini ? this.scaleLarge() : this.scaleSmall();

        // this.el.object3D.position.x = playerController.el.object3D.position.x;
        
        this.isActive = true;
        this.el.object3D.visible = true;
    },
    upgradeLoudMini: function() {
        this.isLoudMini = true;
    },
    downgradeShout: function() {
        this.isLoudMini = false;
    },
    hide: function() {
        this.el.object3D.visible = false;
        this.isActive = false;
    },
    scaleSmall: function() {
        this.el.object3D.scale.set(4,0.5,4)
    },
    scaleLarge: function() {
        this.el.object3D.scale.set(7,0.5,7)
    },
    tick: function(t, dt) {
        if(this.isActive && this.collider.collisions.length) {
            for (let index = 0; index < this.collider.collisions.length; index++) {
                const element = this.collider.collisions[index];
                if(element.components['interactable'] && !this.isBell)
                    element.components['interactable'].onCollision();
                else if (element.components['bike-train-member'] && this.isBell)                
                    element.components['bike-train-member'].onCollision();
            }
        }
        if(this.texture) {
            this.yOffset -= INDICATOR_SPEED * dt / 1000;
            this.texture.offset.y = this.yOffset;
            if(this.yOffset <= -100) {
                this.yOffset += 100;
            }
        }
    },
  });
