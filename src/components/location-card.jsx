import { Star, MapPin, Bookmark, Share2, Phone, Info, Globe, Clock } from "lucide-react";

export default function LocationCard() {
  return (
    <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      <img
        src="/icons/megenagna.jpg"
        alt="Megenagna"
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h2 className="text-xl font-semibold">Megenagna</h2>
        <div className="flex items-center mt-1">
          <div className="flex text-yellow-500">
            {[...Array(3)].map((_, i) => (
              <Star key={i} size={16} fill="currentColor" />
            ))}
            <Star size={16} strokeWidth={1} className="text-gray-400" />
          </div>
          <span className="text-gray-600 text-sm ml-2">(53 reviews)</span>
        </div>
        <div className="flex justify-between mt-3 text-blue-500">
          <div className="flex flex-col items-center cursor-pointer">
            <MapPin size={24} />
            <span className="text-sm">Directions</span>
          </div>
          <div className="flex flex-col items-center cursor-pointer">
            <Bookmark size={24} />
            <span className="text-sm">Save</span>
          </div>
          <div className="flex flex-col items-center cursor-pointer">
            <Share2 size={24} />
            <span className="text-sm">Share</span>
          </div>
        </div>
        <div className="mt-4 text-gray-700">
          <p>
            <strong>Address:</strong> Megenagna, Megenagna Building, Addis Ababa
          </p>
          <p>
            <strong>Plus Code:</strong> 2RC2+5X Addis Ababa
          </p>
          <p className="flex items-center mt-2 text-blue-500 cursor-pointer">
            <Phone size={18} className="mr-2" /> Call Now
          </p>
        </div>
        <div className="mt-4 border-t pt-3 text-gray-700">
          <h3 className="text-lg font-semibold">Additional Information</h3>
          <div className="flex items-center mt-2">
            <Info size={18} className="text-blue-500 mr-2" />
            <p>General Info</p>
          </div>
          <div className="flex items-center mt-2">
            <Phone size={18} className="text-blue-500 mr-2" />
            <p>Call Support</p>
          </div>
          <div className="flex items-center mt-2">
            <Globe size={18} className="text-blue-500 mr-2" />
            <p>Website</p>
          </div>
          <div className="flex items-center mt-2">
            <Clock size={18} className="text-blue-500 mr-2" />
            <p>Business Hours</p>
          </div>
        </div>
      </div>
    </div>
  );
}