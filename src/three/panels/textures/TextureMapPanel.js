/**
 * @author pschroen / https://ufo.ai/
 */

import { SRGBColorSpace } from 'three';

import { MapPanel } from './MapPanel.js';

export class TextureMapPanel extends MapPanel {
    constructor(mesh) {
        super(mesh, 'map', SRGBColorSpace);
    }
}
