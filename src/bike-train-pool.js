import { gameManager } from "./game-manager";

const BIKE_TRAIN_SPAWN_INTERVAL_MS = 15000;

AFRAME.registerComponent('bike-train-pool', {
    init: function() {
        setTimeout(() => {
            this.pool = this.el.sceneEl.components.pool__bikes;
            document.querySelector('[player-controller]').components['aabb-collider'].update();      
        }, 1000);
    },
    start: function() {
        if(this.spawnInterval) return;
        this.spawnInterval = setInterval(() => {
            this.spawnEl()
        }, BIKE_TRAIN_SPAWN_INTERVAL_MS);
    },
    stop: function() {
        clearInterval(this.spawnInterval);
        this.spawnInterval = null;
    },
    spawnEl: function (){
        let el = this.pool.requestEntity();
        
        el.play();

        const component = el.components['bike-train-member'];

        let parent = el.object3D.parent;
        let scene = this.el.sceneEl.object3D;

        scene.attach( el.object3D ); 

        let lane = Math.floor(gameManager.lanes);
        el.object3D.position.set(lane * gameManager.levelData.laneWidth + gameManager.levelData.bikePoolSpawnOffset, 0.25, -20);
        el.object3D.rotation.set(0, -Math.PI/2, 0)

        parent.attach( el.object3D );

        component.spawn();

        setTimeout(() => {
            if(this.pool.usedEls.includes(el) && !component.isHit)
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
        const component = el.components['bike-train-member'];
        component.despawn();
        this.pool.returnEntity(el);
    },
    update: function() {
        var data = this.data;
    },
});
