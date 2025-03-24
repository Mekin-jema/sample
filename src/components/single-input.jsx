import React, { useState } from "react";
import { Search, X, ArrowRight } from "lucide-react";
import getPlaces from "../api/getPlaces";
import maplibregl from "maplibre-gl";

export default function GeocodingInput({ map, setToggleGeocoding }) {
  const [suggestions, setSuggestions] = useState([]);
  const [inputValue, setInputValue] = useState("");

  const queryPlaces = async (query) => {
    if (query) {
      const res = await getPlaces(query);
      if (res && res.features) {
        setSuggestions(res.features);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleChange = (event) => {
    const value = event.target.value;
    setInputValue(value);
    queryPlaces(value);
  };

  const handleSelectSuggestion = ({ place_name, center }) => {
    if (!map) return;

    new maplibregl.Marker({ color: "#4285F4", draggable: true })
      .setLngLat(center)
      .addTo(map);

    map.flyTo({ center, essential: true });

    setSuggestions([]);
    setInputValue(place_name);
  };

  return (
    <div className="relative p-2 w-[392px] flex items-center gap-1 ">
      {/* Input Field and Suggestions */}
      <div className="relative w-full">
        <input
          type="text"
          value={inputValue}
          onChange={handleChange}
          placeholder="Search Ambalay Maps"
          className="w-full py-3 shadow-lg pl-5 pr-12 border rounded-full text-black  focus:outline-none  transition-all"
        />

        {/* Search Icon */}
        <Search className="absolute right-16 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />

        {/* Directions Icon */}
        <ArrowRight
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#0B57D0] cursor-pointer"
          size={20}
          onClick={() => setToggleGeocoding(true)}
        />

        {/* Suggestions Dropdown */}
        {suggestions.length > 0 && (
          <ul className="absolute left-0  w-[99.999%]    bg-white  shadow-lg z-0 rounded-t-xl ">
            {suggestions.map((suggestion, idx) => (
              <li
                key={idx}
                onClick={() => handleSelectSuggestion(suggestion)}
                className="px-4 py-2 text-sm text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
              >
                {suggestion.place_name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}