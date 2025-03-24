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
import { testStyle } from "@/styles/testStyle";

import AddressBox from "../inputHandler";
import GeocodingInput from "@/components/single-input";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Main } from "@/components/main";


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

 const dispatch = useDispatch();
 const { waypoints } = useSelector((state) => state.map); // Waypoints from Redux

 const scrollRef = useRef(null);

 const scroll = (direction) => {
   if (scrollRef.current) {
     const { scrollLeft, clientWidth } = scrollRef.current;
     const scrollAmount = clientWidth * 0.5; // Adjust scroll speed
     scrollRef.current.scrollTo({
       left: direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
       behavior: "smooth",
     });
   }
 }

  // Initialize MapLibre Map
  useEffect(() => {
     // Create and configure the map instance
     mapInstance.current = new maplibregl.Map({
      container: mapContainer.current,
      style: testStyle,
      center: [38.7613, 9.0108],
      zoom: 14,
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
      const currentStyle = mapInstance.current.getStyle().name;
      const satelliteStyle = styles.satelite;
      const defaultStyle = styles.default;
      mapInstance.current.setStyle(
        currentStyle === "Bright" ? satelliteStyle : defaultStyle
      );
    };
    layerSwitcher.appendChild(satelliteButton);
    mapInstance.current.addControl(
      { onAdd: () => layerSwitcher, onRemove: () => {} },
      "bottom-right"
    );


    // Add marker at Addis Ababa
    const marker = new maplibregl.Marker({
      color: "#4285F4",
      draggable: true,
    })
      .setLngLat([38.7626, 9.0404])
      .addTo(mapInstance.current);


// Handle missing icons and style them like Google Maps POI icons
mapInstance.current.on("styleimagemissing", (e) => {
  const missingImageId = e.id;
  console.log("Missing icon requested:", missingImageId);
  
  const category = categories.find((cat) => cat.icon === missingImageId);

  if (category && !mapInstance.current.hasImage(missingImageId)) {
    const img = new Image();
    img.crossOrigin = "anonymous"; // Handle external image sources
    img.src = category.iconUrl;

    img.onload = () => {
      // Get current zoom level
      const zoom = mapInstance.current.getZoom();
      
      // Calculate dynamic size based on zoom level
      // Adjust these values to control the size scaling
      const maxSize = 500; // Maximum size at highest zoom
      const minSize = 200; // Minimum size at lowest zoom
      const zoomThreshold = 16; // Zoom level where size starts decreasing
      
      // Calculate size - smaller when zoomed out, larger when zoomed in
      let canvasSize = maxSize;
      if (zoom < zoomThreshold) {
        // Scale down as we zoom out
        const scaleFactor = (zoom - 10) / (zoomThreshold - 10); // Adjust 10 to your min zoom
        canvasSize = minSize + (maxSize - minSize) * Math.max(0, scaleFactor);
      }

      const canvas = document.createElement("canvas");
      canvas.width = canvasSize;
      canvas.height = canvasSize;
      const ctx = canvas.getContext("2d");

      // Draw Google Maps style background (pin look)
      ctx.beginPath();
      ctx.arc(canvasSize / 2, canvasSize / 2, canvasSize / 2 - 8, 0, Math.PI * 2);
      ctx.fillStyle = "#fff"; // white circle background
      ctx.shadowColor = "rgba(0, 0, 0, 0.2)";
      ctx.shadowBlur = 10;
      ctx.fill();
      ctx.closePath();

      // Draw the actual icon image centered
      const padding = canvasSize * 0.1; // Make padding proportional to size
      ctx.shadowBlur = 0; // Remove shadow for the icon itself
      ctx.drawImage(
        img, 
        padding, 
        padding, 
        canvasSize - padding * 2, 
        canvasSize - padding * 2
      );

      // Optional: Add a subtle border
      ctx.beginPath();
      ctx.arc(canvasSize / 2, canvasSize / 2, canvasSize / 2 - 8, 0, Math.PI * 2);
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#cbd5e1"; // soft border color
      ctx.stroke();
      ctx.closePath();

      // Add the styled icon to the map
      mapInstance.current.addImage(missingImageId, {
        width: canvasSize,
        height: canvasSize,
        data: ctx.getImageData(0, 0, canvasSize, canvasSize).data
      });
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

  // Fetch Optimized Route from OpenRouteService



  // * Fetch and render routes based on waypoints
 useEffect(() => {
   if (!map || !waypoints[0].latitude || !waypoints[1].longitude) return;


   const fetchRoutes = async () => {
     const coordinates = waypoints.slice(0, 2);


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
             "blue",
             shortestRoute.routes[0].geometry.coordinates,
             "route1",
             10,
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
             "green",
             routeGeometry,
             "route2",
             10,
             setWaypoints,
             waypoints,
             dispatch
           );
         }
       } else {
         const optimizeRoute = await getOptimizedRouteWithStops(waypoints);
         if (optimizeRoute?.trips?.length > 0) {
           addRouteLayer(
             map,
             "#A91CD8",
             optimizeRoute.trips[0].geometry.coordinates,
             "route3",
             10,
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


 /**
  * Handle POI category click
  */
 const handleCategoryClick = async (category) => {
   if (!map || loading) return;
   setShowCategoryDetailPopup(true);
   const icon = category.icon;
   setActiveCategory(category.name);


   const center = map.getCenter().toArray();
   const data = await fetchPOIs(category.tag, center, icon);
   console.log(data)


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

    <div className="absolute top-0 left-0 p-2 flex border-gray-300 bg-transparent z-10 items-center ">
    <SidebarTrigger className="ml-2 " />
      {toggleGeocoding ? (
        <AddressBox route={route} map={map} setToggleGeocoding={setToggleGeocoding}/>
      ) : (
        <GeocodingInput map={map} setToggleGeocoding={setToggleGeocoding} />
      )}
    </div>
    <div className="absolute flex top-[70px]  sm:top-[60px] lg:top-[15px] items-center overflow-x-auto no-scrollbar right-0 w-[700px] max-w-full scrollbar-hidden scrollbar-thumb-transparent scrollbar-track-transparent">
      {/* Left Scroll Button */}
      <button
        onClick={() => scroll("left")}
        className="absolute left-[-1] z-20 bg-white text-black  shadow-md p-2 rounded-full hidden sm:flex"
      >
        <ChevronLeft size={20} />
      </button>

      {/* Scrollable Categories */}
      <div
        ref={scrollRef}
        className="flex  space-x-2 p-2 border-b border-gray-300 bg-transparent z-10 sm:flex-nowrap w-[560px] md:w-full"
        style={{ scrollBehavior: "smooth", whiteSpace: "nowrap" }}
      >
        {categories.map((category) => (
          <button
            key={category.name}
            onClick={() => handleCategoryClick(category)}
            className={`flex items-center px-3 py-1 border border-[#00432F] space-x-2 rounded-full w-full ${
              activeCategory === category.name ? "bg-[#00432F] text-white" : "bg-white text-black"
            }`}
            disabled={loading}
          >
            <category.IconComponent />
            <span>{category.name}</span>
          </button>
        ))}
      </div>

      {/* Right Scroll Button */}
      <button
        onClick={() => scroll("right")}
        className="absolute right-0 z-10 bg-white  text-black shadow-md p-2 rounded-full hidden sm:flex"
      >
        <ChevronRight size={20} />
      </button>
    </div>

    <ToastContainer position="top-center" autoClose={10000} />
    <div ref={mapContainer} className="relative inset-0 w-full h-screen rounded-[18px] " />
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



