import { Vector3 } from 'super-three';
import { gameManager } from './game-manager';
import { playerController } from './player-controller'

let amountBikeTrainMembers = 0;

AFRAME.registerComponent('bike-train-member', {
    schema: {
    },
    init: function() {
        const scene = document.querySelector('a-scene');
        scene.addEventListener('loaded', () => {
            this.originalParent = this.el.object3D.parent;

        });

        this.spawned = false;
        this.isHit = false;
        this.playerEl = document.querySelector('[player-controller]');
        this.poolEl = document.querySelector('[bike-train-pool]');
    },
    onCollision: function() {
        if(this.isHit || !this.spawned) return;
        this.isHit = true;

        let x = Math.sign((amountBikeTrainMembers % 2) - 0.5) * 0.7;
        let z = Math.floor(amountBikeTrainMembers / 2) * 2.2 + 1.5;

        playerController.el.object3D.attach(this.el.object3D)
        this.el.object3D.position.set(x, 0, z)
        this.el.object3D.quaternion.identity();
        amountBikeTrainMembers++;
    },
    spawn: function() {
        this.isHit = false;
        this.spawned = true;
        this.el.object3D.visible = true;
    },
    despawn: function() {
        this.spawned = false;
        this.el.object3D.visible = false;
        this.originalParent.attach(this.el.object3D)

    }
});
