import React, { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import OpenRouteService from "openrouteservice"; // Correct import
import { saveAs } from "file-saver";
import { toGeoJSON } from "togeojson";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const RouteOptimization = () => {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const [routeData, setRouteData] = useState({
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates: [
            [8.681495, 49.41461],
            [8.687872, 49.420318],
            [8.692803, 49.42655],
          ],
        },
        properties: {},
      },
    ],
  });
  const [locations, setLocations] = useState([
    [8.681495, 49.41461],
    [8.687872, 49.420318],
    [8.692803, 49.42655],
  ]); // Fixed the state initialization

  const client = new OpenRouteService({
    api_key: "u9EnL0tM9ZS24uoyFpL7", // Replace with your OpenRouteService API key
  });

  // Initialize MapLibre Map
  useEffect(() => {
    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: "https://demotiles.maplibre.org/style.json",
      center: [0, 0],
      zoom: 2,
    });

    mapRef.current = map;

    return () => map.remove(); // Clean up on component unmount
  }, []);

  // Fetch Optimized Route from OpenRouteService
  const getOptimizedRoute = async (locations) => {
    try {
      const response = await client.directions({
        coordinates: locations,
        profile: "driving-car", // Can be cycling, walking, etc.
        format: "geojson",
      });
      setRouteData(response.geojson); // Access geojson data directly
    } catch (error) {
      console.error("Error fetching optimized route:", error);
    }
  };

  // Display Route on Map
  useEffect(() => {
    if (routeData && mapRef.current) {
      const map = mapRef.current;

      if (map.getSource("route")) {
        map.getSource("route").setData(routeData);
      } else {
        map.on("load", () => {
          map.addSource("route", {
            type: "geojson",
            data: routeData,
          });

          map.addLayer({
            id: "route",
            type: "line",
            source: "route",
            layout: {
              "line-join": "round",
              "line-cap": "round",
            },
            paint: {
              "line-color": "#FF0000",
              "line-width": 4,
            },
          });
        });
      }
    }
  }, [routeData]);

  // Export Route in KML
  const exportRouteAsKML = () => {
    const kml = toGeoJSON.kml(routeData);
    const blob = new Blob([kml], { type: "application/vnd.google-earth.kml+xml" });
    saveAs(blob, "route.kml");
  };

  // Export Route in GPX
  const exportRouteAsGPX = () => {
    const gpx = toGeoJSON.gpx(routeData);
    const blob = new Blob([gpx], { type: "application/gpx+xml" });
    saveAs(blob, "route.gpx");
  };

  // Export Route in JSON
  const exportRouteAsJSON = () => {
    const blob = new Blob([JSON.stringify(routeData)], { type: "application/json" });
    saveAs(blob, "route.json");
  };

  // Handle Location Upload and Route Generation
  const handleLocationUpload = (e) => {
    const files = e.target.files;

    if (files && files[0]) {
      const reader = new FileReader();
      reader.onload = () => {
        const data = JSON.parse(reader.result); // Assuming file contains JSON with coordinates
        const locations = data.map((location) => [location.longitude, location.latitude]);
        setLocations(locations);
        getOptimizedRoute(locations);
      };
      reader.readAsText(files[0]);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Optimize Delivery Routes</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Location Upload */}
        <div>
          <Input type="file" onChange={handleLocationUpload} accept=".json" />
          <p className="text-sm text-gray-500 mt-2">
            Upload a JSON file containing an array of locations with `latitude` and `longitude`.
          </p>
        </div>

        {/* Map Visualization */}
        <div ref={mapContainer} style={{ width: "100%", height: "500px", borderRadius: "8px" }}></div>

        {/* Export Buttons */}
        {routeData && (
          <div className="flex gap-2">
            <Button className="bg-[#00432f] text-white rounded-lg px-4 py-2 hover:bg-[#003322]">Export as KML</Button>
            <Button className="bg-[#00432f] text-white rounded-lg px-4 py-2 hover:bg-[#003322]">Export as GPX</Button>
            <Button className="bg-[#00432f] text-white rounded-lg px-4 py-2 hover:bg-[#003322]">Export as JSON</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RouteOptimization;
