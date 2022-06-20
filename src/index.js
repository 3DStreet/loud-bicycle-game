require('aframe');

window.onload = (function() {
    var hornEl = document.getElementById('horn');
    var shoutEl = document.getElementById('shout');

    hornEl.addEventListener('click', function() {
        console.log('HORN!');
    });
    shoutEl.addEventListener('click', function() {
        console.log('SHOUT!');
    });
});
