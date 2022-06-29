export let playerController;

AFRAME.registerComponent('player-controller', {
    schema: {
        lanes: {default: 3},
    },
    init: function () {
        if(window.lanes === 1) {
            document.querySelector('#right-lane').object3D.visible = false;
            document.querySelector('#left-lane').object3D.visible = false;
        }
        playerController = this;
        this.currentLane = 1;
        window.addEventListener("keypress", this.onKeyPressed.bind(this));
    },
    onKeyPressed: function(e) {
        switch(e.key) {
            case 'd':
                this.goRight()
                break;
            case 'a':
                this.goLeft()
                break;
            case 'w':
                break;
            case 's':
                break;
        }
    },
    goRight: function() {
        if(window.lanes === 1) return;
        this.currentLane++;
        this.currentLane = Math.min(this.currentLane, 1);
        this.setPosition();
    },
    goLeft: function() {
        if(window.lanes === 1) return;
        this.currentLane--;
        this.currentLane = Math.max(this.currentLane, -1);
        this.setPosition();
    },
    setPosition: function() {
        this.el.object3D.position.x = this.currentLane * 2.5;
    }
  });