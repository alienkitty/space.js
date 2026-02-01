import { Panel, PanelItem, getKeyByValue } from '@alienkitty/space.js/three';

export class MeshHelperPanel extends Panel {
    constructor(mesh, ui) {
        super();

        this.mesh = mesh;
        this.ui = ui;

        this.initPanel();
    }

    initPanel() {
        const mesh = this.mesh;
        const ui = this.ui;

        let point;

        if (ui.constructor.points) {
            point = ui.constructor.getPoint(mesh);
        }

        // Defaults
        if (mesh.userData.normals === undefined) {
            mesh.userData.normals = false;
        }

        if (mesh.userData.tangents === undefined) {
            mesh.userData.tangents = false;
        }

        if (mesh.userData.uv === undefined) {
            mesh.userData.uv = false;
        }

        const normalsHelperOptions = new Map([
            ['Off', false],
            ['Normals', true]
        ]);

        const tangentsHelperOptions = new Map([
            ['Off', false],
            ['Tangents', true]
        ]);

        const uvHelperOptions = new Map([
            ['Off', false],
            ['UV', true]
        ]);

        const items = [
            {
                type: 'divider'
            },
            {
                type: 'list',
                name: 'Normals',
                list: normalsHelperOptions,
                value: getKeyByValue(normalsHelperOptions, mesh.userData.normals),
                callback: value => {
                    mesh.userData.normals = normalsHelperOptions.get(value);

                    if (point) {
                        point.toggleNormalsHelper(mesh.userData.normals);
                    }
                }
            }
        ];

        if (mesh.geometry.index) {
            items.push(
                {
                    type: 'list',
                    name: 'Tangents',
                    list: tangentsHelperOptions,
                    value: getKeyByValue(tangentsHelperOptions, mesh.userData.tangents),
                    callback: value => {
                        mesh.userData.tangents = tangentsHelperOptions.get(value);

                        if (point) {
                            point.toggleTangentsHelper(mesh.userData.tangents);
                        }
                    }
                }
            );
        }

        if (ui.constructor.uvHelper) {
            items.push(
                {
                    type: 'list',
                    name: 'UV',
                    list: uvHelperOptions,
                    value: getKeyByValue(uvHelperOptions, mesh.userData.uv),
                    callback: value => {
                        mesh.userData.uv = uvHelperOptions.get(value);
                        point.toggleUVHelper(mesh.userData.uv);
                    }
                }
                // TODO: Texture thumbnails
            );
        }

        items.forEach(data => {
            this.add(new PanelItem(data));
        });
    }
}
