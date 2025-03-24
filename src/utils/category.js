import {
  Utensils,
  Hotel,
  ShoppingCart,

  Fuel,
} from "lucide-react";
import googleMapIcon from "google-maps-icons";
const options = { scale: 2, color: "800000" };
const parking = googleMapIcon("parking", options);

// Categories with icon components instead of JSX
const categories = [
  {
    name: "Restaurants",
    tag: "amenity=restaurant",
    IconComponent: Utensils, // Store the icon component
    icon: "restaurant",
    iconUrl: "/icons/restaurant.png",
  },
  {
    name: "Hotels",
    tag: "tourism=hotel",
    IconComponent: Hotel, // Store the icon component
    icon: "hotel",
    iconUrl: "/icons/hotel.png",
  },
  {
    name: "Grocery Stores",
    tag: "shop=supermarket",
    IconComponent: ShoppingCart, // Store the icon component
    icon: "supermarket",
    iconUrl: "/icons/park.png",
  },
  {
    name: "Parks",
    tag: "leisure=park",
    IconComponent: Hotel, // Store the icon component
    icon: "park",
    iconUrl: parking,
  },
  {
    name: "Fuel Stations",
    tag: "amenity=fuel",
    IconComponent: Fuel, // Store the icon component
    icon: "fuel",
    iconUrl: "/icons/fuel.png",
  },
];

export default categories;
