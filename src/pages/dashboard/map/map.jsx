import React, { useEffect, useRef, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { getDefaultRoute } from "@/pages/dashboard/map/api/getValhallaRoute";
import fetchPOIs from "@/pages/dashboard/map/api/getPointOfInterest";
// import fetchTrafficData from "@/pages/dashboard/map/api/getTrafficData";
import { addPOILayerToMap } from "@/pages/dashboard/map/utils/addPOILayer";
import categories from "@/pages/dashboard/map/utils/category";
import AddressBox from "./inputHandler";
import GeocodingInput from "@/pages/dashboard/map/single-input";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { Main } from "@/pages/dashboard/main";
import { styles } from "@/pages/dashboard/map/map-styles/MapStyles";
import CategoryScroll from "@/pages/dashboard/map/poi-buttons";
import { variablelStyles } from "@/pages/dashboard/map/map-styles/variable-style";
import MapStyles from "@/pages/dashboard/map/map-style-popup";
import { addUpdatedValhalla } from "./utils/add-updated-valhalla";
import "../../dashboard/map/Popup/style.css";
import { getRouteInfo } from "./api";
import { removePOILayerFromMap } from "./utils/remove-poi-layer";
import { testStyle } from "./map-styles/testStyle";
import ReactDOM from "react-dom"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  CartesianGrid,
  Area,
  ReferenceLine,
} from "recharts";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { X, Layers, Mountain, ChevronUp, ChevronDown, LocateFixed, Compass, Route, MapPin, TrafficCone, Satellite, LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import "./popupMessage.css";
// import { addTrafficLayer } from "./utils/add-traffic-layer";
import { debounce } from "lodash";

const Map = () => {
  const myAPIKey = "0d3e5c9668f242409228bfa012c04031";

  // Refs and state
  const mapContainer = useRef(null);
  const mapInstance = useRef(null);
  const [route, setRoute] = useState(null);
  const [map, setMap] = useState(null);
  const [pois, setPois] = useState([]);
  const [trafficData, setTrafficData] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toggleGeocoding, setToggleGeocoding] = useState(false);
  const [mapStyle, setMapStyle] = useState(variablelStyles[0].url);
  const [profile, setProfile] = useState("auto");
  const [selectedStyle, setSelectedStyle] = useState(variablelStyles[0].name);
  const [elevationData, setElevationData] = useState([]);
  const [showElevationProfile, setShowElevationProfile] = useState(false);
  const [showMapStyles, setShowMapStyles] = useState(false);
  const [isElevationExpanded, setIsElevationExpanded] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [showRouteSummary, setShowRouteSummary] = useState(false);
  const [is3DView, setIs3DView] = useState(false);
  const [bearing, setBearing] = useState(0);
  // const [showTraffic, setShowTraffic] = useState(false);
  const [currentPositionMarker, setCurrentPositionMarker] = useState(null);
  const { state } = useSidebar();
  const dispatch = useDispatch();
  const { waypoints } = useSelector((state) => state.map);

  // Initialize Map
  useEffect(() => {
    if (!mapContainer.current) return;

    mapInstance.current = new maplibregl.Map({
      container: mapContainer.current,
      style: testStyle,
      center: [38.7613, 9.0108],
      zoom: 14,
      pitch: 0,
      bearing: 0,
      antialias: true,
    });

    // Map load event
    mapInstance.current.on("load", () => {
      mapInstance.current.flyTo({
        center: [38.7613, 9.0108],
        zoom: 14,
        speed: 1.2,
        curve: 1.5,
        essential: true,
      });
    });

    // Map movement events
    mapInstance.current.on("move", () => {
      setBearing(mapInstance.current.getBearing());
      // setPitch(mapInstance.current.getPitch());
      // setZoom(mapInstance.current.getZoom());
    });

    // POI click interaction
    mapInstance.current.on("click", "poi-layer", (e) => {
      const features = e.features[0];
      if (!features) return;

      const poiId = features.id;
      mapInstance.current.setPaintProperty("poi-layer", "icon-size", [
        "case",
        ["==", ["get", "id"], poiId],
        2.0,
        1.0,
      ]);

      // Show POI details
      const coordinates = e.lngLat.toArray();
      const description = `
        <div class="poi-popup">
          <h3>${features.properties.name || "Unnamed Location"}</h3>
          ${features.properties.cuisine ? `<p><strong>Cuisine:</strong> ${features.properties.cuisine}</p>` : ''}
          ${features.properties.opening_hours ? `<p><strong>Hours:</strong> ${features.properties.opening_hours}</p>` : ''}
          ${features.properties.website ? `<p><strong>Website:</strong> <a href="${features.properties.website}" target="_blank">${features.properties.website}</a></p>` : ''}
        </div>
      `;

      new maplibregl.Popup()
        .setLngLat(coordinates)
        .setHTML(description)
        .addTo(mapInstance.current);
    });

    // Add controls
    mapInstance.current.addControl(new maplibregl.NavigationControl(), "bottom-right");
    mapInstance.current.addControl(new maplibregl.FullscreenControl(), "bottom-right");

    // Add geolocation control
    const geolocate = new maplibregl.GeolocateControl({
      positionOptions: { enableHighAccuracy: true },
      trackUserLocation: true,
      showUserHeading: true,
      fitBoundsOptions: { maxZoom: 15 },
    });

    mapInstance.current.addControl(geolocate, "bottom-right");

    geolocate.on("geolocate", (e) => {
      setUserLocation([e.coords.longitude, e.coords.latitude]);

      // Add or update marker for current position
      if (currentPositionMarker) {
        currentPositionMarker.setLngLat([e.coords.longitude, e.coords.latitude]);
      } else {
        const marker = new maplibregl.Marker({
          color: "#4285F4",
          draggable: false,
        })
          .setLngLat([e.coords.longitude, e.coords.latitude])
          .addTo(mapInstance.current);
        setCurrentPositionMarker(marker);
      }
    });

    // Add 3D view toggle button
    const toggle3DButton = createControlButton(
      Compass, // Pass the component itself, not an instance
      () => {
        setIs3DView(!is3DView);
        mapInstance.current.flyTo({
          pitch: is3DView ? 0 : 60,
          bearing: is3DView ? 0 : bearing,
          duration: 1000,
        });
      },
      "Toggle 3D View"
    );

    mapInstance.current.addControl(
      { onAdd: () => toggle3DButton, onRemove: () => { } },
      "top-right"
    );
    // mapInstance.current.addControl(
    //   { onAdd: () => toggle3DButton, onRemove: () => { } },
    //   "top-right"
    // );

    // Add satellite view button
    const satelliteButton = createControlButton(
      <Satellite size={18} />,
      () => {
        const isSatellite = mapInstance.current.getStyle().sources['map-tiles']?.url.includes('satellite');
        mapInstance.current.setStyle(isSatellite ? testStyle : styles.satelite);
      },
      "Satellite View"
    );

    mapInstance.current.addControl(
      { onAdd: () => satelliteButton, onRemove: () => { } },
      "top-right"
    );

    // // // Add traffic toggle button
    // const trafficButton = createControlButton(
    //   <TrafficCone size={18} />,
    //   () => {
    //     setShowTraffic(!showTraffic);
    //     if (!showTraffic && trafficData.length > 0) {
    //       addTrafficLayer(mapInstance.current, trafficData);
    //     } else {
    //       if (mapInstance.current.getLayer('traffic-layer')) {
    //         mapInstance.current.removeLayer('traffic-layer');
    //         mapInstance.current.removeSource('traffic-data');
    //       }
    //     }
    //   },
    //   "Traffic Data"
    // );

    // mapInstance.current.addControl(
    //   { onAdd: () => trafficButton, onRemove: () => { } },
    //   "top-right"
    // );

    // Handle missing icons
    mapInstance.current.on("styleimagemissing", handleMissingImage);

    // Initial route fetch
    if (waypoints.length >= 2) {
      fetchInitialRoute();
    }

    setMap(mapInstance.current);

    return () => mapInstance.current?.remove();
  }, []);

  useEffect(() => {
    if (waypoints.length === 0) return;

    const lastWaypoint = waypoints[waypoints.length - 1];

    if (lastWaypoint.latitude && lastWaypoint.longitude) {

      mapInstance.current.flyTo({
        center: [lastWaypoint.longitude, lastWaypoint.latitude],
        zoom: 18,
        speed: 1.2,
        curve: 1.5,
        essential: true,
      });

    }
  }, [waypoints]);

  // Handle traffic data and layer
  // useEffect(() => {
  //   if (!mapInstance.current || !showTraffic) return;

  //   const fetchAndDisplayTraffic = async () => {
  //     try {
  //       setLoading(true);
  //       const data = await fetchTrafficData();
  //       setTrafficData(data);
  //       addTrafficLayer(mapInstance.current, data);
  //       toast.success("Traffic data loaded successfully");
  //     } catch (error) {
  //       toast.error("Failed to load traffic data");
  //       console.error("Error fetching traffic data:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   if (showTraffic) {
  //     fetchAndDisplayTraffic();
  //   } else {
  //     if (mapInstance.current.getLayer('traffic-layer')) {
  //       mapInstance.current.removeLayer('traffic-layer');
  //       mapInstance.current.removeSource('traffic-data');
  //     }
  //   }
  // }, [showTraffic]);

  // Helper function to create control buttons with tooltips
  const createControlButton = (IconComponent, onClick, tooltipText = "") => {
    // Create container elements
    const button = document.createElement("button");
    button.className = "maplibregl-ctrl-icon";

    const container = document.createElement("div");
    container.className = "custom-map-control";

    // Create a DOM element to mount our React icon
    const iconContainer = document.createElement("div");

    // Add tooltip if provided
    if (tooltipText) {
      const tooltip = document.createElement("div");
      tooltip.className = "map-control-tooltip";
      tooltip.textContent = tooltipText;
      container.appendChild(tooltip);
    }

    // Use ReactDOM to render the icon component
    ReactDOM.render(
      <IconComponent className="map-control-icon" size={18} />,
      iconContainer
    );

    container.appendChild(iconContainer);
    button.appendChild(container);
    button.onclick = onClick;

    const wrapper = document.createElement("div");
    wrapper.className = "maplibregl-ctrl";
    wrapper.appendChild(button);

    return wrapper;
  };
  // Handle missing map icons
  const handleMissingImage = useCallback((e) => {
    const missingImageId = e.id;
    const category = categories.find((cat) => cat.icon === missingImageId);

    if (category && !mapInstance.current.hasImage(missingImageId)) {
      const img = new Image();
      img.crossOrigin = "anonymous";

      const iconName = category.icon;
      const color = category.textColor;
      const strokeColor = "ffffff00";
      const iconType = "material";

      img.src = `https://api.geoapify.com/v1/icon/?type=material&color=${encodeURIComponent(
        color
      )}&icon=${iconName}&iconType=${iconType}&strokeColor=${encodeURIComponent(
        strokeColor
      )}&apiKey=${myAPIKey}`;

      img.onload = () => mapInstance.current.addImage(missingImageId, img);
      img.onerror = () => console.error(`Failed to load icon for ${iconName}`);
    }
  }, []);

  // Fetch initial route and elevation data
  const fetchInitialRoute = async () => {
    try {
      const newWayPoint = waypoints.map((wp) => ({
        latlon: [wp.latitude, wp.longitude],
        address: wp.placeName || "Unnamed location",
      }));

      const response = await fetch(
        `https://api.geoapify.com/v1/routing?waypoints=${newWayPoint
          .map((wp) => wp.latlon.join(","))
          .join("|")}&mode=mountain_bike&details=elevation&apiKey=${myAPIKey}`
      );
      const routeResult = await response.json();

      if (
        !routeResult.features ||
        !routeResult.features[0] ||
        !routeResult.features[0].properties.legs
      ) {
        console.error("Invalid route data", routeResult);
        return;
      }

      const elevationProfile = calculateElevationProfileData(routeResult);
      setElevationData(elevationProfile);

      // // Show route summary
      // if (routeResult.features[0].properties) {
      //   const { distance, time, legs } = routeResult.features[0].properties;
      //   setShowRouteSummary(true);
      //   setTimeout(() => setShowRouteSummary(false), 10000);

      //   toast.info(
      //     <div>
      //       <h4 className="font-bold">Route Summary</h4>
      //       <p>Distance: {(distance / 1000).toFixed(1)} km</p>
      //       <p>Estimated Time: {Math.round(time / 60)} minutes</p>
      //       {legs && legs.length > 1 && <p>Legs: {legs.length}</p>}
      //     </div>,
      //     { autoClose: 8000 }
      //   );
      // }
    } catch (err) {
      console.error("Error fetching route:", err);
      toast.error("Failed to calculate route elevation");
    }
  };

  // Update map style when changed
  useEffect(() => {
    if (mapInstance.current) {
      mapInstance.current.setStyle(`${mapStyle}?apiKey=${myAPIKey}`);
    }
  }, [mapStyle]);

  // Debounced route calculation
  const calculateRoute = useCallback(
    debounce(async (waypoints, profile) => {
      if (!map || waypoints.length < 2) return;

      const isValidWaypoints = waypoints.every(
        (wp) => wp.latitude !== null && wp.longitude !== null
      );
      if (!isValidWaypoints) return;

      try {
        const valhallaRoute = await getDefaultRoute(waypoints, profile);
        const routesInfo = await getRouteInfo(waypoints);
        setRoute(routesInfo.routes[0]);
        addUpdatedValhalla(map, valhallaRoute, waypoints, dispatch, profile);

        // Calculate elevation for the new route
        const elevationProfile = await calculateRouteElevation(waypoints);
        setElevationData(elevationProfile);
      } catch (error) {
        console.error("Error fetching routes:", error.message);
        toast.error("Failed to calculate route");
      }
    }, 500),
    [map, dispatch, mapStyle]
  );

  // Calculate route elevation
  const calculateRouteElevation = async (waypoints) => {
    try {
      const newWayPoint = waypoints.map((wp) => ({
        latlon: [wp.latitude, wp.longitude],
        address: wp.placeName || "Unnamed location",
      }));

      const response = await fetch(
        `https://api.geoapify.com/v1/routing?waypoints=${newWayPoint
          .map((wp) => wp.latlon.join(","))
          .join("|")}&mode=mountain_bike&details=elevation&apiKey=${myAPIKey}`
      );
      const routeResult = await response.json();

      if (
        !routeResult.features ||
        !routeResult.features[0] ||
        !routeResult.features[0].properties.legs
      ) {
        console.error("Invalid elevation data", routeResult);
        return [];
      }

      return calculateElevationProfileData(routeResult);
    } catch (err) {
      console.error("Error fetching elevation:", err);
      toast.error("Failed to calculate elevation profile");
      return [];
    }
  };

  // Fetch and render routes when waypoints or profile changes
  useEffect(() => {
    calculateRoute(waypoints, profile);
  }, [waypoints, profile, calculateRoute]);

  // Add POIs to map
  useEffect(() => {
    if (!map || pois.length === 0) return;
    addPOILayerToMap(map, pois);
  }, [pois, map]);

  // Calculate elevation profile data
  const calculateElevationProfileData = (routeData) => {
    const MAX_POINTS = 1000;
    const legElevations = [];

    routeData.features[0].properties.legs.forEach((leg) => {
      let elevationRange = leg.elevation_range || [];
      legElevations.push(elevationRange);
    });

    let labels = [];
    let data = [];

    legElevations.forEach((legElevation, index) => {
      let previousLegsDistance = 0;
      for (let i = 0; i < index; i++) {
        previousLegsDistance += legElevations[i][legElevations[i].length - 1]?.[0] || 0;
      }

      labels.push(...legElevation.map((e) => e[0] + previousLegsDistance));
      data.push(...legElevation.map((e) => e[1]));
    });

    // Optimize data points
    const labelsOptimized = [];
    const dataOptimized = [];
    const minDist = 5;
    const minHeight = 10;

    labels.forEach((dist, index) => {
      if (
        index === 0 ||
        index === labels.length - 1 ||
        dist - (labelsOptimized[labelsOptimized.length - 1] || 0) > minDist ||
        Math.abs(data[index] - (dataOptimized[dataOptimized.length - 1] || 0)) > minHeight
      ) {
        labelsOptimized.push(dist);
        dataOptimized.push(data[index]);
      }
    });

    return labelsOptimized.map((dist, idx) => ({
      distance: Math.round(dist),
      elevation: dataOptimized[idx],
    }));
  };

  // Handle POI category click
  const handleCategoryClick = async (category) => {
    if (!map || loading) return;

    if (activeCategory === category.name) {
      setActiveCategory(null);
      setPois([]);
      removePOILayerFromMap(map);
      return;
    }

    setActiveCategory(category.name);
    setLoading(true);

    try {
      const center = map.getCenter().toArray();
      const data = await fetchPOIs(category.tag, center, category.icon);

      const pois = data.elements.map((element) => ({
        id: element.id,
        name: element.tags["name:am"] || element.tags.name || "Unknown",
        lat: element.lat || element.center?.lat,
        lng: element.lon || element.center?.lon,
        icon: category.icon,
        color: category.textColor,
        cuisine: element.tags.cousine || "",
        internet_access: element.tags.internet_access || "",
        opening_hours: element.tags.opening_hours || "",
        tourism: element.tags.tourism || "",
        website: element.tags.website || "",
        iconComp: category.IconComponent,
      }));

      setPois(pois);
      removePOILayerFromMap(map);
      addPOILayerToMap(map, pois);
      // toast.success(`Loaded ${pois.length} ${category.name} locations`);
    } catch (error) {
      toast.error(`Failed to load ${category.name} data`);
      console.error(`Error fetching ${category.name} data:`, error);
    } finally {
      setLoading(false);
    }
  };

  // Handle style change
  const handleStyleChange = (style) => {
    setMapStyle(style.url);
    setSelectedStyle(style.name);
    setShowMapStyles(false);
    // toast.info(`Map style changed to ${style.name}`);
  };


  // Reset map view
  const resetMapView = () => {
    mapInstance.current.flyTo({
      center: [38.7613, 9.0108],
      zoom: 14,
      pitch: 0,
      bearing: 0,
      essential: true,
    });
    setIs3DView(false);
  };

  return (
    <Main className="relative w-full h-screen ml-1 mr-1 overflow-hidden">
      {/* Loading overlay */}
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 backdrop-blur-sm">
          <div className="flex flex-col items-center space-y-4 p-6 ">
            <LoaderCircle className="w-12 h-12 text-green-700 animate-spin" />
            <p className="text-xl text-green-800 dark:text-green-800 font-semibold">
              Loading Data...
            </p>
          </div>
        </div>
      )}

      {/* Map style selector */}
      {showMapStyles && (
        <MapStyles
          variablelStyles={variablelStyles}
          selectedStyle={selectedStyle}
          handleStyleChange={handleStyleChange}
        />
      )}

      {/* Search input */}
      <div
        className={cn(
          "fixed top-1 flex z-10 items-center transition-all duration-300",
          state === "collapsed" ? "md:left-[80px]" : "md:left-[320px]"
        )}
      >
        <SidebarTrigger className="ml-2 bg-white dark:bg-gray-800 shadow-md hover:bg-gray-100 dark:hover:bg-gray-700" />
        {toggleGeocoding ? (
          <AddressBox
            route={route}
            map={map}
            setToggleGeocoding={setToggleGeocoding}
            profile={profile}
            setProfile={setProfile}
            className="ml-2 shadow-lg"
          />
        ) : (
          <GeocodingInput
            map={map}
            setToggleGeocoding={setToggleGeocoding}
            className="ml-2 shadow-lg"
          />
        )}
      </div>

      {/* Map controls */}
      <div className="fixed  top-20 right-4 z-20 flex flex-col space-y-3">
        {/* Location button */}




        {/* Elevation profile button */}
        <Tooltip delayDuration={100}>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className={cn(
                "w-10 h-10 transition-all",
                showElevationProfile && "bg-blue-100 dark:bg-blue-900"
              )}
              onClick={() => setShowElevationProfile(!showElevationProfile)}
            >
              <Mountain className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left" className="bg-gray-800 text-white">
            <p>Elevation Profile</p>
          </TooltipContent>
        </Tooltip>

        {/* Map styles button */}
        <Tooltip delayDuration={100}>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className={cn(
                "w-10 h-10 transition-all",
                showMapStyles && "bg-blue-100 dark:bg-blue-900"
              )}
              onClick={() => setShowMapStyles(!showMapStyles)}
            >
              <Layers className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left" className="bg-gray-800 text-white">
            <p>Map Styles</p>
          </TooltipContent>
        </Tooltip>
      </div>



      {/* Toast notifications */}
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />

      {/* Map container */}
      <div
        ref={mapContainer}
        className="fixed top-0 left-0 w-full h-full rounded-[5px]"
      />

      {/* POI category scroll */}
      <CategoryScroll
        categories={categories}
        activeCategory={activeCategory}
        handleCategoryClick={handleCategoryClick}
        className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-20"
      />

      {/* Elevation profile */}
      {showElevationProfile && elevationData.length > 0 && (
        <Card className={cn(
          "mx-auto rounded-t-xl shadow-2xl border-t-0 bg-background dark:text-white fixed bottom-0 left-[280px] right-0 z-20 transition-all duration-300 text-black",
          isElevationExpanded ? "h-[70vh]" : "h-[300px]"
        )}>
          <CardHeader className="p-3 pb-1">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">
                Elevation Profile
              </CardTitle>
              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-8 h-8"
                  onClick={() => setIsElevationExpanded(!isElevationExpanded)}
                >
                  {isElevationExpanded ? (
                    <ChevronDown className="h-5 w-5" />
                  ) : (
                    <ChevronUp className="h-5 w-5" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-8 h-8"
                  onClick={() => setShowElevationProfile(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="h-[calc(100%-25px)] p-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={elevationData}
                margin={{ top: 10, right: 20, left: 0, bottom: 20 }}
              >
                <defs>
                  <linearGradient id="elevationGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#e5e7eb"
                  vertical={false}
                />
                <XAxis
                  dataKey="distance"
                  type="number"
                  domain={["dataMin", "dataMax"]}
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  tickFormatter={(value) => `${(value / 1000).toFixed(1)} km`}
                  label={{
                    value: "Distance",
                    position: "insideBottomRight",
                    offset: -5,
                    fill: '#6b7280',
                    fontSize: 12
                  }}
                />
                <YAxis
                  dataKey="elevation"
                  type="number"
                  domain={['dataMin - 50', 'dataMax + 50']}
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  tickFormatter={(value) => `${value} m`}
                  label={{
                    value: "Elevation",
                    angle: -90,
                    position: "insideLeft",
                    fill: '#6b7280',
                    fontSize: 12
                  }}
                />
                <RechartsTooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  }}
                  formatter={(value) => [
                    <span className="text-blue-600 font-medium">{value} m</span>,
                    "Elevation"
                  ]}
                  labelFormatter={(label) => (
                    <span className="text-gray-800 font-medium">
                      Distance: {(label / 1000).toFixed(2)} km
                    </span>
                  )}
                />
                <Area
                  type="monotone"
                  dataKey="elevation"
                  stroke="#3b82f6"
                  fillOpacity={1}
                  fill="url(#elevationGradient)"
                  strokeWidth={2}
                  activeDot={{ r: 6, stroke: '#1d4ed8', strokeWidth: 2 }}
                />
                <ReferenceLine
                  y={elevationData[0]?.elevation}
                  stroke="#10b981"
                  strokeDasharray="3 3"
                  label="Start"
                />
                <ReferenceLine
                  y={elevationData[elevationData.length - 1]?.elevation}
                  stroke="#ef4444"
                  strokeDasharray="3 3"
                  label="End"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </Main>
  );
};

export default Map;