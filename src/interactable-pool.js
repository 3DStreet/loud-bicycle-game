import { Vector3 } from 'super-three';
import {interactableTypes, isSideType} from './interactable'
import { gameManager } from './game-manager';

const SIDE_INTERCTABLE_START_DISTANCE = 10;
const INTERSECTION_CAR_Z_OFFSET = 2;

AFRAME.registerComponent('randomize-gltf-model', {
    schema: {type: 'array'},
    init: function () {
      console.log(this.data)
  
      const randomElement = this.data[Math.floor(Math.random() * this.data.length)];
      console.log(randomElement);
      this.el.setAttribute('gltf-model', '#' + randomElement);
    }
  });

AFRAME.registerComponent('interactable-pool', {
    init: function() {
        this.tempVec = new Vector3();
        this.streetIndex = 0;
        setTimeout(() => {
            this.pool = this.el.sceneEl.components.pool__interactable;
            document.querySelector('#noise-indicator-collider').components['aabb-collider'].update();      
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
        const type = interactableTypes[Math.floor(Math.random()*interactableTypes.length)]
        if(type !== 'rightHook') return;
        
        let el = this.pool.requestEntity();
        const sideType = isSideType(type);
        
        el.setAttribute('interactable', {type});

        let parent = el.object3D.parent;
        let scene = this.el.sceneEl.object3D;

        scene.attach( el.object3D ); 

        el.components.interactable.isHit = false;
        el.play();


        let lane = Math.floor(Math.random() * window.lanes);

        if(type === 'rightHook') {
            el.object3D.position.set(lane * 2.5,0,5);
            el.components.interactable.speed = 0;
            el.components.interactable.followPlayerDepth();
            el.object3D.rotation.y = Math.PI;
        }
        
        parent.attach( el.object3D );

        el.components.interactable.returnFunction = () => {
            if(this.pool.usedEls.includes(el)) {
                this.returnEl(el);
                this.spawned = false;
            }
        }
    },

    spawnCarOnDriveway: function (position){
        const type = "side"
        
        let el = this.pool.requestEntity();
        
        el.setAttribute('interactable', {type});
        el.play();

        el.components.interactable.isHit = false;

        let parent = el.object3D.parent;
        let scene = this.el.sceneEl.object3D;

        scene.attach( el.object3D ); 
        el.object3D.position.copy(position);

        let isRight = position.x > 0;

        // el.object3D.position.set(lane * 2.5 + Math.sign(lane - 0.5) * SIDE_INTERCTABLE_START_DISTANCE, 0, -20);
        el.object3D.rotation.y = isRight ? 1.5708 : -1.5708;
        el.components.interactable.direction = isRight ? -1 : 1;
        el.components.interactable.speed = 0;
        el.components.interactable.counter = 0;
        el.components.interactable.lerpToPlayer = false;
        el.components.interactable.followPlayer = false;

        parent.attach( el.object3D );

        el.components.interactable.returnFunction = () => {
            if(this.pool.usedEls.includes(el))
                this.returnEl(el);
        }
    },
    spawnCarOnIntersection: function (position, isRight){
        const type = "side"
        
        let el = this.pool.requestEntity();
        
        el.setAttribute('interactable', {type});
        el.play();

        el.components.interactable.isHit = false;

        let parent = el.object3D.parent;
        let scene = this.el.sceneEl.object3D;

        scene.attach( el.object3D ); 
        el.object3D.position.copy(position);

        const lane = isRight ? 1 : -1;

        el.object3D.position.set(lane * 2.5 + Math.sign(lane - 0.5) * SIDE_INTERCTABLE_START_DISTANCE, 0, position.z - lane * INTERSECTION_CAR_Z_OFFSET);
        el.object3D.rotation.y = -Math.sign(lane - 0.5) * 1.5708;
        el.components.interactable.direction = Math.sign(lane - 0.5) * -1;
        el.components.interactable.speed = 0;
        el.components.interactable.counter = 0;
        el.components.interactable.lerpToPlayer = false;
        el.components.interactable.followPlayer = false;

        parent.attach( el.object3D );

        el.components.interactable.returnFunction = () => {
            if(this.pool.usedEls.includes(el))
                this.returnEl(el);
        }
    },

    spawnCarsOnStreet: function(index) {
        const root = gameManager.getStreetObject3D(index);
        
        root.traverse((child) => {
            if(child.type === "Group") {
                if(child.el.classList[0] === "driveway") {
                    child.getWorldPosition(this.tempVec)
                    this.spawnCarOnDriveway(this.tempVec)
                } else if(child.el.classList[0] === "intersection") {
                    child.getWorldPosition(this.tempVec)
                    this.spawnCarOnIntersection(this.tempVec, true);
                    this.spawnCarOnIntersection(this.tempVec, false);
                }
            } 
            // if(child.type === "Group" && child.el.classList[0] === "intersection")
        });
    

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
    tick: function() {
        const currentStreetIndex = gameManager.getCurrentStreetIndex();
        if(currentStreetIndex != -1 && this.streetIndex !== currentStreetIndex) {
            this.spawnCarsOnStreet(currentStreetIndex + 1);
            this.streetIndex = currentStreetIndex;
        }
    }
});
