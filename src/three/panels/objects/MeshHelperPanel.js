/**
 * @author pschroen / https://ufo.ai/
 */

import { Point3D } from '../../ui/Point3D.js';
import { Panel } from '../../../panels/Panel.js';
import { PanelItem } from '../../../panels/PanelItem.js';
import { NormalsHelperOptions, TangentsHelperOptions, UVHelperOptions } from '../Options.js';

import { getKeyByValue } from '../../../utils/Utils.js';

export class MeshHelperPanel extends Panel {
    constructor(mesh) {
        super();

        this.mesh = mesh;

        this.initPanel();
    }

    initPanel() {
        const mesh = this.mesh;
        const point = Point3D.getPoint(mesh);

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

        const items = [
            {
                type: 'divider'
            },
            {
                type: 'list',
                name: 'Normals',
                list: NormalsHelperOptions,
                value: getKeyByValue(NormalsHelperOptions, mesh.userData.normals),
                callback: value => {
                    mesh.userData.normals = NormalsHelperOptions[value];
                    point.toggleNormalsHelper(mesh.userData.normals);
                }
            }
        ];

        if (mesh.geometry.index) {
            items.push(
                {
                    type: 'list',
                    name: 'Tangents',
                    list: TangentsHelperOptions,
                    value: getKeyByValue(TangentsHelperOptions, mesh.userData.tangents),
                    callback: value => {
                        mesh.userData.tangents = TangentsHelperOptions[value];
                        point.toggleTangentsHelper(mesh.userData.tangents);
                    }
                }
            );
        }

        if (Point3D.uvHelper) {
            items.push(
                {
                    type: 'list',
                    name: 'UV',
                    list: UVHelperOptions,
                    value: getKeyByValue(UVHelperOptions, mesh.userData.uv),
                    callback: value => {
                        mesh.userData.uv = UVHelperOptions[value];
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
