export const isDebug = /[?&]debug/.test(location.search);

export const layers = {
    default: 0,
    buffers: 1,
    picking: 30 // Second last layer, 31 is reserved for `Point3D` raycasting
};

export const params = {
    animate: true
};
