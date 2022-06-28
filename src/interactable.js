AFRAME.registerComponent('interactable', {
    schema: {
        event: {type: 'string', default: ''},
    },
    init: function() {
        this.isHit = false;
        this.el.addEventListener('hit', () => {
            const noiseIndicator = document.getElementById('noise-indicator').components['noise-indicator'];

            if (noiseIndicator.isActive) {
                const elX = this.el.object3D.position.x;
                const elY = this.el.object3D.position.y;
                const elZ = this.el.object3D.position.z;
                this.el.setAttribute('animation', {
                    property: 'position',
                    'to': {x: elX, y: elY+1, z: elZ},
                    easing: 'linear',
                    dur: 200
                });
            }
        });
    },
    update: function() {
        var data = this.data;
    },
});
