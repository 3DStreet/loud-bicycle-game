require('aframe');
require('./game-manager');
require('./player-controller');
require('./noise-indicator');
require('./aabb-collider');
require('./interactable');
require('./interactable-pool');
require('./noise-meter');

window.lanes = 3
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const lanes = Number(urlParams.get('lanes'));
console.log('lanes', lanes);
if (lanes === 1) {
    window.lanes = lanes
}
