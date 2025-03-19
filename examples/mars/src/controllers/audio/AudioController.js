import { WebAudio } from '@alienkitty/space.js/three';

export class AudioController {
    static init() {
        this.addListeners();
    }

    static addListeners() {
        document.addEventListener('visibilitychange', this.onVisibility);
    }

    // Event handlers

    static onVisibility = () => {
        if (document.hidden) {
            WebAudio.mute();
        } else {
            WebAudio.unmute();
        }
    };

    // Public methods

    static trigger = event => {
        switch (event) {
            case 'mars_start':
                WebAudio.fadeInAndPlay('enough_loop', 0.05, true, 2000, 'linear');
                break;
        }
    };
}
