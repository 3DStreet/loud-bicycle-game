import { Vector3 } from 'super-three';
import { gameManager } from './game-manager';

AFRAME.registerComponent('smog', {
    schema: {
    },
    init: function() {
        this.isHit = false;
        this.playerEl = document.querySelector('[player-controller]');
        this.poolEl = document.querySelector('[smog-pool]');
        this.tempVec = new Vector3();
        this.scoreEl;

        setTimeout(() => {
            const obj = this.el.getObject3D('mesh');
            obj.visible = false;
        }, 50);

        //particle-system="texture: ./assets/fog-256.png; velocityValue: 0 0.1 0; accelerationValue: 0 0.1 0; accelerationSpread: 0.1 0 0.1; velocitySpread: 0.14 0 0.14; particleCount: 5; maxAge: 3; size: 2,4; opacity: 0,1,0; color: #666,#222"
        this.el.setAttribute('particle-system', 'texture: ./assets/fog-256.png; velocityValue: 0 0.1 0; accelerationValue: 0 0.1 0; accelerationSpread: 0.1 0 0.1; velocitySpread: 0.14 0 0.14; particleCount: 5; maxAge: 3; size: 2,4; opacity: 0,1,0; color: #666,#222')
    },
    onCollision: function() {
        if(this.isHit) return;
        this.isHit = true;
        this.el.object3D.visible = false;
        this.poolEl.components['smog-pool'].returnEl(this.el);
        gameManager.increaseScore();
    },
    spawn: function() {
        this.isHit = false;
        this.el.object3D.visible = true;
    },
});
