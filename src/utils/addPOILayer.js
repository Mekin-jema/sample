// Function to add Points of Interest (POI) layer to the map
export const addPOILayerToMap = (map, pois) => {

  // Remove existing POI layer and source if present
  if (map.getSource('pois')) {
    map.removeLayer('poi-layer');
    map.removeSource('pois');
  }
  console.log(pois)

  // Define the GeoJSON source for POIs
  map.addSource('pois', {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: pois.map(poi => ({
        type: 'Feature',
        properties: {
          icon: poi.icon,   // icon name matching the sprite or image
          name: poi.name,   // optional name of the POI
        },
        geometry: {
          type: 'Point',
          coordinates: [poi.lng, poi.lat],
        },
      })),
    },
  });

  // Add the symbol layer to display POI icons and names
  map.addLayer({
    id: 'poi-layer',
    type: 'symbol',
    source: 'pois',
    layout: {
      'icon-image': ['get', 'icon'],             // Uses icon property
      'icon-size': 0.075, 
                          // Adjust for better visibility (like Google Maps)
      'icon-allow-overlap': true,               // Avoid hiding overlapping icons
      'text-field': ['get', 'name'],            // Show POI name (optional)
      'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
      'text-size': 14,
      'text-offset': [0, 1.2],
      'text-anchor': 'top',
      'text-optional': true,
    },
    paint: {
      'text-color': '#DC3B45',                     // Changed to black for better contrast on white background
      'text-halo-color': '#fff',
      'text-halo-width': 5,
    },
  });
};
