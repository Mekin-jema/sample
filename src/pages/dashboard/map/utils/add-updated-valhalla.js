import { setWaypoints } from "@/Redux/MapSlice";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { getPlaceNameFromCoordinates } from "../api";

let routeData;
let routeStepsData;
let instructionsData;
let stepPointsData;
let markers = []; // Store marker instances

// Helper function to fetch place name
const getLocation = async (lngLat) => {
  try {
    return await getPlaceNameFromCoordinates(lngLat);
  } catch (error) {
    console.error("Reverse geocoding failed:", error);
    return `${lngLat.lng}, ${lngLat.lat}`;
  }
};

const popup = new maplibregl.Popup({
  closeButton: false,
  className: "custom-popup", // Add custom class for styling
  maxWidth: "300px",
});

export const addUpdatedValhalla = (map, data, waypoints, dispatch, profile) => {
  routeData = data;
  const steps = [];
  const instructions = [];
  const stepPoints = [];

  if (
    !routeData.features ||
    !routeData.features[0] ||
    !routeData.features[0].properties.legs
  ) {
    console.error("Invalid route data structure");
    return;
  }

  // Remove existing markers with fade-out effect
  markers.forEach((marker) => {
    const el = marker.getElement();
    el.style.transition = "opacity 0.3s ease-out";
    el.style.opacity = "0";
    setTimeout(() => marker.remove(), 300);
  });
  markers = [];

  // Loop through waypoints and create draggable markers
  waypoints.forEach((waypoint, index) => {
    const isStart = index === 0;
    const isEnd = index === waypoints.length - 1;

    // Enhanced marker styling with Google-like appearance
    const markerColor = isStart
      ? "#34A853" // Green for start
      : isEnd
      ? "#EA4335" // Red for end
      : "#4285F4"; // Blue for middle points (changed from yellow)

    // Create draggable marker with enhanced styling
    const marker = new maplibregl.Marker({
      color: markerColor,
      draggable: true,
      scale: 0.8, // Slightly smaller default size
    })
      .setLngLat([waypoint.longitude, waypoint.latitude])
      .addTo(map);

    // Enhanced marker styling
    const el = marker.getElement();
    el.style.boxShadow = "0 2px 6px rgba(0, 0, 0, 0.3)";
    el.style.borderRadius = "50%";
    el.style.width = "24px";
    el.style.height = "24px";
    el.style.transition = "all 0.2s ease";
    el.style.display = "flex";
    el.style.justifyContent = "center";
    el.style.alignItems = "center";

    // Add inner white circle for better visibility
    const innerCircle = document.createElement("div");
    innerCircle.style.width = "12px";
    innerCircle.style.height = "12px";
    innerCircle.style.backgroundColor = "white";
    innerCircle.style.borderRadius = "50%";
    innerCircle.style.boxShadow = "0 1px 2px rgba(0,0,0,0.2)";
    el.appendChild(innerCircle);

    // Add number for intermediate points
    // if (!isStart && !isEnd) {
    //   const number = document.createElement("div");
    //   number.style.position = "absolute";
    //   number.style.color = markerColor;
    //   number.style.fontSize = "10px";
    //   number.style.fontWeight = "bold";
    //   number.textContent = index.toString();
    //   el.appendChild(number);
    // }

    // Hover effects
    // el.addEventListener("mouseenter", () => {
    //   el.style.transform = "scale(1.2)";
    //   el.style.zIndex = "1000";
    // });
    // el.addEventListener("mouseleave", () => {
    //   el.style.transform = "scale(0.8)";
    //   el.style.zIndex = "";
    // });

    // Store marker instance
    markers.push(marker);

    // Handle dragging with smooth animation
    marker.on("dragstart", () => {
      el.style.transform = "scale(1.3)";
      el.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.3)";
    });

    marker.on("dragend", async () => {
      el.style.transform = "scale(0.8)";
      el.style.boxShadow = "0 2px 6px rgba(0, 0, 0, 0.3)";

      const lngLat = marker.getLngLat();

      // Reverse geocode to get updated place name
      const placeName = await getLocation(lngLat);

      // Update the waypoints array
      const updatedWaypoints = [...waypoints];
      updatedWaypoints[index] = {
        placeName,
        longitude: lngLat.lng,
        latitude: lngLat.lat,
      };

      // Update the waypoints state
      dispatch(setWaypoints(updatedWaypoints));

      // Update the route line with new coordinates
      const source = map.getSource("route");
      if (source) {
        source.setData({
          type: "Feature",
          geometry: {
            type: "LineString",
            coordinates: updatedWaypoints.map((wp) => [
              wp.longitude,
              wp.latitude,
            ]),
          },
        });
      }
    });
  });

  const legGeometry = routeData.features[0]?.geometry?.coordinates;
  if (routeData.features[0]?.properties?.legs) {
    routeData.features[0]?.properties.legs.forEach((leg) => {
      if (!legGeometry) {
        console.warn(`Leg geometry not found for leg index ${legIndex}`);
        return;
      }

      leg.steps.forEach((step, index) => {
        if (step.instruction) {
          instructions.push({
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: legGeometry[step.from_index],
            },
            properties: {
              text: step.instruction.text,
            },
          });
        }
        if (index !== 0) {
          stepPoints.push({
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: legGeometry[step.from_index],
            },
            properties: step,
          });
        }

        if (step.from_index === step.to_index) {
          return;
        }

        const stepGeometry = legGeometry.slice(
          step.from_index,
          step.to_index + 1
        );
        if (
          Array.isArray(legGeometry) &&
          step.from_index >= 0 &&
          step.to_index >= 0 &&
          step.from_index < legGeometry.length &&
          step.to_index < legGeometry.length
        ) {
        } else {
          console.warn(
            `Invalid indices for step geometry: from_index=${step.from_index}, to_index=${step.to_index}`
          );
          return;
        }
        if (!stepGeometry || stepGeometry.length === 0) {
          console.warn(`Step geometry not found for step index ${index}`);
          return;
        }

        steps.push({
          type: "Feature",
          geometry: {
            type: "LineString",
            coordinates: stepGeometry,
          },
          properties: step,
        });
      });
    });
  } else {
    console.error("No legs found in route data");
  }

  routeStepsData = {
    type: "FeatureCollection",
    features: steps,
  };

  instructionsData = {
    type: "FeatureCollection",
    features: instructions,
  };

  stepPointsData = {
    type: "FeatureCollection",
    features: stepPoints,
  };

  // Remove previous sources/layers if they exist
  if (map.getLayer("route-layer")) map.removeLayer("route-layer");
  if (map.getSource("route")) map.removeSource("route");

  // Remove points layers first, then the source
  if (map.getLayer("points-layer")) map.removeLayer("points-layer");
  if (map.getLayer("points-pulse")) map.removeLayer("points-pulse");
  if (map.getSource("points")) map.removeSource("points");

  // Add new sources
  map.addSource("route", {
    type: "geojson",
    data: routeData,
  });

  if (!map.getSource("points")) {
    map.addSource("points", {
      type: "geojson",
      data: instructionsData,
    });
  } else {
    map.getSource("points").setData(instructionsData);
  }
  addLayerEvents(map);
  drawRoute(map, profile);
};

