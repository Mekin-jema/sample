import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { setWaypoints } from "../Redux/MapSlice";
import AddressInput from "../components/Input";
import RenderDirectionDetail from "./drectionDetail";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";
import { Car, Bus, MapPin, X, Bike, Plus } from "lucide-react";
import { MdDirections, MdDirectionsCarFilled, MdDirectionsTransitFilled, MdDirectionsWalk, MdOutlineAirplanemodeActive } from "react-icons/md";

const AddressBox = ({ route, setToggleGeocoding }) => {
  const dispatch = useDispatch();
  const { waypoints } = useSelector((state) => state.map);
  const controls = useAnimation();

  useEffect(() => {
    // Start with the infinite pulse animation
    controls.start({
      scale: [1, 1.02, 1],
      opacity: [0.8, 1, 0.8],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }
    });

    // After 2 seconds, transition to the final state
    const timer = setTimeout(() => {
      controls.start({
        scale: 1,
        opacity: 1,
        transition: {
          duration: 0.5,
          ease: "easeOut"
        }
      });
    }, 2000);

    return () => clearTimeout(timer);
  }, [controls]);

  // Add a new waypoint
  const addWaypoint = () => {
    const lastWaypoint = waypoints[waypoints.length - 1];
    if (!lastWaypoint.placeName || lastWaypoint.longitude === null || lastWaypoint.latitude === null) {
      toast.error("Please complete the previous waypoint before adding a new one.", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }
    dispatch(setWaypoints([...waypoints, { placeName: "", longitude: null, latitude: null }]));
  };

  // Update a specific waypoint
  const updateWaypoint = (index, address) => {
    const updatedWaypoints = [...waypoints];
    updatedWaypoints[index] = address;
    dispatch(setWaypoints(updatedWaypoints));
  };

  return (
    <Card className="fixed p-0 left-0 top-0 z-40 w-[408px] h-screen rounded-[5px] dark:bg-[#16413B] dark:text-white bg-white text-black overflow-hidden">
      <motion.div
        initial={{ x: -500, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -500, opacity: 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <motion.div
          animate={controls}
          className="h-full"
        >
          <CardContent className="p-0">
            <div className="flex items-center justify-between p-2 w-full ">

            <div className="flex items-center p-2 w-full gap-2 ml-[5px] h-full">
              <Button variant="ghost" className="p-3 hover:bg-gray-200 dark:hover:bg-gray-700">
                <MdDirections size={1000} />
              </Button>
              <Button variant="ghost" className="p-3 hover:bg-gray-200 dark:hover:bg-gray-700">
                <MdDirectionsCarFilled width={10} height={10} />
              </Button>
              <Button variant="ghost" className="p-3 hover:bg-gray-200 dark:hover:bg-gray-700">
                <MdDirectionsTransitFilled className="text-2xl" />
              </Button>
              <Button variant="ghost" className="p-3 hover:bg-gray-200 dark:hover:bg-gray-700">
                <MdDirectionsWalk className="text-2xl" />
              </Button>
              <Button variant="ghost" className="p-3 hover:bg-gray-200 dark:hover:bg-gray-700">
                <Bike className="text-2xl" />
              </Button>
              <Button variant="ghost" className="p-3 hover:bg-gray-200 dark:hover:bg-gray-700">
                <MdOutlineAirplanemodeActive className="text-3xl" />
              </Button>

          
            </div>
            <Button variant="ghost" onClick={() => setToggleGeocoding(false)} className="hover:bg-gray-200 dark:hover:bg-gray-700">
                <X className="text-2xl" />
              </Button>
            </div>
            {waypoints.map((waypoint, index) => (
              <motion.div 
                key={index} 
                className="flex items-center gap-2 w-full"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.5 }}
              >
                <AddressInput
                  location={waypoint.placeName}
                  index={index}
                  waypoint={waypoint}
                  setAddress={(address) => updateWaypoint(index, address)}
                  placeholder={index === 0 ? "Starting Address" : `Destination Address ${index}`}
                  className="w-full p-0 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </motion.div>
            ))}

            {waypoints.length >= 2 && waypoints[1].longitude !== null && waypoints[0].latitude !== null && (
              <motion.div 
                className="flex items-center gap-3 ml-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: waypoints.length * 0.1 + 0.5 }}
              >
                <Button
                  variant="outline"
                  className="rounded-full border-2 p-2 flex items-center justify-center"
                  onClick={addWaypoint}
                >
                  <Plus className="text-xl" />
                </Button>
                <span className="text-lg ml-6">Add destination</span>
              </motion.div>
            )}
          </CardContent>

          <CardFooter className="p-0 w-full">
            <div className="w-full">
              <RenderDirectionDetail route={route} />
            </div>
          </CardFooter>
        </motion.div>
      </motion.div>
    </Card>
  );
};

export default AddressBox;