import { MaterialPanelController, Point3D } from '@alienkitty/space.js/three';

export class ScenePanelController {
    static init(view) {
        this.view = view;

        this.initPanel();
    }

    static initPanel() {
        const objects = [this.view];

        objects.forEach(object => {
            const { material } = object.mesh;

            object.point = new Point3D(object.mesh);
            object.add(object.point);

            MaterialPanelController.init(object.point, material);
        });
    }
}
