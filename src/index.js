require('aframe');
require('./game-manager');
require('./player-controller');
require('./noise-indicator');
require('./aabb-collider');
require('./interactable');
require('./interactable-pool');

window.lanes = 3
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const lanes = Number(urlParams.get('lanes'));
console.log('lanes', lanes);
if(lanes === 1) {
    window.lanes = lanes
}

const onSceneLoaded = (function() {
    let hornEl = document.getElementById('horn');
    let shoutEl = document.getElementById('shout');
    
    let noiseIndicator = document.getElementById('noise-indicator').components['noise-indicator'];

    hornEl.addEventListener('click', function() {
        noiseIndicator.display(false)
    });
    shoutEl.addEventListener('click', function() {
        noiseIndicator.display(true)
    });
});

window.onload = () => {
    let scene = document.querySelector('a-scene');
    if(scene.hasLoaded) {
        onSceneLoaded();
    } else {
        scene.addEventListener('loaded', onSceneLoaded);
    }
}
