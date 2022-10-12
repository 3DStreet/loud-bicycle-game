import { Vector3 } from 'super-three';
import { gameManager } from './game-manager';

AFRAME.registerComponent('item', {
    schema: {
        type: {default: 'horn', oneOf: ['horn', 'raygun']},
    },
    init: function() {
        this.isHit = false;
        this.playerEl = document.querySelector('[player-controller]');
        this.tempVec = new Vector3();
        this.tempVec2 = new Vector3();

        this.el.sceneEl.addEventListener('loaded', () => {
            this.comicEffectObject = document.querySelector('#comic-effect-plane').object3D;
            this.camera = document.querySelector('a-camera').object3D;
        });
    },
    onCollision: function() {
        if(this.isHit) return;
        this.isHit = true;
        this.el.object3D.visible = false;
        this.comicEffectObject.visible = false;
        if(this.data.type === 'horn') {
            gameManager.upgradeToHorn();
        }
    },
    spawn: function() {
        this.isHit = false;
        this.el.object3D.visible = true;
    },
    tick: function() {
        if(this.isHit) return;
        if(this.camera && this.comicEffectObject) {
            console.log(this.isHit);
            this.el.object3D.getWorldPosition(this.tempVec);
            this.tempVec2.copy(this.tempVec)
            this.tempVec2.sub(this.camera.position);
            this.tempVec2.normalize();
            this.tempVec2.multiplyScalar(0.1);
            this.tempVec2.add(this.tempVec)
            this.comicEffectObject.position.copy(this.tempVec2)
            console.log(this.tempVec.distanceTo(this.playerEl.object3D.position));
            if(this.tempVec.distanceTo(this.playerEl.object3D.position) < 1) {
                this.onCollision();
            }
        }

        this.el.object3D.rotateY(0.02);

    }
});
