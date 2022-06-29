import { playerController } from './player-controller'

AFRAME.registerComponent('noise-indicator', {
    display: function() {
        this.el.object3D.position.x = playerController.el.object3D.position.x;
        this.isActive = true;
        this.el.object3D.visible = true;
        setTimeout(() => {
            this.el.object3D.visible = false;
            this.isActive = false;
        }, 1000);
    }
  });