function drawRoute(map, profile) {
  // Choose style based on profile with enhanced visuals
  let style = {
    type: "line",
    layout: {
      "line-cap": "round",
      "line-join": "round",
    },
    paint: {
      "line-color": "#6200EE",
      "line-width": ["interpolate", ["linear"], ["zoom"], 10, 4, 14, 6, 18, 10],
      "line-opacity": 0.9,
      "line-offset": 0,
    },
    filter: ["==", "$type", "LineString"],
  };

  // Add subtle glow effect
  const glowLayer = {
    id: "route-glow",
    type: "line",
    source: "route",
    layout: style.layout,
    paint: {
      "line-color": style.paint["line-color"],
      "line-width": style.paint["line-width"].map((val, idx) =>
        idx % 2 === 1 ? val + 4 : val
      ),
      "line-opacity": 0.2,
      "line-blur": 5,
    },
    filter: ["==", "$type", "LineString"],
  };

  // Remove old glow layer if exists
  if (map.getLayer("route-glow")) map.removeLayer("route-glow");

  // Add glow layer first
  map.addLayer(glowLayer);

  // Profile-specific styling
  switch (profile) {
    case "bicycle":
      style.paint = {
        "line-color": "#00BFA5",
        "line-width": [
          "interpolate",
          ["linear"],
          ["zoom"],
          10,
          3,
          14,
          5,
          18,
          8,
        ],
        "line-opacity": 0.8,
        "line-dasharray": [0.08, 1.5],
      };
      break;
    case "pedestrian":
      style.paint = {
        "line-color": "#FF6D00",
        "line-width": [
          "interpolate",
          ["linear"],
          ["zoom"],
          10,
          3,
          14,
          5,
          18,
          8,
        ],
        "line-opacity": 0.8,
        "line-dasharray": [0.1, 1.5],
      };
      break;
    case "motor_scooter":
      style.paint = {
        "line-color": "#6200EE",
        "line-width": [
          "interpolate",
          ["linear"],
          ["zoom"],
          10,
          4,
          14,
          6,
          18,
          10,
        ],
        "line-opacity": 0.9,
      };
      break;
    case "transit":
      style.paint = {
        "line-color": "#2962FF",
        "line-width": [
          "interpolate",
          ["linear"],
          ["zoom"],
          10,
          5,
          14,
          7,
          18,
          12,
        ],
        "line-opacity": 0.7,
        "line-dasharray": [0.5, 1],
      };
      break;
    case "multimodal":
      style.paint = {
        "line-color": "#AA00FF",
        "line-width": [
          "interpolate",
          ["linear"],
          ["zoom"],
          10,
          4,
          14,
          6,
          18,
          10,
        ],
        "line-opacity": 0.8,
        "line-dasharray": [0.5, 1, 0.3, 1],
      };
      break;
    case "auto":
    default:
      style.paint = {
        "line-color": "#6200EE",
        "line-width": [
          "interpolate",
          ["linear"],
          ["zoom"],
          10,
          5,
          14,
          7,
          18,
          12,
        ],
        "line-opacity": 1.0,
      };
      break;
  }

  if (!routeData) return;

  map.getSource("route").setData(routeData);
  map.addLayer({
    id: "route-layer",
    type: "line",
    source: "route",
    ...style,
  });

  // Add animated pulsing effect to instruction points
  map.getSource("points").setData(instructionsData);
  map.addLayer({
    id: "points-layer",
    type: "circle",
    source: "points",
    paint: {
      "circle-radius": [
        "interpolate",
        ["linear"],
        ["zoom"],
        10,
        3,
        14,
        5,
        18,
        7,
      ],
      "circle-color": "#fff",
      "circle-stroke-color": style.paint["line-color"],
      "circle-stroke-width": 2,
      "circle-opacity": 0.9,
    },
  });

  // Add pulsing animation for points
  if (map.getLayer("points-pulse")) map.removeLayer("points-pulse");
  map.addLayer({
    id: "points-pulse",
    type: "circle",
    source: "points",
    paint: {
      "circle-radius": {
        stops: [
          [10, 5],
          [14, 8],
          [18, 12],
        ],
        base: 2,
        property: "circle-radius",
      },
      "circle-color": style.paint["line-color"],
      "circle-opacity": 0.5,
      "circle-stroke-width": 0,
      "circle-radius-transition": { duration: 2000, delay: 0 },
      "circle-opacity-transition": { duration: 2000, delay: 0 },
    },
  });

  // Animate the pulse effect
  function animatePulse() {
    setTimeout(() => {
      map.setPaintProperty("points-pulse", "circle-radius", [
        "interpolate",
        ["linear"],
        ["zoom"],
        10,
        8,
        14,
        12,
        18,
        18,
      ]);
      map.setPaintProperty("points-pulse", "circle-opacity", 0);

      setTimeout(() => {
        map.setPaintProperty("points-pulse", "circle-radius", [
          "interpolate",
          ["linear"],
          ["zoom"],
          10,
          5,
          14,
          8,
          18,
          12,
        ]);
        map.setPaintProperty("points-pulse", "circle-opacity", 0);
        animatePulse();
      }, 2000);
    }, 0);
  }

  animatePulse();
}

