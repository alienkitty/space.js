import { Interface } from 'space.js/three';

export class Trackers extends Interface {
    constructor() {
        super('.trackers');

        this.initHTML();
    }

    initHTML() {
        this.css({
            position: 'absolute',
            left: 0,
            top: 0,
            width: '100%',
            height: '100%',
            zIndex: 2,
            pointerEvents: 'none',
            webkitUserSelect: 'none',
            userSelect: 'none'
        });
    }
}
