/**
* Map Component
*
* This component renders an interactive map using MapLibre GL and integrates various features such as:
* - Route calculation and rendering
* - Point of Interest (POI) display
* - Real-time traffic data visualization
* - Satellite view toggling
* - Marker placement and drag functionality
* - Toast notifications for user feedback
*
* Dependencies:
* - MapLibre GL for map rendering
* - PMTiles for map tile protocol
* - React hooks for state and lifecycle management
* - Redux for state management
* - External APIs for route, POI, and traffic data
*/


import React, { useEffect, useRef, useState } from "react"; // React hooks
import { useSelector, useDispatch } from "react-redux"; // Redux hooks
import { ToastContainer } from "react-toastify"; // Toast notifications
import "react-toastify/dist/ReactToastify.css"; // Toast styles


// MapLibre GL library and styles
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";


// PMTiles for map tile protocol
import { PMTiles, Protocol } from "pmtiles";


// API functions
import { getRouteInfo } from "@/api/getRouteInfo"; // Fetch route information
import { getShortestRoute } from "@/api/getShortestRoute"; // Fetch shortest route
import { getDefaultRoute } from "@/api/getValhallaRoute"; // Fetch default route (Valhalla)
import { getOptimizedRouteWithStops } from "@/api/getOptimizedRouteWithStops"; // Fetch optimized route with stops
import fetchPOIs from "@/api/getPointOfInterest"; // Fetch POIs
import fetchTrafficData from "@/api/getTrafficData"; // Fetch traffic data


// Utility functions
import decodePolyline from "@/utils/decoder"; // Decode polylines
import { addRouteLayer } from "@/utils/addRoutelayer"; // Add route layers to the map
import { addPOILayerToMap } from "@/utils/addPOILayer"; // Add POI layers to the map
import { addTrafficLayer } from "@/utils/addTrafficLayer"; // Add traffic layers to the map


// Components// Render address input fields
// import TrafficLegend from "@/utils/TrafficLegened"; // Traffic legend (commented out)


// import RenderDirectionDetail from "./InputHandler"; // Render address input fields
// import TrafficLegend from "../utils/TrafficLegened"; // Traffic legend (commented out)


// Styles
import categories from "@/utils/category"; // POI categories


// Redux actions
import { setWaypoints } from "@/Redux/MapSlice"; // Redux action for setting waypoints
import Categories from "@/components/poi/Popup/Categories";
import Filter from "@/components/poi/Popup/Filter";

import AddressBox from "../inputHandler";
import GeocodingInput from "@/components/single-input";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { Main } from "@/components/main";
import { styles } from "@/styles/MapStyles";
import CategoryScroll from "@/components/poi-buttons";
import { variablelStyles } from "@/styles/variable-style";
import MapStyles from "@/components/map-style-popup";


