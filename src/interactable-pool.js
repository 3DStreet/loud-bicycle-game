import {interactableTypes, isSideType} from './interactable'

AFRAME.registerComponent('interactable-pool', {
    init: function() {
        setTimeout(() => {
            this.pool = this.el.sceneEl.components.pool__interactable;
            document.querySelector('#noise-indicator').components['aabb-collider'].update();      
            document.querySelector('[player-controller]').components['aabb-collider'].update();      
        }, 1000);
    },
    start: function() {
        if(this.spawnInterval) return;
        this.spawnInterval = setInterval(() => {
            this.spawnEl()
        }, 2000);
    },
    stop: function() {
        clearInterval(this.spawnInterval);
        this.spawnInterval = null;
    },
    spawnEl: function (){
        let el = this.pool.requestEntity();
        const type = interactableTypes[Math.floor(Math.random()*interactableTypes.length)]
        const sideType = isSideType(type);
        
        el.setAttribute('interactable', {type});
        el.play();

        el.components.interactable.isHit = false;


        let parent = el.object3D.parent;
        let scene = this.el.sceneEl.object3D;

        scene.attach( el.object3D ); 

        let lane = Math.floor(Math.random() * 3) - 1;

        // if(window.lanes === 1) {
        //     lane = 0;
        // } 

        if(sideType) {
            while(lane === 0) {
                lane = Math.floor(Math.random() * 3) - 1;
            }
            el.object3D.position.set(lane * 5,1,-20);
            el.components.interactable.direction = Math.sign(lane) * -1;
            el.components.interactable.speed = 0;
            el.components.interactable.counter = 0;
            el.components.interactable.startDelay = 3.7;
            el.components.interactable.lerpToPlayer = false;
            el.components.interactable.followPlayer = false;
        } else {
            if(type === 'rightHook') {
                el.object3D.position.set(lane * 2,1,5);
                el.components.interactable.speed = 0;
                el.components.interactable.followPlayerDepth();
            }
        }

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
