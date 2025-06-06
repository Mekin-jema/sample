export default async function getPlaces(query) {
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${query}&countrycodes=ET`;
    const corsUrl = `https://corsproxy.io/?${encodeURIComponent(url)}`;

    const response = await fetch(corsUrl);
    if (!response.ok) throw new Error("Failed to fetch");

    return await response.json();
  } catch (error) {
    console.error("Error fetching Ethiopian places:", error);
    return [];
  }
}