function addLayerEvents(map) {
  // Enhanced hover effects with transitions
  map.on("mouseenter", "route-layer", () => {
    map.getCanvas().style.cursor = "pointer";
    map.setPaintProperty("route-layer", "line-width", [
      "interpolate",
      ["linear"],
      ["zoom"],
      10,
      6,
      14,
      8,
      18,
      14,
    ]);
    map.setPaintProperty("route-glow", "line-opacity", 0.3);
  });
  // Remove these hover/leave blocks entirely:
  // map.on("mouseenter", "route-layer", …)
  // map.on("mouseleave", "route-layer", …)

  // Instead, use a single click handler:
  map.on("click", "route-layer", (e) => {
    // Change cursor to pointer
    map.getCanvas().style.cursor = "pointer";

    // “Enlarge” the route‐layer when clicked
    map.setPaintProperty("route-layer", "line-width", [
      "interpolate",
      ["linear"],
      ["zoom"],
      10,
      6,
      14,
      8,
      18,
      12,
    ]);
    map.setPaintProperty("route-glow", "line-opacity", 1);

    // Gather popup data exactly as in your previous mousemove handler:
    if (!e.features || e.features.length === 0) return;
    const clickedFeature = e.features[0];
    const stepData = clickedFeature.properties;
    const routeGeometry = routeData.features[0].geometry;

    const clickedPoint = e.lngLat;
    let closestDistance = Infinity;
    let pointIndex = 0;
    const routeCoordinates = routeGeometry.coordinates;

    for (let i = 0; i < routeCoordinates.length; i++) {
      const [lng, lat] = routeCoordinates[i];
      const dx = clickedPoint.lng - lng;
      const dy = clickedPoint.lat - lat;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < closestDistance) {
        closestDistance = dist;
        pointIndex = i;
      }
    }

    const steps = routeData.features[0].properties.legs.flatMap(
      (leg) => leg.steps
    );
    let cumulativeDistance = 0;
    let cumulativeTime = 0;
    let matchedStep = null;

    for (const step of steps) {
      if (pointIndex >= step.from_index && pointIndex <= step.to_index) {
        matchedStep = step;
        const stepLength = step.to_index - step.from_index;
        const progressRatio =
          stepLength > 0 ? (pointIndex - step.from_index) / stepLength : 0;
        cumulativeDistance += step.distance * progressRatio;
        cumulativeTime += step.time * progressRatio;
        break;
      } else {
        cumulativeDistance += step.distance;
        cumulativeTime += step.time;
      }
    }

    const dataToShow = {};
    if (matchedStep) {
      dataToShow.instruction =
        matchedStep.instruction?.text || "No instruction";
      dataToShow.step_distance = `${matchedStep.distance.toFixed(2)} km`;
      dataToShow.step_time = `${matchedStep.time.toFixed(2)} sec`;
      dataToShow.cumulative_distance = `${cumulativeDistance.toFixed(2)} km`;
      dataToShow.cumulative_time = `${cumulativeTime.toFixed(2)} sec`;
      if (cumulativeTime >= 60) {
        const minutes = Math.floor(cumulativeTime / 60);
        const seconds = Math.floor(cumulativeTime % 60);
        dataToShow.cumulative_time_formatted = `${minutes}m ${seconds}s`;
      }
    } else {
      dataToShow.note = "No step matched.";
    }

    if (stepData.surface) dataToShow.surface = stepData.surface;
    if (stepData.elevation !== undefined)
      dataToShow.elevation = `${stepData.elevation} m`;
    if (stepData.elevation_gain !== undefined)
      dataToShow.elevation_gain = `${stepData.elevation_gain} m`;

    if (document.getElementById("showDetails")?.checked) {
      showPopup(dataToShow, e.lngLat, map);
    } else {
      showPopup(
        {
          mode: stepData.mode,
          units: stepData.units,
          ...dataToShow,
        },
        e.lngLat,
        map
      );
    }

    e.preventDefault();
  });

  // If you want to “un‐enlarge” the route when clicking elsewhere, add:
  map.on("click", (e) => {
    // If click wasn’t on `route-layer`, reset it:
    const features = map.queryRenderedFeatures(e.point, {
      layers: ["route-layer"],
    });
    if (features.length === 0) {
      map.getCanvas().style.cursor = "";
      map.setPaintProperty("route-layer", "line-width", [
        "interpolate",
        ["linear"],
        ["zoom"],
        10,
        4,
        14,
        6,
        18,
        10,
      ]);
      map.setPaintProperty("route-glow", "line-opacity", 0.2);
    }
  });

  // Same pattern for “points-layer”:
  map.on("click", "points-layer", (e) => {
    map.getCanvas().style.cursor = "pointer";
    map.setPaintProperty("points-layer", "circle-radius", [
      "interpolate",
      ["linear"],
      ["zoom"],
      10,
      7,
      14,
      9,
      18,
      12,
    ]);
    map.setPaintProperty("points-layer", "circle-stroke-width", 4);

    const properties = e.features[0].properties;
    const coords = e.features[0].geometry.coordinates;
    if (properties.text) {
      popup.setText(properties.text).setLngLat(coords).addTo(map);
      e.preventDefault();
    }
  });

  // And to reset “points-layer” style when clicking outside:
  map.on("click", (e) => {
    const ptFeatures = map.queryRenderedFeatures(e.point, {
      layers: ["points-layer"],
    });
    if (ptFeatures.length === 0) {
      map.getCanvas().style.cursor = "";
      map.setPaintProperty("points-layer", "circle-radius", [
        "interpolate",
        ["linear"],
        ["zoom"],
        10,
        3,
        14,
        5,
        18,
        7,
      ]);
      map.setPaintProperty("points-layer", "circle-stroke-width", 2);
    }
  });
}

function showPopup(data, lngLat, map) {
  const popupHtml = `
    <div class="route-popup-container">
      <div class="route-popup-header">
        <h4>Route Details</h4>
      </div>
      <div class="route-popup-content">
        ${Object.keys(data)
          .map(
            (key) => `
          <div class="route-popup-row">
            <span class="route-popup-label">${key.replace(/_/g, " ")}:</span>
            <span class="route-popup-value">${data[key]}</span>
          </div>
        `
          )
          .join("")}
      </div>
    </div>
  `;

  popup.remove();
  popup.setLngLat(lngLat).setHTML(popupHtml).addTo(map);
}
