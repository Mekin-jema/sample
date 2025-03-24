export const addPOILayerToMap = (map, pois) => {
  console.log(pois)
  // Remove the existing layer and source if already added
  if (map.getSource("pois")) {
    map.removeLayer("poi-icons");
    map.removeSource("pois");
  }
  // Add POIs to the map as a source
  map.addSource("pois", {
    type: "geojson",
    data: {
      type: "FeatureCollection",
      features: pois.map((poi) => ({
        type: "Feature",
        properties: {
          icon: poi.icon,
          // name: poi.name,
        },
        geometry: {
          type: "Point",
          coordinates: [poi.lng, poi.lat],
        },
      })),
    },
  });

  // Add a layer to render the icons
  map.addLayer({
    id: "poi-icons",
    type: "symbol",
    source: "pois",
    layout: {
      "icon-image": ["get", "icon"], // Use the icon property from the source
      "icon-size": 0.05, // Adjust the size of the icons
      "icon-allow-overlap": true,
      "text-field": ["get", "name"], // Display the name of the POI
      "text-offset": [0, 1.5],
      "text-anchor": "top",
      "text-size": 12,
    },
  });
};
