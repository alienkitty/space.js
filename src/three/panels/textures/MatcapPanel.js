/**
 * @author pschroen / https://ufo.ai/
 */

import { MapPanel } from './MapPanel.js';

export class MatcapPanel extends MapPanel {
    constructor(mesh) {
        super(mesh, 'matcap');
    }
}
