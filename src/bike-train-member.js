import { Vector3 } from 'super-three';
import { gameManager } from './game-manager';
import { playerController } from './player-controller'

AFRAME.registerComponent('bike-train-member', {
    schema: {
    },
    init: function() {
        const scene = document.querySelector('a-scene');
        this.originalParent = this.el.object3D.parent;
        // scene.addEventListener('loaded', () => {
        //     this.originalParent = this.el.object3D.parent;
        // });
        this.animateBell = false;
        this.bell = document.querySelector('#bell-indicator');
        this.spawned = false;
        this.isHit = false;
        this.playerEl = document.querySelector('[player-controller]');
        this.poolEl = document.querySelector('[bike-train-pool]');
    },
    onCollision: function() {
        if(this.isHit || !this.spawned) return;
        this.isHit = true;

        let x = Math.sign((gameManager.bikeMemberCount % 2) - 0.5) * 0.5;
        let z = Math.floor(gameManager.bikeMemberCount / 2) * 2.2 + 1.5;

        // play the powerup sound if you got someone
        this.powerupAudio = document.querySelector('#powerup-sound');
        this.powerupAudio.currentTime = 0;
        this.powerupAudio.volume = 1.0;
        this.powerupAudio.play();

        playerController.el.object3D.attach(this.el.object3D)
        this.el.object3D.position.set(x, 0, z)
        this.el.object3D.rotation.set(0, Math.PI, 0)

        this.bellOffset = 0;
        this.el.setAttribute('animation-mixer', 'timeScale: 1.5');
        gameManager.incrementBikePoolMemberCount();
        this.setBellActive(false);
    },
    spawn: function() {
        if(gameManager.levelData.bikePoolIsAdult) {
            let url = document.querySelector(getRandomAdultBikeId()).getAttribute('src');
            this.el.setAttribute('gltf-model', url);
        } else {
            let url = document.querySelector('#cyclist-kid-asset').getAttribute('src');
            this.el.setAttribute('gltf-model', url);
        }

        this.el.setAttribute('animation-mixer', 'timeScale: 0.0');

        this.isHit = false;
        this.spawned = true;
        this.el.object3D.visible = true;
        this.setBellActive(true);
    },
    despawn: function() {
        this.spawned = false;
        this.el.object3D.visible = false;
        this.originalParent.attach(this.el.object3D)
        this.setBellActive(false);
    },
    setBellActive: function(b) {
        if(b) {
            this.el.object3D.attach(this.bell.object3D);
        } else {
            this.el.sceneEl.object3D.attach(this.bell.object3D);
        }
        
        this.animateBell = b;
        this.bell.object3D.visible = b;
    },
    tick: function(t, dt) {
        if(this.animateBell) {
            this.bell.object3D.position.set(0, 2.5 + Math.sin(t/300) / 4, -0.3);
        }
    }
});

export function getRandomAdultBikeId(excludeCargo = false) {
    const cyclists = ["cyclist1", "cyclist2", "cyclist3", "cyclist-dutch"];
    
    if (!excludeCargo) {
        cyclists.push("cyclist-cargo");
    }

    const index = Math.floor(Math.random() * cyclists.length);
    return `#${cyclists[index]}-asset`;
}
