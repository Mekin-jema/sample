import { 
  FaUtensils, FaHotel, FaShoppingCart, FaGasPump, FaTree, FaHospital, 
  FaUniversity, FaShoppingBag, FaBus, FaDumbbell, FaLandmark, FaBuilding, 
  FaBicycle, FaMosque, FaChurch, FaTheaterMasks, FaBook, FaCocktail, FaCar, 
  FaHome, FaBeer, FaClinicMedical, FaTrain, FaSubway, FaPlane, FaBriefcase 
} from "react-icons/fa";

const categories = [
  {
    name: "Restaurants",
    tag: "amenity=restaurant",
    icon: "restaurant",
    IconComponent: FaUtensils,
    iconUrl: "/icons/restaurant.png",
    bgColor: "#F57F17", // Gold
  },
  {
    name: "Hotels",
    tag: "tourism=hotel",
    icon: "hotel",
    IconComponent: FaHotel,
    iconUrl: "/icons/hotel.png",
    bgColor: "#FF6347", // Tomato
  },
  {
    name: "Supermarkets",
    tag: "shop=supermarket",
    icon: "shopping-cart",
    IconComponent: FaShoppingCart,
    iconUrl: "/icons/supermarket.png",
    bgColor: "#32CD32", // Lime Green
  },
  {
    name: "Parks",
    tag: "leisure=park",
    icon: "park",
    IconComponent: FaTree,
    iconUrl: "/icons/park.png",
    bgColor: "#6D7BE3", // Forest Green
  },
  {
    name: "Fuel Stations",
    tag: "amenity=fuel",
    icon: "gas-station",
    IconComponent: FaGasPump,
    iconUrl: "/icons/gas.png",
    bgColor: "#FF4500", // Orange Red
  },
  {
    name: "Hospitals",
    tag: "amenity=hospital",
    icon: "hospital",
    IconComponent: FaHospital,
    iconUrl: "/icons/hospital.png",
    bgColor: "#DC143C", // Crimson
  },
  {
    name: "Clinics",
    tag: "amenity=clinic",
    icon: "clinic",
    IconComponent: FaClinicMedical,
    iconUrl: "/icons/clinic.png",
    bgColor: "#FF69B4", // Hot Pink
  },
  {
    name: "Universities",
    tag: "amenity=university",
    icon: "university",
    IconComponent: FaUniversity,
    iconUrl: "/icons/university.png",
    bgColor: "#4682B4", // Steel Blue
  },
  {
    name: "Shopping Malls",
    tag: "shop=mall",
    icon: "shopping-mall",
    IconComponent: FaShoppingBag,
    iconUrl: "/icons/shopping-mall.png",
    bgColor: "#9370DB", // Medium Purple
  },
  {
    name: "Bus Stations",
    tag: "public_transport=bus_station",
    icon: "bus",
    IconComponent: FaBus,
    iconUrl: "/icons/bus.png",
    bgColor: "#FFA500", // Orange
  },
  {
    name: "Train Stations",
    tag: "railway=station",
    icon: "train",
    IconComponent: FaTrain,
    iconUrl: "/icons/train.png",
    bgColor: "#8B0000", // Dark Red
  },
  {
    name: "Subways",
    tag: "railway=subway",
    icon: "subway",
    IconComponent: FaSubway,
    iconUrl: "/icons/subway.png",
    bgColor: "#2E8B57", // Sea Green
  },
  {
    name: "Airports",
    tag: "aeroway=aerodrome",
    icon: "airport",
    IconComponent: FaPlane,
    iconUrl: "/icons/airport.png",
    bgColor: "#1E90FF", // Dodger Blue
  },
  {
    name: "Gyms & Fitness Centers",
    tag: "leisure=fitness_centre",
    icon: "gym",
    IconComponent: FaDumbbell,
    iconUrl: "/icons/gym.png",
    bgColor: "#FF1493", // Deep Pink
  },
  {
    name: "Tourist Attractions",
    tag: "tourism=attraction",
    icon: "landmark",
    IconComponent: FaLandmark,
    iconUrl: "/icons/landmark.png",
    bgColor: "#FFD700", // Gold
  },
  {
    name: "Mosques",
    tag: "amenity=place_of_worship&religion=muslim",
    icon: "mosque",
    IconComponent: FaMosque,
    iconUrl: "/icons/mosque.png",
    bgColor: "#008080", // Teal
  },
  {
    name: "Churches",
    tag: "amenity=place_of_worship&religion=christian",
    icon: "church",
    IconComponent: FaChurch,
    iconUrl: "/icons/church.png",
    bgColor: "#800080", // Purple
  },
  {
    name: "Office Buildings",
    tag: "building=office",
    icon: "office",
    IconComponent: FaBuilding,
    iconUrl: "/icons/office.png",
    bgColor: "#708090", // Slate Gray
  },
  {
    name: "Libraries",
    tag: "amenity=library",
    icon: "library",
    IconComponent: FaBook,
    iconUrl: "/icons/library.png",
    bgColor: "#6A5ACD", // Slate Blue
  },
  {
    name: "Cinemas & Theaters",
    tag: "amenity=cinema",
    icon: "cinema",
    IconComponent: FaTheaterMasks,
    iconUrl: "/icons/movie-projector.png",
    bgColor: "#FF4500", // Orange Red
  },
  {
    name: "Bars & Pubs",
    tag: "amenity=bar",
    icon: "bar",
    IconComponent: FaBeer,
    iconUrl: "/icons/beer.png",
    bgColor: "#DAA520", // Goldenrod
  },
  {
    name: "Nightclubs",
    tag: "amenity=nightclub",
    icon: "nightclub",
    IconComponent: FaCocktail,
    iconUrl: "/icons/cocktail.png",
    bgColor: "#FF69B4", // Hot Pink
  },
  {
    name: "Car Rentals",
    tag: "amenity=car_rental",
    icon: "car-rental",
    IconComponent: FaCar,
    iconUrl: "/icons/car-rental.png",
    bgColor: "#4682B4", // Steel Blue
  },
  {
    name: "Residential Areas",
    tag: "landuse=residential",
    icon: "home",
    IconComponent: FaHome,
    iconUrl: "/icons/home.png",
    bgColor: "#2E8B57", // Sea Green
  },
  {
    name: "Business Centers",
    tag: "office=company",
    icon: "briefcase",
    IconComponent: FaBriefcase,
    iconUrl: "/icons/briefcase.png",
    bgColor: "#708090", // Slate Gray
  },
];

export default categories;
