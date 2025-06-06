import React, { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from "recharts";

const MapWithElevation = () => {
    const mapContainer = useRef(null);
    const [elevationData, setElevationData] = useState([]);

    const myAPIKey = "0d3e5c9668f242409228bfa012c04031";

    const waypoints = [
        {
            latlon: [44.56887641018278, -110.37193509232105],
            address: "Howard Eaton-Fishing Bridge-Canyon, Park County, WY, USA",
        },
        {
            latlon: [44.64991504629589, -110.87685585784652],
            address: "251 Echo Canyon Road, Teton County, WY, USA",
        },
        {
            latlon: [44.46198969253814, -110.83290070191913],
            address: "Lower Hamilton Store, Teton County, WY, USA",
        },
        {
            latlon: [44.534340496926745, -110.43392313273148],
            address: "Grand Loop Road, Bridge Bay, WY, USA",
        },
    ];

    useEffect(() => {
        const map = new maplibregl.Map({
            container: mapContainer.current,
            style:
                "https://api.maptiler.com/maps/01968a1a-ecb1-7ac1-9adc-52d1e2806799/style.json?key=3giWouSPCAkMilVTFMUW",
            center: [-110.63886603832373, 44.57344946153063],
            zoom: 8,
        });

        map.addControl(new maplibregl.NavigationControl());

        waypoints.forEach((waypoint) => {
            new maplibregl.Marker()
                .setLngLat([waypoint.latlon[1], waypoint.latlon[0]])
                .setPopup(new maplibregl.Popup().setText(waypoint.address))
                .addTo(map);
        });

        const fetchRoute = async () => {
            try {
                const response = await fetch(
                    `https://api.geoapify.com/v1/routing?waypoints=${waypoints
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

                // if (map.getSource("route")) {
                //     map.getSource("route").setData(routeResult);
                // } else {
                //     map.addSource("route", {
                //         type: "geojson",
                //         data: routeResult,
                //     });
                // }

                // drawRoute(map);

                const elevationProfile = calculateElevationProfileData(routeResult);
                setElevationData(elevationProfile);
            } catch (err) {
                console.error("Error fetching route:", err);
            }
        };

        fetchRoute();

        return () => {
            map.remove();
        };
    }, []);

    const drawRoute = (map) => {
        if (map.getLayer("route-layer")) {
            map.removeLayer("route-layer");
        }

        map.addLayer({
            id: "route-layer",
            type: "line",
            source: "route",
            layout: {
                "line-cap": "round",
                "line-join": "round",
            },
            paint: {
                "line-color": "#6084eb",
                "line-width": 8,
            },
            filter: ["==", "$type", "LineString"],
        });
    };

    const calculateElevationProfileData = (routeData) => {
        const MAX_POINTS = 1000; // max points to avoid overload
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

        // Optimize data points for display
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

        // Return array of objects for Recharts
        return labelsOptimized.map((dist, idx) => ({
            distance: Math.round(dist), // rounded for cleaner x-axis
            elevation: dataOptimized[idx],
        }));
    };

    return (
        <div style={{ width: "100%", height: "100%" }}>
            <div style={{ width: "100%", height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={elevationData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="distance"
                            type="number"
                            domain={["dataMin", "dataMax"]}
                            label={{ value: "Distance (m)", position: "insideBottomRight", offset: -5 }}
                        />
                        <YAxis
                            dataKey="elevation"
                            type="number"
                            domain={["auto", "auto"]}
                            label={{ value: "Elevation (m)", angle: -90, position: "insideLeft" }}
                        />
                        <Tooltip
                            formatter={(value, name) => [`${value} m`, name]}
                            labelFormatter={(label) => `Distance: ${label} m`}
                        />
                        <Line
                            type="monotone"
                            dataKey="elevation"
                            stroke="#66ccff"
                            fill="#66ccff66"
                            dot={false}
                            strokeWidth={2}
                            isAnimationActive={false}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
            <div
                ref={mapContainer}
                id="my-map"
                style={{ width: "100%", height: "500px", marginBottom: 20 }}
            ></div>

        </div>
    );
};

export default MapWithElevation;
