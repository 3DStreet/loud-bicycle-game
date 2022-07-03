import { playerController } from './player-controller'
import { GAME_STATE, GAME_STATES } from "./game-manager";

AFRAME.registerComponent('noise-indicator', {
    init: function() {
        this.collider = this.el.components['aabb-collider'];
        this.hornEl = document.getElementById('horn');
        this.hornMeterEl = document.getElementById('horn-meter');
        this.hornMeter = 0;
        this.isActive = false;
    
        window.addEventListener("keypress", this.onKeyPressed.bind(this));

        setInterval(() => {
            if (this.isActive) {
                if (this.hornMeter > 0) {
                    this.hornMeter -= 5;
                    this.hornMeter = Math.max(0, this.hornMeter);
                    this.updateMeter();
                }
            }
            else {
                this.hornMeter += 10;
                this.hornMeter = Math.min(100, this.hornMeter);
                this.updateMeter();
            }
        }, 300);
    },
    updateMeter: function() {
        this.hornMeterEl.value = this.hornMeter;
        if (this.hasLowMeter()) {
            this.hornMeterEl.className = 'low-meter';
            this.hornEl.classList.add('disabled');
        } else {
            this.hornMeterEl.className = 'high-meter';
            this.hornEl.classList.remove('disabled');
        }
    },
    hasLowMeter: function() {
        return this.hornMeter < 50;
    },
    display: function(isSmall) {
        if(GAME_STATE !== GAME_STATES.PLAYING) return;

        if (this.hasLowMeter()) return;

        isSmall ? this.scaleSmall() : this.scaleLarge();

        this.el.object3D.position.x = playerController.el.object3D.position.x;
        this.isActive = true;
        this.el.object3D.visible = true;
        this.hornMeter -= isSmall ? 30 : 50;
        this.updateMeter();
        
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
