import type { FeatureCollection, Point, Feature, LineString } from 'geojson'
import type { DestinationMapMarker, RoutePreview } from './types'

/** Build a GeoJSON FeatureCollection of destination points for a clustered source. */
export function destinationsToGeoJSON(
  destinations: DestinationMapMarker[]
): FeatureCollection<Point> {
  return {
    type: 'FeatureCollection',
    features: destinations
      .filter((d) => Number.isFinite(d.longitude) && Number.isFinite(d.latitude))
      .map(
        (d): Feature<Point> => ({
          type: 'Feature',
          geometry: { type: 'Point', coordinates: [d.longitude, d.latitude] },
          properties: {
            id: d.id,
            name: d.name,
            slug: d.slug,
            category: d.category,
            province: d.province,
            featured: d.featured,
          },
        })
      ),
  }
}

/** Build a GeoJSON LineString for a route preview. */
export function routeToGeoJSON(route: RoutePreview): FeatureCollection<LineString> {
  return {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: route.points.map((p) => [p.longitude, p.latitude]),
        },
        properties: { id: route.id },
      },
    ],
  }
}
