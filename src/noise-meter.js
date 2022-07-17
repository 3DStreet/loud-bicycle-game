import { GAME_STATE, GAME_STATES } from "./game-manager";

const LOW_METER_THRESHOLD = 20;
const METER_INTERVAL_MS = 300;
const METER_INTERVAL_INCREASE = 5;
const SMALL_NOISE_USAGE = 5;
const BIG_NOISE_USAGE = 10;

AFRAME.registerComponent('noise-meter', {
    schema: {
        clickerId: {default: ''},
        meterId: {default: ''},
        isSmall: {default: false, type: 'boolean'},
        keyCode: {default: ''}
    },
    init: function() {
        this.meter = 0;
        this.lastTickUpdate = 0;
        
        this.addEvents();
    },
    tick: function(_t, dt) {
        if (GAME_STATE === GAME_STATES.PLAYING && this.noiseIndicator && !this.noiseIndicator.isActive) {
            const increase = (dt * METER_INTERVAL_INCREASE)/METER_INTERVAL_MS;
            this.meter += increase;
            this.meter = Math.min(100, this.meter);
            this.updateMeter();
        }
    },
    addEvents: function() {
        const scene = document.querySelector('a-scene');
        if (scene.hasLoaded) {
            this.onSceneLoaded();
        } else {
            scene.addEventListener('loaded', this.onSceneLoaded.bind(this));
        }

        if (this.data.keyCode) {
            window.addEventListener("keypress", this.onKeyPressed.bind(this));
        }

        this.clickerEl = document.getElementById(this.data.clickerId);
        this.meterEl = document.getElementById(this.data.meterId);
        
        this.clickerEl.addEventListener('click', () => {
            if (!this.clickerEl.classList.contains('disabled')) {
                this.displayIndicator();
            }
        });
    },
    onSceneLoaded: function() {
        this.noiseIndicator = document.getElementById('noise-indicator').components['noise-indicator'];
    },
    onKeyPressed: function(e) {
        if (e.key === this.data.keyCode) {
            this.displayIndicator();
        }
    },
    updateMeter: function() {
        this.meterEl.value = this.meter;
        if (this.hasLowMeter()) {
            this.meterEl.className = 'low-meter';
            this.clickerEl.classList.add('disabled');
        } else {
            this.meterEl.className = 'high-meter';
            this.clickerEl.classList.remove('disabled');
        }
    },
    hasLowMeter: function() {
        return this.meter < LOW_METER_THRESHOLD;
    },
    displayIndicator: function() {
        if (this.hasLowMeter()) {
            return;
        }
        this.noiseIndicator.display(this.data.isSmall);
        this.meter -= this.data.isSmall ? SMALL_NOISE_USAGE : BIG_NOISE_USAGE;
        this.updateMeter();
    }
  });
