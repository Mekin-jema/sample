// import { Tooltip } from "@mui/material";
import { RecentAPIRequestsTable } from "@/components/dashboard/recent-api-request-table";
import { UsageStatistics } from "@/components/dashboard/usage-statistics";
import Billing from "@/components/dashboard/total-api-request";
import { NavUser } from "@/components/navbar/header-user";
import { Search } from "@/components/navbar/search";
import { DarkModeToggle } from "@/components/navbar/toggle-theme";
import { Header } from "@/components/navbar/main-header";


const Board = () => {
  return (
    <div className="rounded-lg shadow-md p-2 ml-3 ">

      <Header>
        {/* <TopNav links={topNav} /> */}
        <div className="ml-auto flex items-center space-x-4">
          <Search />
          <DarkModeToggle />
          <NavUser />
        </div>
      </Header>
      <Billing />

      {/* Subscription Plan Section */}
      <div className="">
        <h2 className="text-xl font-bold mb-4">Subscription Plan</h2>
        <div className="p-6 rounded-lg shadow-md dark:border dark:border-gray-200">
          <p className="text-lg">
            Current Plan: <span className="font-bold">Pro</span>
          </p>
          <p className="text-lg">
            Renewal Date: <span className="font-bold">2023-11-01</span>
          </p>
          <button className="mt-4 px-4 py-2 bg-[#00432f] text-white rounded-lg">
            Upgrade/Downgrade Plan
          </button>
        </div>
      </div>

      {/* Usage Statistics Section */}
      {/* <UsageStatistics /> */}

      {/* Recent API Requests Section */}
      <RecentAPIRequestsTable />
    </div>
  );
};

export default Board;
