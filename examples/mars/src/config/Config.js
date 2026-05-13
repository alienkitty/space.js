export const isMobile = !!navigator.maxTouchPoints;
export const isDebug = /[?&]debug/.test(location.search);
export const isPosition = /[?&]position/.test(location.search);
export const is4k = /[?&]4k/.test(location.search);

export const basePath = '/examples/mars/public';
export const assetPath = '/examples/assets';

export const numViews = 6;

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
    redTint: false,
    sunGlow: false,
    lights: false,
    stars: true,
    animate: !(isDebug || isPosition),
    speed: 0.2
};

export const store = {
    loading: '',
    viewIndex: 0,
    userIndex: 0,
    userPosition: null,
    userCaption: null
};

const searchParams = new URLSearchParams(location.search);

if (searchParams.has('view')) {
    store.userIndex = Number(searchParams.get('view')) - 1;
    store.viewIndex = store.userIndex;
}

if (searchParams.has('position')) {
    store.userPosition = searchParams.get('position').split(',').map(v => Number(v));
}

if (searchParams.has('caption')) {
    store.userCaption = searchParams.get('caption');
}
