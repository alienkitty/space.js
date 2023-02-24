# Space.js

[![NPM Package][npm]][npm-url]
[![DeepScan][deepscan]][deepscan-url]

This library is part of two sibling libraries, [Space.js](https://github.com/pschroen/space.js) for UI, Panel components, Tween, Web Audio, loaders, utilities, and [Alien.js](https://github.com/pschroen/alien.js) for 3D utilities, materials, shaders and physics.

<p>
    <img src="https://github.com/pschroen/space.js/raw/main/space.js.png" alt="Space.js">
</p>

### Usage

Space.js is divided into two entry points depending on your use case.

The main entry point without any dependencies is for the UI components, loaders and utilities.

```sh
npm i space.js
```

```js
import { ... } from 'space.js';
```

For example the UI and Panel components:

```js
import { Panel, PanelItem, UI } from 'space.js';
```

[Tween](https://github.com/pschroen/alien.js/wiki/Tween) animation engine:

```js
import { ticker, tween } from 'space.js';

ticker.start();

const data = {
    radius: 0
};

tween(data, { radius: 24, spring: 1.2, damping: 0.4 }, 1000, 'easeOutElastic');
```

Web Audio engine:

```js
import { BufferLoader, WebAudio } from 'space.js';

const bufferLoader = new BufferLoader(['assets/sounds/gong.mp3']);
WebAudio.init(bufferLoader.files, { sampleRate: 48000 });

const gong = WebAudio.get('gong');
gong.gain.set(0.5);
gong.play();
```

And the `space.js/three` entry point for [three](https://github.com/mrdoob/three.js) UI components, loaders and utilities.

```sh
npm i three space.js
```

```js
import { EnvironmentTextureLoader, MaterialPanelController, Point3D, Sound3D } from 'space.js/three';
```

### Examples

#### ui

[logo](https://space.js.org/examples/logo.html) (interface)  
[progress](https://space.js.org/examples/progress_canvas.html) (canvas)  
[progress](https://space.js.org/examples/progress.html) (svg)  
[progress indeterminate](https://space.js.org/examples/progress_indeterminate.html) (svg)  
[close](https://space.js.org/examples/close.html) (svg)  
[magnetic](https://space.js.org/examples/magnetic.html) (component, svg)  
[styles](https://space.js.org/examples/styles.html)  
[fps](https://space.js.org/examples/fps.html)  
[fps panel](https://space.js.org/examples/fps_panel.html)  
[panel](https://space.js.org/examples/panel.html) (standalone)  
[ufo](https://ufo.ai/) (2d scene, smooth scroll with skew effect)  

#### audio

[rhythm](https://space.js.org/examples/audio_rhythm.html)  

#### thread

[canvas](https://space.js.org/examples/thread_canvas.html) (noise)  

### Getting started

Clone this repository and run the examples:

```sh
git clone https://github.com/pschroen/space.js
cd space.js
npx servez
```

### ESLint

```sh
npm i -D eslint eslint-plugin-html
npx eslint src
npx eslint examples/about/src
npx eslint examples/*.html
```

### Resources

* [Tween](https://github.com/pschroen/alien.js/wiki/Tween)
* [Changelog](https://github.com/pschroen/space.js/releases)

### See also

* [Alien.js](https://github.com/pschroen/alien.js)
* [Three.js](https://github.com/mrdoob/three.js)
* [OGL](https://github.com/oframe/ogl)


[npm]: https://img.shields.io/npm/v/space.js
[npm-url]: https://www.npmjs.com/package/space.js
[deepscan]: https://deepscan.io/api/teams/20020/projects/23965/branches/733215/badge/grade.svg
[deepscan-url]: https://deepscan.io/dashboard#view=project&tid=20020&pid=23965&bid=733215
