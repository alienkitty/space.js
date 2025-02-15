/**
 * @author pschroen / https://ufo.ai/
 */

import {
    Box2,
    BoxGeometry,
    BufferGeometry,
    Float32BufferAttribute,
    MathUtils,
    Sphere,
    Vector2,
    Vector3,
    WebGLRenderTarget
} from 'three';

export function getFullscreenTriangle() {
    const geometry = new BufferGeometry();
    geometry.setAttribute('position', new Float32BufferAttribute([-1, 3, 0, -1, -1, 0, 3, -1, 0], 3));
    geometry.setAttribute('uv', new Float32BufferAttribute([0, 2, 0, 0, 2, 0], 2));

    return geometry;
}

export function getSphericalCube(radius, segments) {
    const geometry = new BoxGeometry(radius, radius, radius, segments, segments, segments);
    const vertices = geometry.getAttribute('position');
    const normals = geometry.getAttribute('normal');

    for (let i = 0, l = vertices.count; i < l; i++) {
        const v = new Vector3().fromArray(vertices.array, i * 3);
        v.normalize();
        normals.setXYZ(i, v.x, v.y, v.z);
        v.setLength(radius);
        vertices.setXYZ(i, v.x, v.y, v.z);
    }

    return geometry;
}

export function getBoundingSphereWorld(mesh) {
    mesh.geometry.computeBoundingSphere();

    return new Sphere().copy(mesh.geometry.boundingSphere).applyMatrix4(mesh.matrixWorld);
}

export function getScreenSpaceBox(mesh, camera) {
    const vertices = mesh.geometry.getAttribute('position');
    const worldPosition = new Vector3();
    const screenSpacePosition = new Vector3();
    const min = new Vector3(1, 1, 1);
    const max = new Vector3(-1, -1, -1);

    for (let i = 0, l = vertices.count; i < l; i++) {
        worldPosition.fromArray(vertices.array, i * 3).applyMatrix4(mesh.matrixWorld);
        screenSpacePosition.copy(worldPosition).project(camera);
        min.min(screenSpacePosition);
        max.max(screenSpacePosition);
    }

    return new Box2(min, max);
}

export function getViewSize(camera, offsetZ = 0) {
    const distance = camera.position.z - offsetZ;
    const target = new Vector2();

    return camera.getViewSize(distance, target);
}

export function lerpCameras(camera1, camera2, alpha) {
    if (camera1.fov !== camera2.fov || camera1.zoom !== camera2.zoom) {
        if (camera1.fov !== camera2.fov) {
            camera1.fov = MathUtils.lerp(camera1.fov, camera2.fov, alpha);
        }

        if (camera1.zoom !== camera2.zoom) {
            camera1.zoom = MathUtils.lerp(camera1.zoom, camera2.zoom, alpha);
        }

        camera1.updateProjectionMatrix();
    }

    camera1.position.lerp(camera2.position, alpha);
    camera1.quaternion.slerp(camera2.quaternion, alpha);
}

// Based on https://oframe.github.io/ogl/examples/?src=post-fluid-distortion.html by gordonnl
export function getDoubleRenderTarget(width, height, options) {
    const renderTarget = {
        read: new WebGLRenderTarget(width, height, options),
        write: new WebGLRenderTarget(width, height, options),
        swap: () => {
            const temp = renderTarget.read;
            renderTarget.read = renderTarget.write;
            renderTarget.write = temp;
        },
        setSize: (width, height) => {
            renderTarget.read.setSize(width, height);
            renderTarget.write.setSize(width, height);
        },
        dispose: () => {
            renderTarget.read.dispose();
            renderTarget.write.dispose();
        }
    };

    return renderTarget;
}
