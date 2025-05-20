/**
 * @author pschroen / https://ufo.ai/
 */

import { Mesh, MeshBasicMaterial, OrthographicCamera, WebGLRenderer } from 'three';

import { getFullscreenTriangle, getSphericalCube } from '../../utils/Utils3D.js';

let renderer;
let camera;
let screen;
let ball;

export function getThumbnail(texture, size = 200) {
    if (!renderer) {
        renderer = new WebGLRenderer({
            alpha: true,
            antialias: true,
            depth: false
        });

        camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
    }

    if (!screen) {
        screen = new Mesh(
            getFullscreenTriangle(),
            new MeshBasicMaterial({ transparent: true })
        );
        screen.frustumCulled = false;
    }

    screen.material.map = texture;
    screen.material.needsUpdate = true;

    renderer.setSize(size, size);
    renderer.clear();
    renderer.render(screen, camera);

    const image = new Image();
    image.src = renderer.domElement.toDataURL();

    return image;
}

export function getBallThumbnail(texture, size = 200) {
    if (!renderer) {
        renderer = new WebGLRenderer({
            alpha: true,
            antialias: true,
            depth: false
        });

        camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
    }

    if (!ball) {
        ball = new Mesh(
            getSphericalCube(),
            Array.from({ length: 6 }, () => new MeshBasicMaterial({ transparent: true }))
        );
        ball.frustumCulled = false;
    }

    if (Array.isArray(texture)) {
        for (let i = 0, l = ball.material.length; i < l; i++) {
            ball.material[i].map = texture[i];
            ball.material[i].needsUpdate = true;
        }
    } else {
        for (let i = 0, l = ball.material.length; i < l; i++) {
            ball.material[i].envMap = texture;
            ball.material[i].needsUpdate = true;
        }
    }

    renderer.setSize(size, size);
    renderer.clear();
    renderer.render(ball, camera);

    const image = new Image();
    image.src = renderer.domElement.toDataURL();

    return image;
}
