import { playerController } from './player-controller'
import { GAME_STATE, GAME_STATES } from "./game-manager";

AFRAME.registerComponent('noise-indicator', {
    init: function() {
        this.collider = this.el.components['aabb-collider'];        
        this.isActive = false;
    },
    display: function(isSmall) {
        if(GAME_STATE !== GAME_STATES.PLAYING) return;

        isSmall ? this.scaleSmall() : this.scaleLarge();

        // this.el.object3D.position.x = playerController.el.object3D.position.x;
        this.isActive = true;
        this.el.object3D.visible = true;
        
        setTimeout(() => {
            this.el.object3D.visible = false;
            this.isActive = false;
        }, 200);
    },
    scaleSmall: function() {
        this.el.object3D.scale.set(4,0.5,4)
    },
    scaleLarge: function() {
        this.el.object3D.scale.set(7,0.5,7)
    },
    tick: function() {
        if(this.isActive && this.collider.collisions.length) {
            for (let index = 0; index < this.collider.collisions.length; index++) {
                const element = this.collider.collisions[index];
                element.components['interactable'].onCollision();                
            }
        }
    },
  });
