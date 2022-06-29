AFRAME.registerComponent('interactable-pool', {
    init: function() {
        setTimeout(() => {
            this.pool = this.el.sceneEl.components.pool__interactable;
            document.querySelector('#noise-indicator').components['aabb-collider'].update();      
        }, 1000);

        setInterval(() => {
            this.spawnEl()
        }, 2000);
    },
    spawnEl: function (){
        let el = this.pool.requestEntity();
        el.play();

        el.components.interactable.isHit = false;

        let parent = el.object3D.parent;
        let scene = this.el.sceneEl.object3D;

        scene.attach( el.object3D ); 

        let lane = Math.floor(Math.random() * 3) - 1;

        if(window.lanes === 1)
            lane = 0;


        el.object3D.position.set(lane * 2,1,-10);
        
        parent.attach( el.object3D );

        setTimeout(() => {
            this.returnEl(el);
        }, 10000);
    },
    returnEl: function (el) {
        this.pool.returnEntity(el);
    },
    update: function() {
        var data = this.data;
    },
});
