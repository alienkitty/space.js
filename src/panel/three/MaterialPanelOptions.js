/**
 * @author pschroen / https://ufo.ai/
 */

import { AddOperation, BackSide, DoubleSide, FrontSide, MixOperation, MultiplyOperation } from 'three';

export const VisibleOptions = {
    Off: false,
    Visible: true
};

export const SideOptions = {
    Front: FrontSide,
    Back: BackSide,
    Double: DoubleSide
};

export const FlatShadingOptions = {
    Off: false,
    Flat: true
};

export const WireframeOptions = {
    Off: false,
    Wire: true
};

export const CombineOptions = {
    Multiply: MultiplyOperation,
    Mix: MixOperation,
    Add: AddOperation
};
