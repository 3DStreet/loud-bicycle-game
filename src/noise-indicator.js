import { playerController } from './player-controller'
import { GAME_STATE, GAME_STATES } from "./game-manager";

AFRAME.registerComponent('noise-indicator', {
    init: function() {
        this.collider = this.el.components['aabb-collider'];
        window.addEventListener("keypress", this.onKeyPressed.bind(this));
    },
    display: function(isSmall) {
        if(GAME_STATE !== GAME_STATES.PLAYING) return;

        isSmall ? this.scaleSmall() : this.scaleLarge();

        this.el.object3D.position.x = playerController.el.object3D.position.x;
        this.isActive = true;
        this.el.object3D.visible = true;
        setTimeout(() => {
            this.el.object3D.visible = false;
            this.isActive = false;
        }, 1000);

    },
    onKeyPressed: function(e) {
        switch(e.key) {
            case 'e':
                this.display(false)
                break;
            case 'q':
                this.display(true)
                break;
        }
    },
    scaleSmall: function() {
        this.el.object3D.scale.set(2,1,1)
    },
    scaleLarge: function() {
        this.el.object3D.scale.set(4,1,2)
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
