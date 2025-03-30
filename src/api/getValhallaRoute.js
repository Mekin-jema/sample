export const getDefaultRoute = async (waypoints) => {
  const valhallaUrl = "https://valhalla1.openstreetmap.de/route";

  const locations = waypoints.map((waypoint) => ({
    lat: waypoint.latitude,
    lon: waypoint.longitude,
  }));


  // Prepare the route request
  const routeRequest = {
    locations, // Use the dynamically generated locations
    costing: "auto", // Driving route
    directions_options: { units: "kilometers" },
  };

  try {
    const response = await fetch(valhallaUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(routeRequest),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json(); // Await response.json()
    return data;
  } catch (error) {
    console.error("There was an error while fetching the route:", error);
    throw error; // Re-throw the error so the calling function can handle it
  }
};
