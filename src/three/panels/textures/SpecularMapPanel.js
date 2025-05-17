/**
 * @author pschroen / https://ufo.ai/
 */

import { MapPanel } from './MapPanel.js';

export class SpecularMapPanel extends MapPanel {
    constructor(mesh, ui) {
        super(mesh, ui, 'specularMap');
    }
}
