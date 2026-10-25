/**
 * Panel options for three.js.
 *
 * @see {@link https://github.com/alienkitty/space.js/blob/main/src/three/panels/Options.js | Source}
 */

import type { ColorSpace, Combine, Mapping, NormalMapTypes, Side, Wrapping } from 'three';

export const VisibleOptions: Map<string, boolean>;
export const SideOptions: Map<string, Side>;
export const InstanceOptions: Map<string, boolean>;
export const FlatShadingOptions: Map<string, boolean>;
export const WireframeOptions: Map<string, boolean>;
export const FogOptions: Map<string, boolean>;
export const ToneMappedOptions: Map<string, boolean>;
export const CombineOptions: Map<string, Combine>;
export const BackgroundMappingOptions: Map<string, Mapping>;
export const RefractionMappingOptions: Map<string, Mapping>;
export const WrappingOptions: Map<string, Wrapping>;
export const ColorSpaceOptions: Map<string, ColorSpace>;
export const NormalMapOptions: Map<string, NormalMapTypes>;
export const HelperOptions: Map<string, boolean>;
export const DisplayOptions: Map<string, number>;
