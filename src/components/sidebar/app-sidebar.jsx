import { NavMain } from "@/components/sidebar/main-sidebar";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavUser } from "../navbar/nav-user";
import { sidebarData } from "../../data/sidebar-data";
import logo from "../../assets/Logo123.png";
import { useSidebar } from "@/components/ui/sidebar"; // Ensure this path is correct

export function AppSidebar({ ...props }) {
  const { state } = useSidebar(); // Get sidebar state (expanded or collapsed)

  return (
    <Sidebar collapsible="icon" {...props}  className="dark:bg-[#021815] bg-[#16423C] text-white rounded-[20px] ml-[19px] mt-[12px] mr-[23px] w-[223px] ">
      {/* Conditionally render logo only when sidebar is expanded */}
      {state !== "collapsed" ? (
        <div className="flex justify-center items-center">
          <img src={logo} alt="logo image" className="mt-2 w-[98.3px] h-[55.05px]" />
        </div>
      ):(
        <span className="h-[86px]">

        </span>
      )}

      <SidebarContent>
        <NavMain items={sidebarData.navMain[0].items} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={sidebarData.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