const Map = () => {
  // Refs for map container and instance
  const mapContainer = useRef(null);
  const mapInstance = useRef(null);


  // State variables
  const [route, setRoute] = useState(null); // Current route
  const [map, setMap] = useState(null); // Map instance
  const [pois, setPois] = useState([]); // Points of Interest
  const [trafficData, setTrafficData] = useState([]); // Traffic data
  const [activeCategory, setActiveCategory] = useState(null); // Active POI category
  const [loading, setLoading] = useState(false); // Loading state
  const [showCategoryDetailPopup, setShowCategoryDetailPopup] = useState(false); // Category detail state
  const [showFilterPopup, setShowFilterPopup] = useState(false); // Filter popup state
  const [toggleGeocoding, setToggleGeocoding] = useState(false); // Geocoding toggle state
    const [mapStyle, setMapStyle] = useState(variablelStyles[1].url);
  const { state } = useSidebar(); // Get sidebar state (expanded or collapsed)

  const dispatch = useDispatch();
  const { waypoints } = useSelector((state) => state.map); // Waypoints from Redux
  const myAPIKey=import.meta.env.VITE_API_KEY; // API key from environment variables
    const [selectedStyle, setSelectedStyle] = useState(variablelStyles[1].name);
  


  // Initialize MapLibre 
  useEffect(() => {
    // Create and configure the map instance
    mapInstance.current = new maplibregl.Map({
      container: mapContainer.current,
      style: `${mapStyle}?apiKey=${myAPIKey}`,
      center: [38.7613, 9.0108],
      zoom: 30,
    });


    mapInstance.current.on("load", () => {
      mapInstance.current.flyTo({
        center: [38.7613, 9.0108], // Target center
        zoom: 14, // Target zoom level
        speed: 1.2, // Animation speed
        curve: 1.5, // Controls the flight path curvature
        essential: true, // Ensures animation even for users who prefer reduced motion
      });
    });
    mapInstance.current.on("click", "poi-layer", (e) => {
      const features = e.features[0];
    
      if (!features) return;
    
      const poiId = features.id; // Unique POI identifier
    
      // Update the feature's size by changing its properties
      mapInstance.current.setPaintProperty("poi-layer", "icon-size", [
        "case",
        ["==", ["get", "id"], poiId], // If this is the clicked POI
        2.0, // Enlarge size when selected
        1.0, // Default size
      ]);
    });
    
    // Add navigation controls
    mapInstance.current.addControl(
      new maplibregl.NavigationControl(),
      "bottom-right"
    );
    mapInstance.current.addControl(
      new maplibregl.FullscreenControl(),
      "bottom-right"
    );


    // Add satellite view switcher button
    const layerSwitcher = document.createElement("div");
    layerSwitcher.className = "maplibregl-ctrl maplibregl-ctrl-group";
    const satelliteButton = document.createElement("button");
    satelliteButton.innerHTML = "🛰️"; // Satellite emoji
    satelliteButton.onclick = () => {
      const satelliteStyle = styles.satelite;

      mapInstance.current.setStyle(
        satelliteStyle
      );
    };
    layerSwitcher.appendChild(satelliteButton);
    mapInstance.current.addControl(
      { onAdd: () => layerSwitcher, onRemove: () => { } },
      "bottom-right"
    );


    // Add marker at Addis Ababa
    const marker = new maplibregl.Marker({
      color: "#4285F4",
      draggable: true,
    })
      .setLngLat([38.7626, 9.0404])
      .addTo(mapInstance.current);
      mapInstance.current.on("styleimagemissing", (e) => {
        const missingImageId = e.id;
      
        const category = categories.find((cat) => cat.icon === missingImageId);
      
        if (category && !mapInstance.current.hasImage(missingImageId)) {
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.src = category.iconUrl;
      
          img.onload = () => {
        const zoom = mapInstance.current.getZoom();
      
        // Size calculations with better scaling
        const maxSize =400;
        const minSize = 70;
        const zoomThreshold = 16;
      
        let canvasSize = maxSize;
        if (zoom < zoomThreshold) {
          const scaleFactor = Math.min(1, Math.max(0, (zoom - 10) / (zoomThreshold - 10)));
          canvasSize = minSize + (maxSize - minSize) * scaleFactor;
        }
      
        // Pointer dimensions (adjusted to remove gap)
        const pointerHeight = canvasSize * 0.2; // Reduced pointer height
        const pointerWidth = canvasSize * 0.15; // Narrower pointer
        const totalHeight = canvasSize; // Removed extra height
      
        const canvas = document.createElement("canvas");
        canvas.width = canvasSize;
        canvas.height = totalHeight;
        const ctx = canvas.getContext("2d");
      
        // Improved shape with smoother curves
        ctx.beginPath();
        
        // Draw the main circle
        const circleRadius = canvasSize / 2 - 4;
        const circleCenterX = canvasSize / 2;
        const circleCenterY = circleRadius;
        ctx.arc(circleCenterX, circleCenterY, circleRadius, 0, Math.PI * 2);
        
        // Draw the pointer with bezier curves for smoother shape
        const pointerTop = canvasSize - pointerHeight;
        const pointerBottom = canvasSize;
        ctx.moveTo(circleCenterX - pointerWidth, pointerTop);
        
        // Left curve of pointer
        ctx.bezierCurveTo(
          circleCenterX - pointerWidth * 0.7, pointerTop + pointerHeight * 0.5,
          circleCenterX - pointerWidth * 0.3, pointerBottom - pointerHeight * 0.2,
          circleCenterX, pointerBottom
        );
        
        // Right curve of pointer
        ctx.bezierCurveTo(
          circleCenterX + pointerWidth * 0.3, pointerBottom - pointerHeight * 0.2,
          circleCenterX + pointerWidth * 0.7, pointerTop + pointerHeight * 0.5,
          circleCenterX + pointerWidth, pointerTop
        );
        
        ctx.closePath();
      
        // Fill with Google Maps red
        ctx.fillStyle = category.bgColor || "#FF0000"; // Default to red if bgColor is undefined
        
        // // Enhanced shadow
        ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
        ctx.shadowBlur =4;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 1;
        ctx.fill();
      
 
        // Draw the icon with better positioning and sizing
        const iconSize = canvasSize * 0.6; // Larger icon area
        const iconX = (canvasSize - iconSize) / 2;
        const iconY = (circleCenterY - iconSize / 2); // Adjusted to remove gap
        
        // Optional: Add white background for the icon
        ctx.save();
        ctx.beginPath();
        ctx.arc(circleCenterX, circleCenterY, iconSize * 0.4, 0, Math.PI * 2);
    
        ctx.fill();
        ctx.restore();
        
        ctx.drawImage(img, iconX, iconY, iconSize, iconSize);
      
        // Convert canvas to ImageData
        const imageData = ctx.getImageData(0, 0, canvasSize, totalHeight);
      
        // Add the icon to the map
        mapInstance.current.addImage(missingImageId, imageData);
          };
      
          img.onerror = () => {
        console.error(`Failed to load image: ${category.iconUrl}`);
          };
        }
      });
      
      

    // Add geolocation control
    mapInstance.current.addControl(
      new maplibregl.GeolocateControl({
        positionOptions: { enableHighAccuracy: true },
        trackUserLocation: true,
        showUserHeading: true,
      }),
      "bottom-right"
    );


    setMap(mapInstance.current);


    return () => mapInstance.current.remove(); // Clean up on component unmount
  }, []);


  // Update map style when mapStyle changes
  useEffect(() => {
    if (mapInstance.current) {
      mapInstance.current.setStyle(`${mapStyle}?apiKey=${myAPIKey}`);
      const updateMapLayer=async()=>{

        const optimizeRoute = await getOptimizedRouteWithStops(waypoints);
        addRouteLayer(
          map,
          "#A91CD8",
          optimizeRoute.trips[0].geometry.coordinates,
          "route3",
          8,
          setWaypoints,
          waypoints,
          dispatch
        );
      }

      updateMapLayer()

    }
  }, [mapStyle]);

  // * Fetch and render routes based on waypoints
  useEffect(() => {
    // Don't proceed if map isn't loaded or we don't have at least 2 valid waypoints
    if (!map || waypoints.length < 2) return;
    
    // Check if first two waypoints have valid coordinates
    const hasValidCoordinates = waypoints.slice(0, 2).every(
      wp => wp.latitude !== null && wp.longitude !== null && !isNaN(wp.latitude) && !isNaN(wp.longitude)
    );
    
    if (!hasValidCoordinates) return;
  
    const fetchRoutes = async () => {
      const coordinates = waypoints.slice(0, 2).filter(
        wp => wp.latitude !== null && wp.longitude !== null
      );
  
      // Ensure we have at least 2 valid coordinates to calculate a route
      if (coordinates.length < 2) return;
  
      try {
        if (waypoints.length <= 2) {
          const [routeInfo, shortestRoute, valhallaRoute] = await Promise.all([
            getRouteInfo(coordinates),
            getShortestRoute(coordinates),
            getDefaultRoute(coordinates),
          ]);
  
          if (routeInfo?.routes?.length > 0) {
            setRoute(routeInfo.routes[0]);
          }
  
          if (shortestRoute?.routes?.length > 0) {
            addRouteLayer(
              map,
              "#92E3A9",
              shortestRoute.routes[0].geometry.coordinates,
              "route1",
              5,
              setWaypoints,
              waypoints,
              dispatch
            );
          }
  
          if (valhallaRoute?.trip?.legs?.length > 0) {
            const routeGeometry = valhallaRoute.trip.legs.flatMap((leg) =>
              decodePolyline(leg.shape)
            );
            addRouteLayer(
              map,
              "#A91CD8",
              routeGeometry,
              "route2",
              8,
              setWaypoints,
              waypoints,
              dispatch
            );
          }
        } else {
          // For more than 2 waypoints, filter out any invalid ones
          const validWaypoints = waypoints.filter(
            wp => wp.latitude !== null && wp.longitude !== null
          );
          
          if (validWaypoints.length < 2) return;
  
          const optimizeRoute = await getOptimizedRouteWithStops(validWaypoints);
          if (optimizeRoute?.trips?.length > 0) {
            addRouteLayer(
              map,
              "#A91CD8",
              optimizeRoute.trips[0].geometry.coordinates,
              "route3",
              8,
              setWaypoints,
              waypoints,
              dispatch
            );
            setRoute(optimizeRoute.trips[0]);
          }
        }
      } catch (error) {
        console.error("Error fetching routes:", error.message);
      }
    };
  
    fetchRoutes();
  }, [map, waypoints, dispatch]);


  /**
   * Add POIs to the map
   */
  useEffect(() => {
    if (!map || pois.length === 0) return;
    addPOILayerToMap(map, pois);
  }, [pois, map]);


  /**
   * Fetch and render traffic data
   */
  useEffect(() => {
    if (!map || trafficData.length < 1) return;
    const getTrafficData = async () => {
      const data = await fetchTrafficData();
      setTrafficData(data);
    };
    getTrafficData();
    addTrafficLayer(map, trafficData);
  }, [trafficData, map]);

  const handleStyleChange = (style) => {
    setMapStyle(style.url);
    setSelectedStyle(style.name);
  };
  /**
   * Handle POI category click
   * 
   */
  const handleCategoryClick = async (category) => {
    if (!map || loading) return;
    setShowCategoryDetailPopup(true);
    const icon = category.icon;
    setActiveCategory(category.name);


    const center = map.getCenter().toArray();
    const data = await fetchPOIs(category.tag, center, icon);



    const pois = data.elements.map((element) => ({
      id: element.id,
      name: element.tags["name:am"] || element.tags.name || "Unknown",
      lat: element.lat || element.center?.lat,
      lng: element.lon || element.center?.lon,
      icon,
      cuisine: element.tags.cousine || "",
      internet_access: element.tags.internet_access || "",
      opening_hours: element.tags.opening_hours || "",
      tourism: element.tags.tourism || "",
      website: element.tags.website || "",
      iconComp: category.IconComponent,
    }));
    setPois(pois);
    // setPois(data);

    addPOILayerToMap(map, pois);
  };
  console.log(pois)




  return (
    <Main className="relative w-full h-screen ml-1 mr-1">
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xl text-green-400 font-semibold">
              Loading Traffic Data...
            </p>
          </div>
        </div>
      )}
      {/*  */}
   <MapStyles variablelStyles={variablelStyles} selectedStyle={selectedStyle} handleStyleChange ={handleStyleChange}/>

      <div className={`fixed top-0 ${state === "collapsed" ? "md:left-[60px]" : "md:left-[300px]"} left-0  flex  z-10 items-center `}>
        <SidebarTrigger className="ml-2" />
        {toggleGeocoding ? (
          <AddressBox route={route} map={map} setToggleGeocoding={setToggleGeocoding} />
        ) : (
          <GeocodingInput map={map} setToggleGeocoding={setToggleGeocoding} />
        )}
      </div>

      <ToastContainer position="top-center" autoClose={10000} />
      <div ref={mapContainer} className="relative inset-0 w-full h-screen rounded-[18px]" />
      <CategoryScroll categories={categories} activeCategory={activeCategory} handleCategoryClick={handleCategoryClick} />
      <div className="relative z-40">
        {showCategoryDetailPopup && pois.length > 0 ? (
          <Categories
            setShowCategoryDetailPopup={setShowCategoryDetailPopup}
            setShowFilterPopup={setShowFilterPopup}
            data={pois}
            map={map}
          />
        ) : (
          showFilterPopup && (
            <Filter
              setShowFilterPopup={setShowFilterPopup}
              setShowCategoryDetailPopup={setShowCategoryDetailPopup}
            />
          )
        )}
      </div>
    </Main>
  );
};


export default Map;



