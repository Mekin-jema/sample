import maplibregl from "maplibre-gl";
import getPlaceNameFromCoordinates from "../api/getPlaceFromCoordinates";

let markers = []; // Array to store marker instances

/**
 * Adds a route layer with draggable markers for waypoints.
 *
 * @param {Object} map - Maplibre GL map instance.
 * @param {string} color - Line color for the route.
 * @param {Array} geometry - Array of [lng, lat] coordinates representing the route.
 * @param {string} name - Unique name for the route layer.
 * @param {number} thickness - Thickness of the route line.
 * @param {Function} setWaypoints - Function to update the waypoints state.
 * @param {Array} waypoints - Array of waypoints with { placeName, longitude, latitude }.
 *
 *
 */
let data = "";

const getLocation = async (lngLat) => {
  data = await getPlaceNameFromCoordinates(lngLat);
};

export const addRouteLayer = (
  map,
  color,
  geometry,
  name,
  thickness,
  setWaypoints,
  waypoints,
  dispatch
) => {
  // Remove existing route layer if present
  if (map.getLayer(name)) {
    map.removeLayer(name);
  }
  if (map.getSource(name)) map.removeSource(name);

  // Add new route layer
  map.addSource(name, {
    type: "geojson",
    data: {
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: geometry,
      },
    },
  });

  map.addLayer({
    id: name,
    type: "line",
    source: name,
    layout: {
      "line-join": "round",
      "line-cap": "round",
    },
    paint: {
      "line-color": color,
      "line-width": thickness,
    },
  });

  // Clear existing markers
  markers.forEach((marker) => marker.remove());
  markers = []; // Reset markers array

  // Add draggable markers for each waypoint
  waypoints.forEach((waypoint, index) => {
    const isStart = index === 0;
    const isEnd = index === waypoints.length - 1;

    const marker = new maplibregl.Marker({
      color: isStart ? "green" : isEnd ? "red" : "#0074D9", // Start: Green, End: Red, Others: Blue
      draggable: true,
    })
      .setLngLat([waypoint.longitude, waypoint.latitude])
      .addTo(map);

    markers.push(marker); // Store the marker instance

    // Handle marker dragging

    marker.on("dragend", () => {
      const lngLat = marker.getLngLat();
      const updatedWaypoints = [...waypoints];
      getLocation(lngLat);
      console.log(data);

      updatedWaypoints[index] = {
        placeName: data || `${(lngLat.lng, lngLat.lat)}`, // Keep the original name
        longitude: lngLat.lng,
        latitude: lngLat.lat,
      };
      dispatch(setWaypoints(updatedWaypoints));

      // Update the route with new waypoints
      const source = map.getSource(name);
      if (source) {
        source.setData({
          type: "Feature",
          geometry: {
            type: "LineString",
            coordinates: updatedWaypoints.map((point) => [
              point.longitude,
              point.latitude,
            ]),
          },
        });
      }
    });
  });
};
