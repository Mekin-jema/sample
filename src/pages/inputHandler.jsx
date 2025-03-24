import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { setWaypoints, setOpen } from "../Redux/MapSlice";
import AddressInput from "../components/Input";
import RenderDirectionDetail from "./drectionDetail";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Car, Plane, Plus, X, Bike, Train, Bus, Navigation, } from "lucide-react"; // Lucide icons

const AddressBox = ({ route, map, setToggleGeocoding }) => {
  const dispatch = useDispatch();
  const { waypoints } = useSelector((state) => state.map);

  // Add a new waypoint
  const addWaypoint = () => {
    const lastWaypoint = waypoints[waypoints.length - 1];
    if (
      !lastWaypoint.placeName ||
      lastWaypoint.longitude === null ||
      lastWaypoint.latitude === null
    ) {
      toast.error(
        "Please complete the previous waypoint before adding a new one.",
        {
          position: "top-center",
          autoClose: 3000,
        }
      );
      return;
    }
    dispatch(
      setWaypoints([
        ...waypoints,
        { placeName: "", longitude: null, latitude: null },
      ])
    );
  };

  // Update a specific waypoint
  const updateWaypoint = (index, address) => {
    const updatedWaypoints = [...waypoints];
    updatedWaypoints[index] = address;
    dispatch(setWaypoints(updatedWaypoints));
  };

  return (
    <Card className="absolute p-0 left-0 top-0 z-40 w-[408px] h-full rounded-none dark:text-white text-black  dark:bg-[#020817] bg-white">
      <CardContent className="p-0 dark:text-white text-black  dark:bg-[#020817] bg-white">
        {/* Render each waypoint */}
        <div className="flex items-center p-2 w-full gap-6 ml-[54px] dark:">
          {/* Car Icon */}
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-gray-200 dark:hover:bg-gray-700 "
          >
            <Car className="h-12 w-12" /> {/* Lucide Car Icon */}
          </Button>

          {/* Bus Icon */}
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            <Bus className="h-12 w-12" /> {/* Lucide Bus Icon */}
          </Button>

          {/* Bicycle Icon */}
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            <Bike className="h-12 w-12" /> {/* Lucide Bike Icon */}
          </Button>

          {/* Walking Icon */}
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-gray-200 dark:hover:bg-gray-700 "
          >
            <Bike className="h-12 w-12" /> {/* Lucide Walk Icon */}
          </Button>

          {/* Navigation Icon */}
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            <Navigation className="h-12 w-12" /> {/* Lucide Navigation Icon */}
          </Button>

          {/* Close Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setToggleGeocoding(false)}
            className="hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            <X className="h-12 w-12" /> {/* Lucide X Icon */}
          </Button>
        </div>

        {/* Waypoints List */}
        {waypoints.map((waypoint, index) => (
          <div key={index} className="flex items-center gap-2 w-full">
            {/* Address input field */}
            <AddressInput
              location={waypoint.placeName}
              index={index}
              waypoint={waypoint}
              setAddress={(address) => updateWaypoint(index, address)}
              placeholder={
                index === 0
                  ? "Starting Address"
                  : `Destination Address ${index}`
              }
              className="w-full  p-0 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        ))}

        {/* Add destination button */}
        {waypoints.length >= 2 &&
          waypoints[1].longitude !== null &&
          waypoints[0].latitude !== null && (
            <div className="flex items-center gap-3 mt-4 ml-8">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full p-2 border-2  w-3 h-3"
                onClick={addWaypoint}
              >
                <Plus className="h-3 w-3" /> {/* Lucide Plus Icon */}
              </Button>
              <span className="text-lg ml-6">Add destination</span>
            </div>
          )}
      </CardContent>

      {/* Direction details section */}
      <CardFooter className="p-0 w-full">
        <div className="w-full ">
          <RenderDirectionDetail route={route} />
        </div>
      </CardFooter>
    </Card>
  );
};

export default AddressBox;
