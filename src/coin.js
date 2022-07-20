import { Vector3 } from 'super-three';
import { gameManager } from './game-manager';

AFRAME.registerComponent('coin', {
    schema: {
    },
    init: function() {
        this.isHit = false;
        this.playerEl = document.querySelector('[player-controller]');
        this.poolEl = document.querySelector('[coin-pool]');
        this.tempVec = new Vector3();
        this.scoreEl
    },
    onCollision: function() {
        if(this.isHit) return;
        this.isHit = true;
        this.el.object3D.visible = false;
        this.poolEl.components['coin-pool'].returnEl(this.el);
        gameManager.increaseScore();
    },
    spawn: function() {
        this.isHit = false;
        this.el.object3D.visible = true;
    },
    tick: function(t, dt) {
        this.el.object3D.rotateY(2 * dt/1000)
    },
});
