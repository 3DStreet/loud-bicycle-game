import { Vector3, Box3 } from 'super-three';
import {interactableTypes, isSideType} from './interactable'
import { gameManager } from './game-manager';
import { playerController } from './player-controller'
import { getRandomAdultBikeId } from './bike-train-member';

const SIDE_INTERCTABLE_START_DISTANCE = 60;
const INTERSECTION_CAR_Z_OFFSET = 2;

const DEBUG_RAYCAST_LINE = false;

export let rightCrossInitialBox;
export let interactablePool;

AFRAME.registerComponent('interactable-pool', {
    init: function() {
        this.tempVec = new Vector3();
        interactablePool = this;
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
            this.spawnRightHook();
        }, 4000);
    },
    stop: function() {
        clearInterval(this.spawnInterval);
        this.spawnInterval = null;
    },
    spawnRightHook: function (){
        const type = 'rightHook'
        if(!gameManager.levelData.interactables[type] || gameManager.levelData.interactables[type] < Math.random()) return;
        if(this.spawnedRightHook) return;
        this.spawnedRightHook = true;

        let el = this.pool.requestEntity();

        if(!el) return console.error("Interactable pool is too small, failed to spawn");

        const sideType = isSideType(type);

        el.removeAttribute("gltf-model");
        el.setAttribute('gltf-model', '#sedan-taxi-rigged');

        el.setAttribute('raycaster', {objects: '[interactable]', showLine: DEBUG_RAYCAST_LINE, far: 4, interval: 100, origin: '0, 1, 3', direction: '0 0 1'});

        el.setAttribute('interactable', {type});

        let parent = el.object3D.parent;
        let scene = this.el.sceneEl.object3D;

        scene.attach( el.object3D );

        el.components.interactable.isHit = false;
        el.play();

        el.components.interactable.lane = Math.floor(Math.random() * gameManager.lanes);
        while(el.components.interactable.lane === playerController.currentLane)
            el.components.interactable.lane = Math.floor(Math.random() * gameManager.lanes);

        el.object3D.position.set(el.components.interactable.lane * gameManager.laneWidth,0,5);
        el.components.interactable.speed = 0;
        el.components.interactable.followPlayerDepth();

        el.object3D.quaternion.identity();

        el.object3D.rotateY(Math.PI);

        parent.attach( el.object3D );

        el.components.interactable.returnFunction = () => {
            if(this.pool.usedEls.includes(el)) {
                this.returnEl(el);
                this.spawnedRightHook = false;
            }
        }
    },
    spawnLeftCross: function(position) {
        const type = 'leftCross'
        if(!gameManager.levelData.interactables[type] || gameManager.levelData.interactables[type] < Math.random()) return;

        let el = this.pool.requestEntity();

        if(!el) return console.error("Interactable pool is too small, failed to spawn");

        el.setAttribute('interactable', {type});
        el.play();

        el.setAttribute('raycaster', {objects: '[interactable]', showLine: DEBUG_RAYCAST_LINE, far: 4, interval: 100, origin: '0, 1, 3', direction: '0 0 1'});

        el.removeAttribute("gltf-model");
        el.setAttribute('gltf-model', '#sedan-rigged');

        el.components.interactable.isHit = false;

        let parent = el.object3D.parent;
        let scene = this.el.sceneEl.object3D;

        scene.attach( el.object3D );
        el.object3D.position.copy(position);

        el.object3D.rotation.y = 0;

        parent.attach( el.object3D );

        // el.components.interactable.setBezierCurveLeftCross(position.z - 90);
        el.components.interactable.setBezierCurveLeftCross(position.z);

        el.components.interactable.returnFunction = () => {
            if(this.pool.usedEls.includes(el))
                this.returnEl(el);
        }
    },
    spawnRightCross: function(position) {
        const type = 'rightCross';
        if(!gameManager.levelData.interactables[type] || gameManager.levelData.interactables[type] < Math.random()) return;

        let el = this.pool.requestEntity();

        if(!el) return console.error("Interactable pool is too small, failed to spawn");

        el.setAttribute('interactable', {type});
        el.play();

        el.setAttribute('raycaster', {objects: '[interactable]', showLine: DEBUG_RAYCAST_LINE, far: 4, interval: 100, origin: '0, 1, 5', direction: '0, 0, 1'});

        el.removeAttribute("gltf-model");
        el.setAttribute('gltf-model', '#box-truck-rigged');

        // Needed for OBB calculation in aabb-collider
        if(!rightCrossInitialBox) {
            setTimeout(() => {
                if(!rightCrossInitialBox) {
                    rightCrossInitialBox = new Box3();
                    rightCrossInitialBox.setFromObject(el.object3D);
                    rightCrossInitialBox.setFromCenterAndSize(new Vector3(0,0,0), rightCrossInitialBox.getSize(this.tempVec))
                }
            }, 1000);
        }

        el.components.interactable.isHit = false;

        let parent = el.object3D.parent;
        let scene = this.el.sceneEl.object3D;

        scene.attach( el.object3D );
        el.object3D.position.copy(position);

        el.object3D.quaternion.identity();
        el.object3D.rotateY(Math.PI);

        parent.attach( el.object3D );

        el.components.interactable.setBezierCurveRightCross();

        el.components.interactable.returnFunction = () => {
            if(this.pool.usedEls.includes(el))
                this.returnEl(el);
        }
    },

    spawnCarOnDriveway: function (position){
        if(!gameManager.levelData.interactables['driveway'] || gameManager.levelData.interactables['driveway'] < Math.random()) return;
        const type = "driveway"

        let el = this.pool.requestEntity();

        if(!el) return console.error("Interactable pool is too small, failed to spawn");

        el.setAttribute('interactable', {type});
        el.play();

        el.setAttribute('raycaster', {objects: '[interactable]', showLine: DEBUG_RAYCAST_LINE, far: 4, interval: 100, origin: '0, 1, -3', direction: '0 0 -1'});

        el.removeAttribute("gltf-model");
        el.setAttribute('gltf-model', '#suv-rigged');

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
        if(!gameManager.levelData.interactables[type] || gameManager.levelData.interactables[type] < Math.random()) return;

        let el = this.pool.requestEntity();

        if(!el) return console.error("Interactable pool is too small, failed to spawn");

        el.setAttribute('interactable', {type});
        el.play();

        el.setAttribute('raycaster', {objects: '[interactable]', showLine: DEBUG_RAYCAST_LINE, far: 4, interval: 100, origin: '0, 1, 3', direction: '0 0 1'});

        el.removeAttribute("gltf-model");
        el.setAttribute('gltf-model', '#vehicle-bmw-m2-asset');

        el.components.interactable.isHit = false;

        let parent = el.object3D.parent;
        let scene = this.el.sceneEl.object3D;

        scene.attach( el.object3D );
        el.object3D.position.copy(position);

        const lane = isRight ? 1 : -1;

        el.object3D.position.set(lane * gameManager.laneWidth + Math.sign(lane - 0.5) * SIDE_INTERCTABLE_START_DISTANCE, 0, position.z - lane * INTERSECTION_CAR_Z_OFFSET);
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

    spawnCarParking: function (position, isRight){
        const type = "parking"
        if(!gameManager.levelData.interactables[type] || gameManager.levelData.interactables[type] < Math.random()) return;

        let el = this.pool.requestEntity();

        if(!el) return console.error("Interactable pool is too small, failed to spawn");

        el.setAttribute('interactable', {type});
        el.play();

        // el.setAttribute('raycaster', {objects: '[interactable]', showLine: DEBUG_RAYCAST_LINE, far: 4, interval: 100, origin: '0, 1, 3', direction: '0 0 1'});

        el.removeAttribute("gltf-model");
        el.setAttribute('gltf-model', '#vehicle-bmw-m2-asset');

        el.components.interactable.isHit = true;

        let parent = el.object3D.parent;
        let scene = this.el.sceneEl.object3D;

        scene.attach( el.object3D );
        el.object3D.position.copy(position);

        el.object3D.position.set(position.x, 0, position.z);
        // el.object3D.rotation.y = Math.PI;
        el.object3D.rotation.y = -Math.PI;


        parent.attach( el.object3D );

        el.components.interactable.returnFunction = () => {
            if(this.pool.usedEls.includes(el))
                this.returnEl(el);
        }
    },
    spawnCarsOnStreet: function(index) {
        const root = gameManager.getStreetObject3D(index);
        if(!root) return;
        root.traverse((child) => {
            if(child.type === "Group" && child.el) {
                if(child.el.classList[0] === "driveway") {
                    child.getWorldPosition(this.tempVec)
                    this.spawnCarOnDriveway(this.tempVec)
                } else if(child.el.classList[0] === "intersection") {
                    child.getWorldPosition(this.tempVec)
                    this.spawnCarOnIntersection(this.tempVec, true);
                    this.spawnCarOnIntersection(this.tempVec, false);
                    this.tempVec.z -= 0;
                    this.tempVec.x -= gameManager.laneWidth;
                    this.spawnLeftCross(this.tempVec);
                    this.tempVec.z += 47;
                    this.tempVec.x += gameManager.laneWidth * 2;
                    this.spawnRightCross(this.tempVec);
                    if(gameManager.levelData.interactables.parking) {
                        child.getWorldPosition(this.tempVec)
                        this.tempVec.x -= gameManager.laneWidth * 1.5;
                        this.tempVec.z += gameManager.laneWidth * 2;
                        const amount = Math.floor(Math.random()*2) + 4;
                        let doublePark = !!gameManager.levelData.interactables['double-parking'];
                        for (let i = 0; i < amount; i++) {
                            this.tempVec.z += gameManager.laneWidth * 3;
                            this.spawnCarParking(this.tempVec);
                            if(doublePark && i % 2) {
                                this.tempVec.x += gameManager.laneWidth;
                                this.spawnCarParking(this.tempVec);
                                this.tempVec.x -= gameManager.laneWidth;
                            }
                        }
                    }
                }
            }
        });
    },
// raygun turn all the cars into bicycles, one by one
// flash of orange from above first, followed by semi-overlapping flash of blue from below
convertAllToBikes: function() {
    for (let i = 0; i < this.pool.usedEls.length; i++) {
        const el = this.pool.usedEls[i];
        el.setAttribute('interactable', {type: 'bike'});
        el.play();
    }

    for (let i = 0; i < this.pool.usedEls.length; i++) {
        const el = this.pool.usedEls[i];

        // Create light from the top
        let topLight = document.createElement('a-light');
        topLight.setAttribute('type', 'spot');
        topLight.setAttribute('color', '#f2ad13');
        topLight.setAttribute('intensity', '40');
        topLight.setAttribute('distance', '5');
        topLight.setAttribute('angle', '45');
        topLight.setAttribute('penumbra', '0.5');
        topLight.setAttribute('position', {x: 0, y: 3, z: 0}); // position the light at the top
        topLight.setAttribute('rotation', {x: -90, y: 0, z: 0}); // rotate the light to point downward

        // Create light from the bottom
        let bottomLight = document.createElement('a-light');
        bottomLight.setAttribute('type', 'spot');
        bottomLight.setAttribute('color', '#f2ad13');
        bottomLight.setAttribute('intensity', '40');
        bottomLight.setAttribute('distance', '5');
        bottomLight.setAttribute('angle', '45');
        bottomLight.setAttribute('penumbra', '0.5');
        bottomLight.setAttribute('position', {x: 0, y: -1, z: 0}); // position the light at the bottom
        bottomLight.setAttribute('rotation', {x: 90, y: 0, z: 0}); // rotate the light to point upward

        // Add the lights to the car entity
        el.appendChild(topLight);
        // el.appendChild(bottomLight);

        setTimeout(() => {
            el.removeAttribute("gltf-model");
            el.setAttribute('gltf-model', getRandomAdultBikeId());
            topLight.setAttribute('color', '#007BFF');
            bottomLight.setAttribute('color', '#007BFF');
            el.appendChild(bottomLight);
            setTimeout(() => {
                el.removeChild(bottomLight);
            }, 200);
            setTimeout(() => {
                el.removeChild(topLight);
            }, 100);
        }, 200 * i); // stagger the conversion of cars to bikes 
    }
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
            if(this.streetIndex === 0) this.spawnCarsOnStreet(currentStreetIndex + 1);
            this.spawnCarsOnStreet(currentStreetIndex + 2);
            this.streetIndex = currentStreetIndex;
        }
    }
});
