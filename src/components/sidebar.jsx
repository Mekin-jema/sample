import { images } from "../constants/images";
import "primeicons/primeicons.css";
import { useDispatch, useSelector } from "react-redux";
import { setOpen } from "../Redux/MapSlice";
import { NavLink } from "react-router-dom";

// Sidebar item component
const SidebarItem = ({ icon, label, to, open }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `cursor-pointer flex items-center gap-4 px-5 py-3 rounded-lg transition-all duration-200 ${
        isActive ? "bg-[#D19EDB]" : "hover:bg-[#e2b1ec]"
      } ${open ? "w-full h-[44px]" : "w-[64px] h-[44px]"}`
    }
  >
    <img className="w-6 h-6" src={icon} alt={label} />
    {open && <div className="text-white text-lg font-normal">{label}</div>}
  </NavLink>
);

const Sidebar = () => {
  const { open } = useSelector((state) => state.map);
  const dispatch = useDispatch();

  const sidebarItems = [
    { icon: images.grid, label: "Dashboard", to: "/dashboard" },
    { icon: images.map, label: "Map", to: "/map" },
    { icon: images.unlock, label: "API Keys", to: "/api-clients" },
    {
      icon: images.sliders,
      label: "Account Settings",
      to: "/account-settings",
    },
    { icon: images.sidebar, label: "Billing", to: "/billing" },
    { icon: images.gift, label: "Premium", to: "/premium" },
  ];

  return (
    <div className="flex h-full w-full">
      <div
        className={`bg-[#00432F] flex flex-col justify-between ${
          open ? "w-full" : "w-[106px]"
        }`}
      >
        <div className="flex flex-col items-center gap-10 pt-[15px] px-[25px]">
          {/* Logo & Toggle */}
          <div className="flex items-center justify-between w-full">
            <img
              className={
                open ? "w-[200px] h-[100px] flex-1 m-1" : "w-[70px] h-[38.95px]"
              }
              src={images.logo1}
              alt="Amba"
            />
            <i
              className={`pi ${
                open ? "pi-chevron-left" : "pi-chevron-right"
              } cursor-pointer text-white`}
              onClick={() => dispatch(setOpen(!open))}
            ></i>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col gap-[15px] w-full">
            {sidebarItems.map((item, index) => (
              <SidebarItem
                key={index}
                icon={item.icon}
                label={item.label}
                to={item.to}
                open={open}
              />
            ))}
          </div>
        </div>

        {/* Profile Section */}
        <div
          className={`flex items-center gap-4 ${
            open ? "px-[46px] mb-[21px]" : "p-6"
          }`}
        >
          <img
            className="w-[50px] h-[50px] object-cover"
            src={images.download}
            alt="Profile"
          />
          {open && (
            <div>
              <div className="text-white text-lg">John Doe</div>
              <div className="text-white text-sm">+251912345678</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
