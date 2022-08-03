require('aframe');
require('./game-manager');
require('./player-controller');
require('./noise-indicator');
require('./aabb-collider');
require('./interactable');
require('./interactable-pool');
require('./coin-pool');
require('./coin');
require('./bike-train-pool');
require('./bike-train-member');
require('./noise-meter');
require('aframe-extras.animation-mixer');
require('./aframe-street-component');

window.lanes = 3
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const lanesParam = urlParams.get('lanes');

if(lanesParam) {
    const lanes = Number(lanesParam);
    window.lanes = lanes
}