AFRAME.registerComponent('smog-pool', {
    init: function() {
        setTimeout(() => {
            this.pool = this.el.sceneEl.components.pool__smogs;
            document.querySelector('[player-controller]').components['aabb-collider'].update();      
        }, 1000);
    },
    start: function() {
        if(this.spawnInterval) return;
        this.spawnInterval = setInterval(() => {
            this.spawnEl()
        }, 1000);
    },
    stop: function() {
        clearInterval(this.spawnInterval);
        this.spawnInterval = null;
    },
    spawnEl: function (){
        let el = this.pool.requestEntity();

        if(!el) return;
        
        el.play();

        el.components.smog.spawn();

        let parent = el.object3D.parent;
        let scene = this.el.sceneEl.object3D;

        scene.attach( el.object3D ); 

        let lane = Math.floor(Math.random() * window.lanes);
        el.object3D.position.set(lane * 2.5, 1, -20);

        parent.attach( el.object3D );

        setTimeout(() => {
            if(this.pool.usedEls.includes(el))
                this.returnEl(el);
        }, 10000);
    },
    returnAll: function() {
        const els = [...this.pool.usedEls];
        for (let i = 0; i < els.length; i++) {
            const element = els[i];
            this.returnEl(element);
        }
    },
    returnEl: function (el) {
        this.pool.returnEntity(el);
    },
    update: function() {
        var data = this.data;
    },
});
