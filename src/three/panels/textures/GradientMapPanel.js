/**
 * @author pschroen / https://ufo.ai/
 */

import { MapPanel } from './MapPanel.js';

export class GradientMapPanel extends MapPanel {
    constructor(mesh) {
        super(mesh, 'gradientMap');
    }
}
