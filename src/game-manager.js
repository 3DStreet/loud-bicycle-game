export const GAME_STATES = {
    PLAYING: 0,
    END: 1,
    MENU: 2,
}

export let GAME_STATE = GAME_STATES.MENU;

export let gameManager;

AFRAME.registerComponent('game-manager', {
    schema: {
    },
    init: function() {
        gameManager = this;
        setTimeout(() => {
            this.interactablePool = document.querySelector('[interactable-pool]').components['interactable-pool'];
            this.levelAnimation = document.querySelector('#level').components.animation;
            this.headerLabel = document.querySelector('#game-state-header');
            this.playLevel();
        }, 100);
    },
    stopLevel: function() {
        this.levelAnimation.animation.pause();
        this.interactablePool.stop();
        GAME_STATE = GAME_STATES.END;
        this.headerLabel.innerText = "Stopped"
    },
    playLevel: function() {
        this.levelAnimation.animation.play();
        this.interactablePool.start();
        GAME_STATE = GAME_STATES.PLAYING;
        this.headerLabel.innerText = "Playing"
    },
});
