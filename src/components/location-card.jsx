import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import {
  Star,
  MapPin,
  Bookmark,
  Share2,
  Phone,
  Info,
  Globe,
  Clock,
   LocateIcon, ShieldCheck, History, Tag, 
   Route, Smartphone, 
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
const actions = [
  { label: "Directions", icon: <Route className="w-5 h-5" />, active: true },
  { label: "Save", icon: <Bookmark className="w-5 h-5" /> },
  { label: "Nearby", icon: <LocateIcon className="w-5 h-5" /> },
  { label: "Send to phone", icon: <Smartphone className="w-5 h-5" /> },
  { label: "Share", icon: <Share2 className="w-5 h-5" /> },
];

export default function LocationCard() {
  return (
    <Card className="max-w-md mx-auto shadow-xl rounded-2xl overflow-hidden">
      <CardHeader className="p-0">
        <img
          src="/icons/megenagna.jpg"
          alt="Megenagna"
          className="w-full h-48 object-cover"
        />
      </CardHeader>

      <CardContent className="p-5">

        <CardTitle className="text-xl font-semibold">Megenagna</CardTitle>

        {/* Ratings */}
        <div className="flex items-center mt-2">
          <div className="flex text-yellow-500">
            {[...Array(3)].map((_, i) => (
              <Star key={i} size={16} fill="currentColor" />
            ))}
            <Star size={16} strokeWidth={1} className="text-gray-400" />
          </div>
          <span className="text-gray-600 text-sm ml-2">(53 reviews)</span>
        </div>

        {/* Actions */}
        <Tabs defaultValue="overview" className="w-full max-w-lg mx-auto mt-10">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="reviews">Reviews</TabsTrigger>
        <TabsTrigger value="contact">Contact</TabsTrigger>
      </TabsList>

      {/* Updated Overview Tab Content */}
      <TabsContent value="overview" className="p-4 border rounded-lg shadow">
      <div className="flex justify-between items-center border rounded-lg p-4 max-w-3xl mx-auto bg-white shadow-sm">
      {actions.map((action, index) => (
        <div key={index} className="flex flex-col items-center space-y-1 cursor-pointer">
          <div
            className={`w-12 h-12 flex items-center justify-center rounded-full border ${
              action.active ? "bg-blue-600 text-white border-blue-600" : "text-blue-600 border-blue-600"
            }`}
          >
            {action.icon}
          </div>
          <span className={`text-sm ${action.active ? "text-blue-600 font-semibold" : "text-blue-600"}`}>
            {action.label}
          </span>
        </div>
      ))}
    </div>
        <h2 className="text-xl font-semibold mb-4">Location Details</h2>

        <div className="flex items-center space-x-2 mb-2 text-gray-700">
          <MapPin size={18} /> 
          <span>Megenagna, Megenagna Building, Addis Ababa</span>
        </div>
        <div className="flex items-center space-x-2 mb-2 text-gray-700">
          <LocateIcon size={18} /> 
          <span>2RC2+5X Addis Ababa</span>
        </div>
        <div className="flex items-center space-x-2 mb-2 text-blue-600 cursor-pointer">
          <ShieldCheck size={18} /> 
          <span>Claim this business</span>
        </div>
        <div className="flex items-center space-x-2 mb-2 text-blue-600 cursor-pointer">
          <History size={18} /> 
          <span>Your Maps activity</span>
        </div>
        <div className="flex items-center space-x-2 mb-4 text-blue-600 cursor-pointer">
          <Tag size={18} /> 
          <span>Add a label</span>
        </div>

        <button className="border px-4 py-2 rounded-lg text-blue-600 hover:bg-gray-100">
          Suggest an edit
        </button>

        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Add Missing Information</h3>
          <div className="flex items-center space-x-2 mb-2 text-blue-600 cursor-pointer">
            <Phone size={18} /> 
            <span>Add place's phone number</span>
          </div>
          <div className="flex items-center space-x-2 mb-2 text-blue-600 cursor-pointer">
            <Clock size={18} /> 
            <span>Add hours</span>
          </div>
          <div className="flex items-center space-x-2 text-blue-600 cursor-pointer">
            <Globe size={18} /> 
            <span>Add website</span>
          </div>
        </div>
      </TabsContent>

      {/* Example Reviews Tab */}
      <TabsContent value="reviews" className="p-4 border rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-2">User Reviews</h2>
        <p>⭐⭐⭐⭐☆ (4.2/5)</p>
        <p>53 reviews from visitors sharing their experiences.</p>
      </TabsContent>

      {/* Example Contact Tab */}
      <TabsContent value="contact" className="p-4 border rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-2">Contact Info</h2>
        <p>📞 +251 912 345 678</p>
        <p>🌐 www.megenagna.com</p>
      </TabsContent>
    </Tabs>
        <div className="flex justify-between mt-4 text-blue-500">
          <div className="flex flex-col items-center cursor-pointer hover:text-blue-700">
            <MapPin size={24} />
            <span className="text-sm">Directions</span>
          </div>
          <div className="flex flex-col items-center cursor-pointer hover:text-blue-700">
            <Bookmark size={24} />
            <span className="text-sm">Save</span>
          </div>
          <div className="flex flex-col items-center cursor-pointer hover:text-blue-700">
            <Share2 size={24} />
            <span className="text-sm">Share</span>
          </div>
        </div>

        {/* Address & Contact */}
        <div className="mt-5 text-gray-700 space-y-2">
          <p>
            <strong>Address:</strong> Megenagna, Megenagna Building, Addis Ababa
          </p>
          <p>
            <strong>Plus Code:</strong> 2RC2+5X Addis Ababa
          </p>
          <Button
            variant="outline"
            className="flex items-center gap-2 text-blue-500 mt-2 w-fit"
          >
            <Phone size={18} /> Call Now
          </Button>
        </div>

        {/* Separator */}
        <Separator className="my-5" />

        {/* Additional Info */}
        <div className="text-gray-700 space-y-3">
          <h3 className="text-lg font-semibold">Additional Information</h3>
          <div className="flex items-center gap-3">
            <Info size={18} className="text-blue-500" />
            <p>General Info</p>
          </div>
          <div className="flex items-center gap-3">
            <Phone size={18} className="text-blue-500" />
            <p>Call Support</p>
          </div>
          <div className="flex items-center gap-3">
            <Globe size={18} className="text-blue-500" />
            <p>Website</p>
          </div>
          <div className="flex items-center gap-3">
            <Clock size={18} className="text-blue-500" />
            <p>Business Hours</p>
          </div>
        </div>
      </CardContent>

      {/* Optional Footer */}
      <CardFooter></CardFooter>
    </Card>
  );
}
