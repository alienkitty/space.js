import { Point3D } from '@alienkitty/space.js/three';

import { Data } from '../../data/Data.js';
// import { WorldController } from '../world/WorldController.js';

export class ScenePanelController {
    static init(view) {
        this.view = view;

        this.initPanel();

        this.addListeners();
    }

    static initPanel() {
        const { stars } = this.view;

        const objects = [stars];

        objects.forEach(object => {
            object.point = new Point3D(object.points, {
                name: '',
                type: '',
                noLine: true,
                noPoint: true
            });
            object.add(object.point);
        });
    }

    static addListeners() {
        Point3D.events.on('hover', this.onHover);
        Point3D.events.on('click', this.onClick);
    }

    // Event handlers

    static onHover = ({ type, index, target }) => {
        console.log('onHover', type, index, target, Data.stars[index]);
        target.setData({ primary: Data.stars[index].name });
    };

    static onClick = ({ index, target }) => {
        console.log('onClick', index, target, Data.stars[index]);
        target.setData({ index, primary: Data.stars[index].name }); // Set label on instance
        target.setData({ primary: '' });
        // WorldController.setPoint(Data.stars[index].position);
    };
}
