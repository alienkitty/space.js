import { Panel, PanelItem, getKeyByValue } from '@alienkitty/space.js/three';

export class TransmissionMaterialBackPanel extends Panel {
    constructor(mesh) {
        super();

        this.mesh = mesh;

        this.initPanel();
    }

    initPanel() {
        const mesh = this.mesh;

        const backsideOptions = {
            Off: false,
            On: true
        };

        const backsideItems = [
            {
                type: 'divider'
            },
            {
                type: 'slider',
                label: 'Rough',
                min: 0,
                max: 2,
                step: 0.01,
                value: mesh.userData.backsideRoughness,
                callback: value => {
                    mesh.userData.backsideRoughness = value;
                }
            },
            {
                type: 'slider',
                label: 'Thick',
                min: -10,
                max: 10,
                step: 0.1,
                value: mesh.userData.backsideThickness,
                callback: value => {
                    mesh.userData.backsideThickness = value;
                }
            }
        ];

        const items = [
            {
                type: 'divider'
            },
            {
                type: 'list',
                list: backsideOptions,
                value: getKeyByValue(backsideOptions, mesh.userData.backside),
                callback: (value, panel) => {
                    if (!panel.group) {
                        const backsidePanel = new Panel();
                        backsidePanel.animateIn(true);

                        backsideItems.forEach(data => {
                            backsidePanel.add(new PanelItem(data));
                        });

                        panel.setContent(backsidePanel);
                    }

                    mesh.userData.backside = backsideOptions[value];

                    if (mesh.userData.backside) {
                        panel.group.show();
                    } else {
                        panel.group.hide();
                    }
                }
            }
        ];

        items.forEach(data => {
            this.add(new PanelItem(data));
        });
    }
}
