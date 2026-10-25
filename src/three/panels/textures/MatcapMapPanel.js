/**
 * @author pschroen / https://alienkitty.com/
 */

import { SRGBColorSpace, UVMapping } from 'three';

import { MapPanel } from './MapPanel.js';

export class MatcapMapPanel extends MapPanel {
    constructor(mesh, ui) {
        super(mesh, ui, 'matcap', UVMapping, SRGBColorSpace);
    }
}
