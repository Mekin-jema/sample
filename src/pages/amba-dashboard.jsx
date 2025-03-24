import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { DarkModeToggle } from "@/components/navbar/toggle-theme";
import { NavUser } from "@/components/navbar/header-user";
import { Header } from "@/components/navbar/main-header";
import { Search } from "@/components/navbar/search";
import { TopNav } from "@/components/navbar/top-nav";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { SearchProvider } from "@/context/search-context";
import { Outlet, useLocation } from "react-router-dom";

const topNav = [
  {
    title: "Overview",
    href: "/",
    disabled: false,
  },
  {
    title: "Customers",
    href: "/customers",
    disabled: true,
  },
  {
    title: "Products",
    href: "/products",
    disabled: true,
  },
  {
    title: "Settings",
    href: "/settings",
    disabled: true,
  },
];

export default function DashboardMainPage() {
  return (
    <SearchProvider className>
      <SidebarProvider className="dark:bg-[#16423C] p-3  ">
        <AppSidebar  />
        <SidebarInset className="ml-3  ">
          {/* <Header /> */}
     
          {/* <newHeader /> */}
          <div className=" dark:bg-[#021815] rounded-xl">

          <Outlet />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </SearchProvider>
  );
}
