"""Geometry helpers: geographic centres computed on an equal-area projection.

The "centre" of a territory is the area-weighted centroid of its land, computed in a
Lambert azimuthal equal-area projection centred on the territory itself (so antimeridian
and polar shapes such as Russia, Fiji or Antarctica are handled without longitude wrap).
When that centroid falls outside the territory (archipelagos, crescent shapes) the point is
moved onto land: first the centroid of the nearest land part, then that part's pole of
inaccessibility. Every centre we publish is therefore inside the territory it describes.
"""
import math

import numpy as np
from pyproj import CRS, Transformer
from shapely import get_coordinates
from shapely.geometry import MultiPolygon, Point, Polygon, shape
from shapely.ops import polylabel, transform, unary_union

R = 6371.0088  # mean Earth radius, km


def load_geom(geojson_geometry):
    g = shape(geojson_geometry)
    if not g.is_valid:
        g = g.buffer(0)
    return g


def parts(geom):
    if geom is None or geom.is_empty:
        return []
    if isinstance(geom, Polygon):
        return [geom]
    if isinstance(geom, MultiPolygon):
        return list(geom.geoms)
    return [g for g in getattr(geom, 'geoms', []) if isinstance(g, (Polygon, MultiPolygon))]


def to_xyz(lon, lat):
    lon, lat = np.radians(lon), np.radians(lat)
    return np.stack([np.cos(lat) * np.cos(lon), np.cos(lat) * np.sin(lon), np.sin(lat)], axis=-1)


def from_xyz(v):
    x, y, z = v / np.linalg.norm(v)
    return math.degrees(math.atan2(y, x)), math.degrees(math.asin(max(-1.0, min(1.0, z))))


def mean_direction(geom):
    """Spherical mean of the geometry's vertices: a good projection centre."""
    c = get_coordinates(geom)
    v = to_xyz(c[:, 0], c[:, 1]).mean(axis=0)
    if np.linalg.norm(v) < 1e-9:  # pathological (e.g. ring around the globe)
        return 0.0, 90.0 if c[:, 1].mean() > 0 else -90.0
    return from_xyz(v)


def laea(lon0, lat0):
    crs = CRS.from_proj4('+proj=laea +lat_0=%f +lon_0=%f +R=6371008.8 +units=m +no_defs' % (lat0, lon0))
    fwd = Transformer.from_crs('EPSG:4326', crs, always_xy=True)
    inv = Transformer.from_crs(crs, 'EPSG:4326', always_xy=True)
    return fwd, inv


def project(geom, fwd):
    return transform(fwd.transform, geom)


def fix_antarctica(geom):
    """Natural Earth closes the Antarctic polygon along the -90 parallel. Projected around
    the pole that edge collapses fine, so nothing to do beyond making it valid."""
    return geom if geom.is_valid else geom.buffer(0)


def centre(geom):
    """Return ((lon, lat), method) for the land-constrained geographic centre of geom."""
    lon0, lat0 = mean_direction(geom)
    fwd, inv = laea(lon0, lat0)
    pg = project(geom, fwd)
    if not pg.is_valid:
        pg = pg.buffer(0)
    c = pg.centroid
    method = 'centroid'
    if not pg.buffer(1).contains(c):  # 1 m tolerance
        ps = parts(pg)
        near = min(ps, key=lambda p: p.distance(c))
        c = near.centroid
        method = 'nearest-part-centroid'
        if not near.buffer(1).contains(c):
            c = polylabel(near, tolerance=max(near.length / 2000.0, 10))
            method = 'pole-of-inaccessibility'
    lon, lat = inv.transform(c.x, c.y)
    return (lon, lat), method


def area_km2(geom):
    lon0, lat0 = mean_direction(geom)
    fwd, _ = laea(lon0, lat0)
    return project(geom, fwd).area / 1e6


def weighted_centre(items):
    """items: iterable of ((lon, lat), weight). Spherical area-weighted mean direction."""
    v = np.zeros(3)
    for (lon, lat), w in items:
        v += to_xyz(np.array(lon), np.array(lat)) * w
    return from_xyz(v)


def haversine_km(lon1, lat1, lon2, lat2):
    lon1, lat1, lon2, lat2 = map(np.radians, (lon1, lat1, lon2, lat2))
    a = np.sin((lat2 - lat1) / 2) ** 2 + np.cos(lat1) * np.cos(lat2) * np.sin((lon2 - lon1) / 2) ** 2
    return 2 * R * np.arcsin(np.sqrt(a))


def union(geoms):
    geoms = [g for g in geoms if g is not None and not g.is_empty]
    if not geoms:
        return None
    if len(geoms) == 1:
        return geoms[0]
    return unary_union([g if g.is_valid else g.buffer(0) for g in geoms])


def contains_point(geom, lon, lat, tol_deg=0.0):
    p = Point(lon, lat)
    return geom.contains(p) or (tol_deg > 0 and geom.distance(p) <= tol_deg)
