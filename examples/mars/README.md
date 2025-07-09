# Mars

A [cinematic Mars demo](https://space.js.org/examples/mars/) featuring high quality cubemaps with 2k faces, meant as a starting point for more advanced travel and targets to come.

Special thanks to [John Van Vliet](http://www.celestiamotherlode.net/creatorinfo/creator_10.html) for contributing the 32k normal map, who has created many astronomical object textures for [Celestia](https://celestiaproject.space/), among many other projects.

The GDAL steps and Python script below were generously contributed by [Brian T. Jacobs](https://btjak.es/), who worked on National Geographic's “Rewind the Red Planet”, and has a fantastic [technical article](https://source.opennews.org/articles/how-we-made-rewind-red-planet/) on the process used.

In addition to using GDAL and ImageMagick, I am also using Photoshop for converting between formats, in my tests I found that Photoshop did a better job at scaling bit depth compared to both GDAL and ImageMagick, keeping more of the correct colours and details.

Note that I've used the same cubemap process for all the textures in this demo, the surface map, normal map, and bright star map.

### Generating the cubemaps

These steps are for MacOS, [Python](https://www.python.org/downloads/macos/) and [Homebrew](https://brew.sh/), though can easily be adapted for Linux and Windows systems. Starting with installing GDAL and ImageMagick.

```sh
brew update
brew upgrade
brew install gdal
brew install imagemagick
```

Download the 32k surface map ([Google Drive](https://drive.google.com/file/d/1lkdMKVwc0uESEHTl74wjkhT33XyIvJjg)), 32k normal map ([Google Drive](https://drive.google.com/file/d/1fjQIbdT4YFtPUIr0hEPHwhKe8FV-gmqv)), and 16k bright star map in galactic coordinates (NASA SVS [Deep Star Maps 2020](https://svs.gsfc.nasa.gov/4851/), [direct link](https://svs.gsfc.nasa.gov/vis/a000000/a004800/a004851/hiptyc_2020_16k_gal.exr)).

I converted the 16k bright star map from the OpenEXR format to a 8-bit PNG using Photoshop (Quick Export as PNG).

Then use GDAL's translate utility to specify WGS84 projection (aka, equirectangular or plate carrée). With the TIFF format, GDAL stores the metadata directly in the file with GDAL specific tags.

```sh
gdal_translate --config GDAL_ALLOW_LARGE_LIBJPEG_MEM_ALLOC YES -a_srs "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs" -a_ullr -180 90 180 -90 32k.Mars.Surface.png 32k.Mars.Surface.tif
gdal_translate --config GDAL_ALLOW_LARGE_LIBJPEG_MEM_ALLOC YES -a_srs "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs" -a_ullr -180 90 180 -90 32k.Mars.Normal.png 32k.Mars.Normal.tif
gdal_translate --config GDAL_ALLOW_LARGE_LIBJPEG_MEM_ALLOC YES -a_srs "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs" -a_ullr -180 90 180 -90 hiptyc_2020_16k_gal.png hiptyc_2020_16k_gal.tif
```

Download the Python script ([make_cube_faces.py](make_cube_faces.py) included with this demo), which we'll use to generate all the cube faces with GDAL's warp utility and ImageMagick. Ignore all the `magick: Unknown field with tag` warnings, they are from the TIFF format tags used by GDAL.

```sh
python3 make_cube_faces.py 32k.Mars.Surface.tif mars_basecolor 2048 sRGB .
python3 make_cube_faces.py 32k.Mars.Normal.tif mars_normal 2048 RGB .
python3 make_cube_faces.py hiptyc_2020_16k_gal.tif hiptyc_2020 4096 sRGB .
```

And finally optimizing the output images. I tried a variety of compression formats, KTX2 Basis, ASTC, UASTC, WebP, and after all that, I'm finding that good old JPEG compression still has a better quality to file size ratio for high quality textures.

I used a combination of Photoshop's JPEG compression (Save for Web, 75% Quality, sRGB for the surface map, and no color profile for the normal map), then [ImageOptim](https://imageoptim.com/) for the final optimization.

For the bright star map I found a KTX2 Basis cubemap worked great for the 4k faces, it's really just a bunch of coloured dots and I can't see any compression artifacts or discolouration.

To generate the KTX2 Basis cubemap texture you'll need to install [KTX Tools](https://github.com/KhronosGroup/KTX-Software) from the [Releases page](https://github.com/KhronosGroup/KTX-Software/releases). Then run the following command:

```sh
toktx --encode etc1s --qlevel 255 --target_type RGB --assign_oetf srgb --cubemap hiptyc_2020_cube.ktx2 hiptyc_2020_px.png hiptyc_2020_nx.png hiptyc_2020_py.png hiptyc_2020_ny.png hiptyc_2020_pz.png hiptyc_2020_nz.png
```

### License

The 32k normal map by [John Van Vliet](http://www.celestiamotherlode.net/creatorinfo/creator_10.html) is licensed under [CC BY-SA](https://creativecommons.org/licenses/by-sa/4.0/).

The 32k surface map is from the free [Celestia Origin](https://vk.com/celestiaorigin) collection.

The 16k bright star map is from the free NASA SVS [Deep Star Maps 2020](https://svs.gsfc.nasa.gov/4851/).

The ambient audio by [Alex Bainter](https://github.com/alexbainter) is licensed under [CC BY](https://creativecommons.org/licenses/by/4.0/).

The art and design are licensed under [CC BY](https://creativecommons.org/licenses/by/4.0/).

And the source code (scripts, shaders, etc.) are licensed under [MIT](../../LICENSE).

### See also

* [John Van Vliet](http://www.celestiamotherlode.net/creatorinfo/creator_10.html)
* [Brian T. Jacobs](https://btjak.es/)
* [Brian T. Jacobs' How We Made “Rewind the Red Planet”](https://source.opennews.org/articles/how-we-made-rewind-red-planet/)
* [Celestia](https://celestiaproject.space/)
* [Celestia Motherlode](http://www.celestiamotherlode.net/)
* [Celestia Origin](https://vk.com/celestiaorigin)
* [Space.js](https://github.com/alienkitty/space.js)
* [Alien.js](https://github.com/alienkitty/alien.js)
* [Three.js](https://github.com/mrdoob/three.js)
* [GDAL](https://gdal.org/)
* [ImageMagick](https://imagemagick.org/)
