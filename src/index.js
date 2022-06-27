require('aframe');
require('./player-controller');
require('./noise-indicator');
require('./aabb-collider');

const onSceneLoaded = (function() {
    let hornEl = document.getElementById('horn');
    let shoutEl = document.getElementById('shout');

    let noiseIndicator = document.getElementById('noise-indicator').components['noise-indicator'];

    hornEl.addEventListener('click', function() {
        noiseIndicator.display()
    });
    shoutEl.addEventListener('click', function() {
        console.log('SHOUT!');
    });
});

window.onload = () => {
    document.querySelector('a-scene').addEventListener('loaded', onSceneLoaded)
}
