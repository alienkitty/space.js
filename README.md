# Space.js

[![NPM Package][npm]][npm-url]
[![NPM Downloads][npm-downloads]][npmtrends-url]
[![DeepScan][deepscan]][deepscan-url]
[![Discord][discord]][discord-url]

This library is part of two sibling libraries, [Space.js](https://github.com/alienkitty/space.js) for UI, Panel components, Tween, Web Audio, loaders, utilities, and [Alien.js](https://github.com/alienkitty/alien.js) for 3D utilities, materials, shaders and physics.

<p>
    <img src="https://github.com/alienkitty/space.js/raw/main/space.js.png" alt="Space.js">
</p>

### Usage

Space.js is divided into two entry points depending on your use case.

The main entry point without any dependencies is for the UI components, loaders and utilities.

```sh
npm i @alienkitty/space.js
```

Math classes:

```js
import { Color, Vector2 } from '@alienkitty/space.js';
```

Panel components:

```js
import { Panel, PanelItem } from '@alienkitty/space.js';

const panel = new Panel();
const item = new PanelItem({
    // name: 'FPS'
    // type: 'spacer'
    // type: 'divider'
    // type: 'link'
    // type: 'thumbnail'
    // type: 'graph'
    // type: 'meter'
    // type: 'list'
    // type: 'slider'
    // type: 'content'
    type: 'color'
});
panel.add(item);
panel.animateIn();
document.body.appendChild(panel.element);

function animate() {
    requestAnimationFrame(animate);

    panel.update();
}

requestAnimationFrame(animate);
```

HUD (heads-up display) components:

```js
import { UI } from '@alienkitty/space.js';

const ui = new UI({
    fps: true
    // header
    // menu
    // info
    // details
    // instructions
    // detailsButton
    // muteButton
    // audioButton
});
ui.animateIn();
document.body.appendChild(ui.element);

function animate() {
    requestAnimationFrame(animate);

    ui.update();
}

requestAnimationFrame(animate);
```

Graph and meter components:

```js
import { Graph } from '@alienkitty/space.js';

const graph = new Graph({
    value: Array.from({ length: 10 }, () => Math.random()),
    precision: 2,
    lookupPrecision: 100
});
graph.animateIn();
document.body.appendChild(graph.element);

function animate() {
    requestAnimationFrame(animate);

    graph.update();
}

requestAnimationFrame(animate);
```

```js
import { RadialGraph } from '@alienkitty/space.js';

const graph = new RadialGraph({
    value: Array.from({ length: 10 }, () => Math.random()),
    precision: 2,
    lookupPrecision: 200
});
graph.animateIn();
document.body.appendChild(graph.element);

function animate() {
    requestAnimationFrame(animate);

    graph.update();
}

requestAnimationFrame(animate);
```

```js
import { Meter } from '@alienkitty/space.js';

const meter = new Meter({
    value: Math.random(),
    precision: 2
});
meter.animateIn();
document.body.appendChild(meter.element);

function animate() {
    requestAnimationFrame(animate);

    meter.update();
}

requestAnimationFrame(animate);
```

[Tween](https://github.com/alienkitty/space.js/wiki/Tween) animation engine:

```js
import { ticker, tween } from '@alienkitty/space.js';

ticker.start();

const data = {
    radius: 0
};

tween(data, { radius: 24, spring: 1.2, damping: 0.4 }, 1000, 'easeOutElastic', null, () => {
    console.log(data.radius);
});
```

Web Audio engine:

```js
import { BufferLoader, WebAudio } from '@alienkitty/space.js';

const loader = new BufferLoader();
await loader.loadAllAsync(['assets/sounds/gong.mp3']);
WebAudio.init({ sampleRate: 48000 });
WebAudio.load(loader.files);

const gong = WebAudio.get('gong');
gong.gain.set(0.5);

document.addEventListener('pointerdown', () => {
    gong.play();
});
```

Audio stream support:

```js
import { WebAudio } from '@alienkitty/space.js';

WebAudio.init({ sampleRate: 48000 });

// Shoutcast streams append a semicolon (;) to the URL
WebAudio.load({ protonradio: 'https://shoutcast.protonradio.com/;' });

const protonradio = WebAudio.get('protonradio');
protonradio.gain.set(1);

document.addEventListener('pointerdown', () => {
    protonradio.play();
});
```

And the `@alienkitty/space.js/three` entry point for [three.js](https://github.com/mrdoob/three.js) UI components, loaders and utilities.

```sh
npm i three @alienkitty/space.js
```

For example, loader utilities:

```js
import { EnvironmentTextureLoader } from '@alienkitty/space.js/three';

// ...
const loader = new EnvironmentTextureLoader(renderer);
loader.load('assets/textures/env/jewelry_black_contrast.jpg', texture => {
    scene.environment = texture;
    scene.environmentIntensity = 1.2;
});

// ...
const loader = new EnvironmentTextureLoader(renderer);
scene.environment = await loader.loadAsync('assets/textures/env/jewelry_black_contrast.jpg');
scene.environmentIntensity = 1.2;
```

### Examples

#### ui

[logo](https://space.js.org/examples/logo.html) (interface)  
[alienkitty](https://space.js.org/examples/alienkitty.html) (interface)  
[alienkitty](https://space.js.org/examples/alienkitty_canvas.html) (canvas)  
[ui](https://space.js.org/examples/ui.html) (hud)  
[components](https://space.js.org/examples/ui_components.html) (ui)  
[audio](https://space.js.org/examples/ui_audio.html) (ui)  
[progress](https://space.js.org/examples/progress_canvas.html) (canvas)  
[progress](https://space.js.org/examples/progress.html) (svg)  
[progress indeterminate](https://space.js.org/examples/progress_indeterminate.html) (svg)  
[close](https://space.js.org/examples/close.html) (svg)  
[tween](https://space.js.org/examples/tween.html) (svg)  
[magnetic](https://space.js.org/examples/magnetic.html) (component, svg)  
[details](https://space.js.org/examples/details.html)  
[info](https://space.js.org/examples/details_info.html) (details)  
[server status](https://space.js.org/examples/details_server_status.html) (details)  
[fps](https://space.js.org/examples/fps.html)  
[fps panel](https://space.js.org/examples/fps_panel.html)  
[fps graph](https://space.js.org/examples/fps_graph.html)  
[fps meter](https://space.js.org/examples/fps_meter.html)  
[panel](https://space.js.org/examples/panel.html) (standalone)  
[graph](https://space.js.org/examples/graph.html) (standalone)  
[radial graph](https://space.js.org/examples/radial_graph.html) (standalone)  
[graph markers](https://space.js.org/examples/graph_markers.html)  
[meter](https://space.js.org/examples/meter.html) (standalone)  
[thumbnail](https://space.js.org/examples/thumbnail.html)  
[ufo](https://ufo.ai/) (2d scene, smooth scroll with skew effect)  

#### 3d

[materials](https://space.js.org/examples/three/3d_materials.html) (panel tracking)  
[materials instancing](https://space.js.org/examples/three/3d_materials_instancing.html) ([debug](https://space.js.org/examples/three/3d_materials_instancing.html?3&debug))  
[materials instancing](https://space.js.org/examples/three/3d_materials_instancing_modified.html) (custom, [debug](https://space.js.org/examples/three/3d_materials_instancing_modified.html?3&debug))  
[lights](https://space.js.org/examples/three/3d_lights.html)  
[radial graph](https://space.js.org/examples/three/3d_radial_graph.html) (graph and panel tracking)  

#### audio

[gong](https://space.js.org/examples/audio_gong.html)  
[stream](https://space.js.org/examples/audio_stream.html)  
[rhythm](https://space.js.org/examples/audio_rhythm.html)  
[audio](https://space.js.org/examples/ui_audio.html) (ui)  

#### thread

[canvas](https://space.js.org/examples/thread_canvas.html) (noise)  

### Getting started

Clone this repository and open the examples:

```sh
git clone https://github.com/alienkitty/space.js
cd space.js
npx servez
```

### ESLint

```sh
npm i -D eslint eslint-plugin-html
npx eslint src
npx eslint examples/about/src
npx eslint examples/three/*.html
npx eslint examples/*.html
```

### Resources

* [The Wiki](https://github.com/alienkitty/space.js/wiki)
* [Tween](https://github.com/alienkitty/space.js/wiki/Tween)
* [Changelog](https://github.com/alienkitty/space.js/releases)

### See also

* [Alien.js](https://github.com/alienkitty/alien.js)
* [Three.js](https://github.com/mrdoob/three.js)
* [OGL](https://github.com/oframe/ogl)


[npm]: https://img.shields.io/npm/v/@alienkitty/space.js
[npm-url]: https://www.npmjs.com/package/@alienkitty/space.js
[npm-downloads]: https://img.shields.io/npm/dw/@alienkitty/space.js
[npmtrends-url]: https://www.npmtrends.com/@alienkitty/space.js
[deepscan]: https://deepscan.io/api/teams/20020/projects/23997/branches/734568/badge/grade.svg
[deepscan-url]: https://deepscan.io/dashboard#view=project&tid=20020&pid=23997&bid=734568
[discord]: https://img.shields.io/discord/773739853913260032
[discord-url]: https://discord.gg/9rSkAzB7PM
