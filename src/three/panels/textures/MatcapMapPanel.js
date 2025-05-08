/**
 * @author pschroen / https://ufo.ai/
 */

import { SRGBColorSpace, UVMapping } from 'three';

import { MapPanel } from './MapPanel.js';

export class MatcapMapPanel extends MapPanel {
    constructor(mesh) {
        super(mesh, 'matcap', UVMapping, SRGBColorSpace);
    }
}
