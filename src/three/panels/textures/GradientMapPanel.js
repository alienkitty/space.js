/**
 * @author pschroen / https://alienkitty.com/
 */

import { MapPanel } from './MapPanel.js';

export class GradientMapPanel extends MapPanel {
    constructor(mesh, ui) {
        super(mesh, ui, 'gradientMap');
    }
}
