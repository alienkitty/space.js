/**
 * @author pschroen / https://ufo.ai/
 */

import {
    AddOperation,
    BackSide,
    ClampToEdgeWrapping,
    DoubleSide,
    EquirectangularReflectionMapping,
    EquirectangularRefractionMapping,
    FrontSide,
    LinearSRGBColorSpace,
    MirroredRepeatWrapping,
    MixOperation,
    MultiplyOperation,
    NoColorSpace,
    ObjectSpaceNormalMap,
    RepeatWrapping,
    SRGBColorSpace,
    TangentSpaceNormalMap,
    UVMapping
} from 'three';

export const VisibleOptions = new Map([
    ['Off', false],
    ['Visible', true]
]);

export const SideOptions = new Map([
    ['Front', FrontSide],
    ['Back', BackSide],
    ['Double', DoubleSide]
]);

export const InstanceOptions = new Map([
    ['Mesh', false],
    ['Instance', true]
]);

export const FlatShadingOptions = new Map([
    ['Off', false],
    ['Flat', true]
]);

export const WireframeOptions = new Map([
    ['Off', false],
    ['Wire', true]
]);

export const FogOptions = new Map([
    ['Off', false],
    ['Fog', true]
]);

export const ToneMappedOptions = new Map([
    ['Off', false],
    ['Tone', true]
]);

export const CombineOptions = new Map([
    ['Multiply', MultiplyOperation],
    ['Mix', MixOperation],
    ['Add', AddOperation]
]);

export const BackgroundMappingOptions = new Map([
    ['UV', UVMapping],
    ['Reflect', EquirectangularReflectionMapping]
]);

export const RefractionMappingOptions = new Map([
    ['Off', EquirectangularReflectionMapping],
    ['Refract', EquirectangularRefractionMapping]
]);

export const WrapOptions = new Map([
    ['Repeat', RepeatWrapping],
    ['Clamp', ClampToEdgeWrapping],
    ['Mirror', MirroredRepeatWrapping]
]);

export const ColorSpaceOptions = new Map([
    ['None', NoColorSpace],
    ['SRGB', SRGBColorSpace],
    ['Linear', LinearSRGBColorSpace]
]);

export const NormalMapOptions = new Map([
    ['Tan', TangentSpaceNormalMap],
    ['Obj', ObjectSpaceNormalMap]
]);

export const HelperOptions = new Map([
    ['Off', false],
    ['Helper', true]
]);

export const NormalsHelperOptions = new Map([
    ['Off', false],
    ['Normals', true]
]);

export const TangentsHelperOptions = new Map([
    ['Off', false],
    ['Tangents', true]
]);

export const UVHelperOptions = new Map([
    ['Off', false],
    ['UV', true]
]);

export const DisplayOptions = new Map([
    ['Default', 0],
    ['Velocity', 1],
    ['Geometry', 2],
    ['Matcap1', 3],
    ['Matcap2', 4],
    ['Depth', 5],
    ['Luma', 6],
    ['Bloom', 7]
]);
