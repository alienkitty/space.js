import { BasicMaterialOptions, LambertMaterialOptions, MatcapMaterialOptions, PhongMaterialOptions, PhysicalMaterialOptions, StandardMaterialOptions, ToonMaterialOptions } from '@alienkitty/space.js/three';

import { BasicMaterialAdjustmentsPanel } from './materials/BasicMaterialAdjustmentsPanel.js';
import { LambertMaterialAdjustmentsPanel } from './materials/LambertMaterialAdjustmentsPanel.js';
import { LambertMaterialSubsurfacePanel } from './materials/LambertMaterialSubsurfacePanel.js';
import { MatcapMaterialAdjustmentsPanel } from './materials/MatcapMaterialAdjustmentsPanel.js';
import { PhongMaterialAdjustmentsPanel } from './materials/PhongMaterialAdjustmentsPanel.js';
import { PhongMaterialSubsurfacePanel } from './materials/PhongMaterialSubsurfacePanel.js';
import { ToonMaterialAdjustmentsPanel } from './materials/ToonMaterialAdjustmentsPanel.js';
import { ToonMaterialSubsurfacePanel } from './materials/ToonMaterialSubsurfacePanel.js';
import { StandardMaterialAdjustmentsPanel } from './materials/StandardMaterialAdjustmentsPanel.js';
import { StandardMaterialSubsurfacePanel } from './materials/StandardMaterialSubsurfacePanel.js';
import { PhysicalMaterialAdjustmentsPanel } from './materials/PhysicalMaterialAdjustmentsPanel.js';
import { PhysicalMaterialSubsurfacePanel } from './materials/PhysicalMaterialSubsurfacePanel.js';
import { MeshHelperPanel } from './objects/MeshHelperPanel.js';
import { OimoPhysicsPanel } from './physics/OimoPhysicsPanel.js';

BasicMaterialOptions.set('Adjust', BasicMaterialAdjustmentsPanel);
BasicMaterialOptions.set('Helper', MeshHelperPanel);
BasicMaterialOptions.set('Physics', OimoPhysicsPanel);

LambertMaterialOptions.set('Subsurface', LambertMaterialSubsurfacePanel);
LambertMaterialOptions.set('Adjust', LambertMaterialAdjustmentsPanel);
LambertMaterialOptions.set('Helper', MeshHelperPanel);
LambertMaterialOptions.set('Physics', OimoPhysicsPanel);

MatcapMaterialOptions.set('Adjust', MatcapMaterialAdjustmentsPanel);
MatcapMaterialOptions.set('Helper', MeshHelperPanel);
MatcapMaterialOptions.set('Physics', OimoPhysicsPanel);

PhongMaterialOptions.set('Subsurface', PhongMaterialSubsurfacePanel);
PhongMaterialOptions.set('Adjust', PhongMaterialAdjustmentsPanel);
PhongMaterialOptions.set('Helper', MeshHelperPanel);
PhongMaterialOptions.set('Physics', OimoPhysicsPanel);

ToonMaterialOptions.set('Subsurface', ToonMaterialSubsurfacePanel);
ToonMaterialOptions.set('Adjust', ToonMaterialAdjustmentsPanel);
ToonMaterialOptions.set('Helper', MeshHelperPanel);
ToonMaterialOptions.set('Physics', OimoPhysicsPanel);

StandardMaterialOptions.set('Subsurface', StandardMaterialSubsurfacePanel);
StandardMaterialOptions.set('Adjust', StandardMaterialAdjustmentsPanel);
StandardMaterialOptions.set('Helper', MeshHelperPanel);
StandardMaterialOptions.set('Physics', OimoPhysicsPanel);

PhysicalMaterialOptions.set('Subsurface', PhysicalMaterialSubsurfacePanel);
PhysicalMaterialOptions.set('Adjust', PhysicalMaterialAdjustmentsPanel);
PhysicalMaterialOptions.set('Helper', MeshHelperPanel);
PhysicalMaterialOptions.set('Physics', OimoPhysicsPanel);
