/**
 * @author pschroen / https://ufo.ai/
 */

import { InstancedMeshPanel } from './objects/InstancedMeshPanel.js';

export * from './lights/LightPanelController.js';
export { AmbientLightPanel } from './lights/AmbientLightPanel.js';
export { HemisphereLightPanel } from './lights/HemisphereLightPanel.js';
export { DirectionalLightPanel } from './lights/DirectionalLightPanel.js';
export { PointLightPanel } from './lights/PointLightPanel.js';
export { SpotLightPanel } from './lights/SpotLightPanel.js';
export { RectAreaLightPanel } from './lights/RectAreaLightPanel.js';
export * from './materials/MaterialPanelController.js';
export { BasicMaterialOptions, BasicMaterialPanel } from './materials/BasicMaterialPanel.js';
export { BasicMaterialCommonPanel } from './materials/BasicMaterialCommonPanel.js';
export { BasicMaterialEnvPanel } from './materials/BasicMaterialEnvPanel.js';
export { LambertMaterialOptions, LambertMaterialPanel } from './materials/LambertMaterialPanel.js';
export { LambertMaterialCommonPanel } from './materials/LambertMaterialCommonPanel.js';
export { LambertMaterialEnvPanel } from './materials/LambertMaterialEnvPanel.js';
export { MatcapMaterialOptions, MatcapMaterialPanel } from './materials/MatcapMaterialPanel.js';
export { MatcapMaterialCommonPanel } from './materials/MatcapMaterialCommonPanel.js';
export { PhongMaterialOptions, PhongMaterialPanel } from './materials/PhongMaterialPanel.js';
export { PhongMaterialCommonPanel } from './materials/PhongMaterialCommonPanel.js';
export { PhongMaterialEnvPanel } from './materials/PhongMaterialEnvPanel.js';
export { ToonMaterialOptions, ToonMaterialPanel } from './materials/ToonMaterialPanel.js';
export { ToonMaterialCommonPanel } from './materials/ToonMaterialCommonPanel.js';
export { StandardMaterialOptions, StandardMaterialPanel } from './materials/StandardMaterialPanel.js';
export { StandardMaterialCommonPanel } from './materials/StandardMaterialCommonPanel.js';
export { StandardMaterialEnvPanel } from './materials/StandardMaterialEnvPanel.js';
export { PhysicalMaterialOptions, PhysicalMaterialPanel } from './materials/PhysicalMaterialPanel.js';
export { PhysicalMaterialCommonPanel } from './materials/PhysicalMaterialCommonPanel.js';
export { PhysicalMaterialClearcoatPanel } from './materials/PhysicalMaterialClearcoatPanel.js';
export { PhysicalMaterialIridescencePanel } from './materials/PhysicalMaterialIridescencePanel.js';
export { PhysicalMaterialAnisotropyPanel } from './materials/PhysicalMaterialAnisotropyPanel.js';
export { PhysicalMaterialSheenPanel } from './materials/PhysicalMaterialSheenPanel.js';
export { PhysicalMaterialTransmissionPanel } from './materials/PhysicalMaterialTransmissionPanel.js';
export { PhysicalMaterialEnvPanel } from './materials/PhysicalMaterialEnvPanel.js';
export { NormalMaterialOptions, NormalMaterialPanel } from './materials/NormalMaterialPanel.js';
export { NormalMaterialCommonPanel } from './materials/NormalMaterialCommonPanel.js';
export { InstancedMeshPanel } from './objects/InstancedMeshPanel.js';
export { MeshHelperPanel } from './objects/MeshHelperPanel.js';
export { OimoPhysicsPanel } from './physics/OimoPhysicsPanel.js';
export { MapPanel } from './textures/MapPanel.js';

// User-defined
export const MaterialPanels = {
    InstancedMeshPanel
};
