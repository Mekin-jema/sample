import React, { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

const styles = [
  {
    "name": "OSM Carto",
    "url": "https://maps.geoapify.com/v1/styles/osm-carto/style.json",
    "thumbnail": "https://apidocs.geoapify.com/assets/img/maps/map-carto.png"
  },
  {
    "name": "OSM Bright",
    "url": "https://maps.geoapify.com/v1/styles/osm-bright/style.json",
    "thumbnail": "https://apidocs.geoapify.com/assets/img/maps/map-osm-bright.png"
  },
  {
    "name": "OSM Bright Grey",
    "url": "https://maps.geoapify.com/v1/styles/osm-bright-grey/style.json",
    "thumbnail": "https://apidocs.geoapify.com/assets/img/maps/map-bright-grey.png"
  },
  {
    "name": "OSM Bright Smooth",
    "url": "https://maps.geoapify.com/v1/styles/osm-bright-smooth/style.json",
    "thumbnail": "https://apidocs.geoapify.com/assets/img/maps/map-bright-smooth.png"
  },
  {
    "name": "Klokantech Basic",
    "url": "https://maps.geoapify.com/v1/styles/klokantech-basic/style.json",
    "thumbnail": "https://apidocs.geoapify.com/assets/img/maps/map-klokantech-basic.png"
  },
  {
    "name": "OSM Liberty",
    "url": "https://maps.geoapify.com/v1/styles/osm-liberty/style.json",
    "thumbnail": "https://apidocs.geoapify.com/assets/img/maps/map-liberty.png"
  },
  {
    "name": "Maptiler 3D",
    "url": "https://maps.geoapify.com/v1/styles/maptiler-3d/style.json",
    "thumbnail": "https://apidocs.geoapify.com/assets/img/maps/map-3d.png"
  },
  {
    "name": "Toner",
    "url": "https://maps.geoapify.com/v1/styles/toner/style.json",
    "thumbnail": "https://apidocs.geoapify.com/assets/img/maps/map-toner.png"
  },
  {
    "name": "Toner Grey",
    "url": "https://maps.geoapify.com/v1/styles/toner-grey/style.json",
    "thumbnail": "https://apidocs.geoapify.com/assets/img/maps/map-toner-grey.png"
  },
  {
    "name": "Positron",
    "url": "https://maps.geoapify.com/v1/styles/positron/style.json",
    "thumbnail": "https://apidocs.geoapify.com/assets/img/maps/map-positron.png"
  }
];

const myAPIKey = "0d3e5c9668f242409228bfa012c04031";

const MapComponent = () => {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const [mapStyle, setMapStyle] = useState(styles[5].url);
  const [zoom, setZoom] = useState(12);
  const [selectedStyle, setSelectedStyle] = useState(styles[5].name);

  // Initialize map
  useEffect(() => {
    if (mapRef.current) return; // Prevent map from re-initializing

    mapRef.current = new maplibregl.Map({
      container: mapContainer.current,
      style: `${mapStyle}?apiKey=${myAPIKey}`,
      center: [38.7578, 9.03], // Addis Ababa, Ethiopia
      zoom: zoom,
    });

    // Update zoom state when map zoom changes
    mapRef.current.on('zoom', () => {
      setZoom(mapRef.current.getZoom());
    });

    return () => mapRef.current?.remove();
  }, []);

  // Update map style when mapStyle changes
  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.setStyle(`${mapStyle}?apiKey=${myAPIKey}`);
    }
  }, [mapStyle]);

  const handleZoomChange = (event) => {
    const newZoom = parseFloat(event.target.value);
    setZoom(newZoom);
    if (mapRef.current) {
      mapRef.current.setZoom(newZoom);
    }
  };

  const handleStyleChange = (style) => {
    setMapStyle(style.url);
    setSelectedStyle(style.name);
  };

  return (
    <div className="relative w-full h-screen">
      {/* Sidebar for selecting styles */}
      <div className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white p-4 rounded-xl shadow-lg z-10 max-h-[80vh] overflow-y-auto">
        <div className="text-sm font-bold mb-2 text-center">Map Styles</div>
        {styles.map((style) => (
          <div key={style.name} className="mb-2 flex flex-col items-center">
            <img
              src={style.thumbnail}
              alt={style.name}
              title={style.name}
              onClick={() => handleStyleChange(style)}
              className={`w-12 h-12 cursor-pointer ${
                selectedStyle === style.name 
                  ? "border-4 border-red-500" 
                  : "border-2 border-gray-200"
              } rounded-md hover:border-blue-400`}
            />
            <span className="text-xs mt-1 text-center">{style.name}</span>
          </div>
        ))}
      </div>

      {/* Zoom slider */}
      <div className="absolute right-4 bottom-4 bg-white p-3 rounded-lg shadow-lg z-10 w-64">
        <div className="flex justify-between text-sm mb-1">
          <span>Zoom: {zoom.toFixed(1)}</span>
        </div>
        <input
          type="range"
          min="1"
          max="18"
          step="0.1"
          value={zoom}
          onChange={handleZoomChange}
          className="w-full"
        />

      </div>

      {/* Map container */}
      <div
        ref={mapContainer}
        className="w-full h-full"
      ></div>
    </div>
  );
};

export default MapComponent;