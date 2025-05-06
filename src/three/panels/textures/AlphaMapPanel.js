/**
 * @author pschroen / https://ufo.ai/
 */

import { MapPanel } from './MapPanel.js';

export class AlphaMapPanel extends MapPanel {
    constructor(mesh) {
        super(mesh, 'alphaMap');
    }
}
