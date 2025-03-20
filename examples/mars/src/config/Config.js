export const isDebug = /[?&]debug/.test(location.search);

export const basePath = '/examples/mars/public';
export const assetPath = '/examples/assets';

export const colors = {
    backgroundColor: 0x000000,
    lightColor: 0x3b5b89
};

export const layers = {
    default: 0,
    background: 1,
    occlusion: 2
};

export const params = {
    animate: !isDebug,
    speed: 0.5
};

export const store = {
    loading: ''
};
