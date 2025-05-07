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

export const VisibleOptions = {
    Off: false,
    Visible: true
};

export const SideOptions = {
    Front: FrontSide,
    Back: BackSide,
    Double: DoubleSide
};

export const InstanceOptions = {
    Mesh: false,
    Instance: true
};

export const FlatShadingOptions = {
    Off: false,
    Flat: true
};

export const WireframeOptions = {
    Off: false,
    Wire: true
};

export const FogOptions = {
    Off: false,
    Fog: true
};

export const ToneMappedOptions = {
    Off: false,
    Tone: true
};

export const CombineOptions = {
    Multiply: MultiplyOperation,
    Mix: MixOperation,
    Add: AddOperation
};

export const BackgroundMappingOptions = {
    UV: UVMapping,
    Reflect: EquirectangularReflectionMapping,
    Refract: EquirectangularRefractionMapping
};

export const EnvironmentMappingOptions = {
    Reflect: EquirectangularReflectionMapping,
    Refract: EquirectangularRefractionMapping
};

export const WrapOptions = {
    Repeat: RepeatWrapping,
    Clamp: ClampToEdgeWrapping,
    Mirror: MirroredRepeatWrapping
};

export const ColorSpaceOptions = {
    None: NoColorSpace,
    SRGB: SRGBColorSpace,
    Linear: LinearSRGBColorSpace
};

export const NormalMapOptions = {
    Tan: TangentSpaceNormalMap,
    Obj: ObjectSpaceNormalMap
};

export const HelperOptions = {
    Off: false,
    Helper: true
};

export const NormalsHelperOptions = {
    Off: false,
    Normals: true
};

export const TangentsHelperOptions = {
    Off: false,
    Tangents: true
};

export const UVHelperOptions = {
    Off: false,
    UV: true
};

export const DisplayOptions = {
    Default: 0,
    Velocity: 1,
    Geometry: 2,
    Matcap1: 3,
    Matcap2: 4,
    Depth: 5,
    Luma: 6,
    Bloom: 7
};
