const getPlaceNameFromCoordinates = async (lngLat) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lngLat.lat}&lon=${lngLat.lng}&format=json`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json(); // Parse the response as JSON
    console.log(data);
    const placeName =
      data?.address?.city ||
      data?.address?.town ||
      data?.address?.village ||
      data?.address?.county ||
      data?.address?.state ||
      data?.address?.state_district ||
      data?.address?.country ||
      null;

    console.log("Place Name:", placeName);
    return placeName; // Return the extracted place name
  } catch (error) {
    console.error("Error fetching place name:", error);
    return "Unknown Location";
  }
};

export default getPlaceNameFromCoordinates;
