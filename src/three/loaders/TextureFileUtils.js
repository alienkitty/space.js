/**
 * @author pschroen / https://ufo.ai/
 */

export function setPanelTexture(panel, material, image, index = []) {
    if (index.length) {
        index = [index];
    }

    if (material.isMeshBasicMaterial) {
        panel.setPanelValue('Map', image, [['Basic', 1], ...index]);
    } else if (material.isMeshLambertMaterial) {
        panel.setPanelValue('Map', image, [['Lambert', 1], ...index]);
    } else if (material.isMeshMatcapMaterial) {
        panel.setPanelValue('Map', image, [['Matcap', 1], ...index]);
    } else if (material.isMeshPhongMaterial) {
        panel.setPanelValue('Map', image, [['Phong', 1], ...index]);
    } else if (material.isMeshToonMaterial) {
        panel.setPanelValue('Map', image, [['Toon', 1], ...index]);
    } else if (material.isMeshPhysicalMaterial) {
        panel.setPanelValue('Map', image, [['Physical', 1], ...index]);
    } else if (material.isMeshStandardMaterial) {
        panel.setPanelValue('Map', image, [['Standard', 1], ...index]);
    }
}
