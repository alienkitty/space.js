"""
Make gnomonic projection cube faces in the order +X, -X, +Y, -Y, +Z, -Z from a
WGS84 format input image.

Usage: python3 make_cube_faces.py input_image output_name size colorspace output_path
Example: python3 make_cube_faces.py 32k.Mars.Surface.tif mars_basecolor 2048 sRGB .

Author: Brian T. Jacobs <https://github.com/briantjacobs>
Author: Patrick Schroen <https://github.com/pschroen>
"""
import os
import sys

def make_cube_faces(input_image, output_name, size=1024, colorspace="sRGB", output_path="."):
    extents = [
        {"lon": 90,  "lat": 0,   "suffix": "px"},
        {"lon": -90, "lat": 0,   "suffix": "nx"},
        {"lon": 0,   "lat": 90,  "suffix": "py"},
        {"lon": 0,   "lat": -90, "suffix": "ny"},
        {"lon": 0,   "lat": 0,   "suffix": "pz"},
        {"lon": 180, "lat": 0,   "suffix": "nz"}
    ]

    for extent in extents:
        face_name = f"""{output_name}_{extent["suffix"]}"""

        os.system(f"""\
            gdalwarp -wo SOURCE_EXTRA=500 -wo SAMPLE_GRID=YES -te -6378137 -6378137 6378137 6378137 \
                -t_srs "+proj=gnom +lon_0={extent["lon"]} +lat_0={extent['lat']} +datum=WGS84" \
                -ts {size} {size} -overwrite {input_image} {output_path}/{face_name}.tif
        """)

        os.system(f"""magick {output_path}/{face_name}.tif -set colorspace {colorspace} {output_path}/{face_name}.png""")

make_cube_faces(sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4], sys.argv[5])
