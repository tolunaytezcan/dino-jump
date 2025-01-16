import { createSoundEffects } from '../../utils/createSoundEffects';

class SoundManager {
    constructor() {
        this.sounds = null;
        this.initialized = false;
    }

    initialize() {
        if (!this.initialized) {
            this.sounds = createSoundEffects();
            this.initialized = true;
        }
    }

    play(soundName) {
        if (!this.initialized) {
            this.initialize();
        }

        const sound = this.sounds[soundName];
        if (sound) {
            sound();
        }
    }

    stopAll() {
    }
}

export default new SoundManager(); 