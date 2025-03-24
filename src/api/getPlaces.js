// console.log(process.env.REACT_APP_MAPBOX_ACCESS_TOKE);
const token = import.meta.env.VITE_GOMAP_API_KEY;
export default async function getPlaces(query) {
  try {
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?access_token=${token}`
    );

    return response.json();
  } catch (error) {
    console.error("There was an error while fetching places:", error);
  }
}
