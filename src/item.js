import { Vector3 } from 'super-three';
import { gameManager } from './game-manager';
import { playerController } from './player-controller';

AFRAME.registerComponent('item', {
    schema: {
        type: {default: 'horn', oneOf: ['horn', 'raygun', 'heart']},
    },
    init: function() {
        this.isHit = false;
        this.playerEl = document.querySelector('[player-controller]');
        this.tempVec = new Vector3();
        this.tempVec2 = new Vector3();

        this.comicEffectEl = document.createElement('a-plane');
        this.comicEffectEl.setAttribute('src', '#comic-effect');
        this.comicEffectEl.setAttribute('material', {opacity: 1.0, transparent: false, alphaTest: 0.5});
        this.comicEffectEl.setAttribute('look-at', 'a-camera');
        this.comicEffectEl.setAttribute('scale', '2 2 2');

        this.el.sceneEl.append(this.comicEffectEl);

        this.comicEffectObject = this.comicEffectEl.object3D;
        
        this.camera = document.querySelector('a-camera').object3D;
    },
    remove: function() {
        if(this.comicEffectEl)
            this.comicEffectEl.parentNode.removeChild(this.comicEffectEl);
    },
    onCollision: function() {
        if(this.isHit) return;
        this.isHit = true;
        this.el.object3D.visible = false;
        this.comicEffectObject.visible = false;
        if(this.data.type === 'horn') {
            gameManager.upgradeToHorn();
        } else if(this.data.type === 'raygun') {
            gameManager.setRaygunActive(true);
        } else if(this.data.type === 'heart') {
            playerController.addLife();
        }
        this.powerupAudio = document.querySelector('#powerup-sound');
        this.powerupAudio.volume = 1.0;
        this.powerupAudio.play();

    },
    spawn: function() {
        this.isHit = false;
        this.el.object3D.visible = true;
    },
    tick: function() {
        if(this.isHit) return;
        if(this.camera && this.comicEffectObject) {
            this.el.object3D.getWorldPosition(this.tempVec);
            this.tempVec2.copy(this.tempVec)
            this.tempVec2.sub(this.camera.position);
            this.tempVec2.normalize();
            this.tempVec2.multiplyScalar(0.1);
            this.tempVec2.add(this.tempVec)
            this.comicEffectObject.position.copy(this.tempVec2)
            if(this.tempVec.distanceTo(this.playerEl.object3D.position) < 2) {
                this.onCollision();
            }
        }

        this.el.object3D.rotateY(0.02);
    }
});
