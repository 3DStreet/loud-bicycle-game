import { GAME_STATE, GAME_STATES, gameManager } from "./game-manager";
import { interactablePool } from "./interactable-pool";

const LOW_METER_THRESHOLD = 20;
const METER_INTERVAL_MS = 300;
const METER_INTERVAL_INCREASE = 5;
const SMALL_NOISE_USAGE = 5;
const BIG_NOISE_USAGE = 30;
const BROKEN_REACTIVATE_THRESHHOLD = 60;
const BROKEN_REACTIVATE_THRESHHOLD_RAY = 100;


const NOISE_USAGE = {
                     'special-meter': 0,
                     'main-meter': 30,
                     'ray-meter': 100,
                     classic: 10,
                     mini: 5
                   }

const noiseMeters = {};

AFRAME.registerComponent('noise-meter', {
    schema: {
        clickerId: {default: ''},
        meterId: {default: ''},
        isSmall: {default: false, type: 'boolean'},
        keyCode: {default: ''},
        lightId: {default: ''}
    },
    init: function() {
        this.meter = 100;
        this.lastTickUpdate = 0;
        this.threshhold = this.data.clickerId === 'ray' ? BROKEN_REACTIVATE_THRESHHOLD_RAY : BROKEN_REACTIVATE_THRESHHOLD;
        this.tempVec = new THREE.Vector3();

        this.addEvents();
        noiseMeters[this.data.clickerId] = this;
        this.otherId = this.data.clickerId === 'horn' ? 'shout' : 'horn';

        if(this.data.lightId) {
            this.light = document.getElementById(this.data.lightId);
        }
    },
    tick: function(_t, dt) {
        if (GAME_STATE === GAME_STATES.PLAYING && this.noiseIndicator) {
            if(!this.displaying || this.broken) {
                const increase = (dt * METER_INTERVAL_INCREASE)/METER_INTERVAL_MS;
                this.meter += increase;
                this.meter = Math.min(100, this.meter);
                if(this.broken && this.meter >= this.threshhold) {
                    this.broken = false;
                    this.meterEl.className = 'high-meter';
                    this.clickerEl.classList.remove('disabled');
                }
            } else {
                const decrease = (dt * NOISE_USAGE[this.data.meterId])/METER_INTERVAL_MS;
                this.meter -= decrease;
                this.meter = Math.max(0, this.meter);
                if(this.hasLowMeter()) {
                    this.breakIndicator();
                }
            }
            this.updateMeter();
        
            if(this.light) {
                this.noiseIndicator.el.object3D.getWorldPosition(this.tempVec);
                this.tempVec.y += 2.0;
                this.light.object3D.position.copy(this.tempVec);
            }
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
            window.addEventListener("keydown", this.onKeyPressed.bind(this));
            window.addEventListener("keyup", this.onKeyReleased.bind(this));
        }

        this.clickerEl = document.getElementById(this.data.clickerId);
        this.meterEl = document.getElementById(this.data.meterId);

        this.clickerEl.addEventListener('pointerdown', () => {
            if (!this.clickerEl.classList.contains('disabled')) {
                this.onPressed();
            }
        });

        if(this.data.meterId === 'special-meter') {
            this.el.addEventListener('sound-ended', () => {
                this.hideIndicator();
            });
        } else if(this.data.meterId === 'ray-meter') {
            this.el.addEventListener('sound-ended', () => {
                gameManager.enableAmbientAudio();
            });
        }

        document.addEventListener('pointerup', () => {
            if(this.data.meterId === 'main-meter') this.hideIndicator();
        });
    },
    onSceneLoaded: function() {
        this.noiseIndicator = document.getElementById('noise-indicator').components['noise-indicator'];
        this.sound = this.el.components.sound;
    },
    onPressed: function() {
        if(this.data.meterId === 'ray-meter' && !this.displaying) this.displayVFX();
        else this.displayIndicator();
    },
    onKeyPressed: function(e) {
        if (e.key === this.data.keyCode && GAME_STATE === GAME_STATES.PLAYING && !e.repeat) {
            this.onPressed();
        }
    },
    onKeyReleased: function(e) {
        if (e.key === this.data.keyCode && this.data.meterId === 'main-meter') {
            this.hideIndicator();
        }
    },
    updateMeter: function() {
        this.meterEl.value = this.meter;
    },
    hasLowMeter: function() {
        return this.meter < LOW_METER_THRESHOLD;
    },
    displayVFX: function() {
        let otherIds = Object.keys(noiseMeters);
        if (this.hasLowMeter() || !this.enabled || this.broken || noiseMeters[otherIds[0]].displaying|| noiseMeters[otherIds[1]].displaying|| noiseMeters[otherIds[2]].displaying) return;

        if(this.light) this.light.emit('startAnimation');

        gameManager.disableAmbientAudio();
        interactablePool.convertAllToBikes();
        gameManager.clearFog();

        this.sound.playSound();
        this.displaying = true;
    },
    displayIndicator: function() {
        console.log('di');
        let otherIds = Object.keys(noiseMeters);
        if (this.hasLowMeter() || this.broken || noiseMeters[otherIds[2]].displaying) {
            if(this.data.meterId === 'special-meter') {
                this.sound.stopSound();
                this.sound.playSound();
            } 
            return;
        }

        if(this.data.meterId === 'main-meter') {
            gameManager.playShout();
        } else {
            this.sound.stopSound();
            this.sound.playSound();
        }

        this.displaying = true;
        this.noiseIndicator.display(this.data.isSmall);
    },
    hideIndicator: function() {
        if(!this.displaying) return;
        this.noiseIndicator.hide();
        this.displaying = false;
        if(this.data.meterId === 'main-meter') gameManager.stopShout();
        else this.sound.stopSound();
    },
    breakIndicator: function() {
        this.noiseIndicator.hide();
        this.displaying = false;
        this.broken = true;
        this.meterEl.className = 'low-meter';
        this.clickerEl.classList.add('disabled');
        if(this.data.meterId === 'main-meter') gameManager.stopShout();
        if(this.data.meterId === 'special-meter') this.sound.stopSound();
    }
  });
