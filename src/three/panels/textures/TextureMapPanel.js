/**
 * @author pschroen / https://ufo.ai/
 */

import { SRGBColorSpace, UVMapping } from 'three';

import { MapPanel } from './MapPanel.js';

export class TextureMapPanel extends MapPanel {
    constructor(mesh) {
        super(mesh, 'map', UVMapping, SRGBColorSpace);
    }
}
