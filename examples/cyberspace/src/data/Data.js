import { MathUtils } from 'three';

import { CyberspaceStar } from './CyberspaceStar.js';

export class Data {
    static init(buffer, geoip) {
        const view = new DataView(buffer);
        const decoder = new TextDecoder();
        let offset = 0;

        const length = view.getUint32(offset, true); offset += 4;
        const stars = [];

        for (let i = 0; i < length; i++) {
            const star = new CyberspaceStar();
            star.id = view.getUint32(offset, true); offset += 4;
            star.name = decoder.decode(view.buffer.slice(offset, offset + 32)).replace(/\0/g, '') || 'Unknown'; offset += 32;
            star.position.x = view.getFloat32(offset, true) * 500; offset += 4;
            star.position.y = view.getFloat32(offset, true) * 500; offset += 4;
            star.position.z = view.getFloat32(offset, true) * 500; offset += 4;
            star.color.r = view.getUint8(offset) / 255; offset += 1;
            star.color.g = view.getUint8(offset) / 255; offset += 1;
            star.color.b = view.getUint8(offset) / 255; offset += 1;
            // star.alpha = view.getUint8(offset) / 255; offset += 1;
            star.alpha = MathUtils.mapLinear(view.getUint8(offset) / 255, 0, 1, 0.25, 1); offset += 1;
            stars.push(star);

            if (star.id === geoip.geoname_id) {
                this.id = star.id;
                this.point = star.position.clone();
            }
        }

        this.stars = stars;
        this.geoip = geoip;
    }
}
