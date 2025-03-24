// import { AmbaBoard } from "./components";
import { Navigate, Route, Routes, BrowserRouter } from "react-router-dom";
import { AccountSettings, ApiClients, Board, Map } from "./pages";
import AnalyticsLogs from "./pages/sidebar/analytics-logs";
import Geocoding from "./pages/sidebar/geocoding";
import RouteOptimization from "./pages/sidebar/route-optimization";
import MatrixApi from "./pages/sidebar/matrix-api";
import TeamManagement from "./pages/sidebar/team-management";
import Documentation from "./pages/sidebar/support-docs";
import DirectionsApi from "./pages/sidebar/directions-api";
import BillingSubscription from "./pages/sidebar/billing-subscription";
import DashboardMainPage from "./pages/amba-dashboard";
import NavigationInput from "./pages/sidebar/geocoding";
import LocationCard from "./components/location-card";

const App = () => {
  return (
    <>
      {/* <AmbaBoard /> */}
      <BrowserRouter>
        <Routes>
          <Route path="/map" element={<Map />} />
          <Route path="/locate" element={<LocationCard/>} />

          {/* <Route path="/map" element={<Map />} /> */}
          <Route path="/dashboard" element={<DashboardMainPage />}>
            {/* Default route */}
            <Route index element={<Board />} />
            <Route path="api-keys" element={<ApiClients />} />
            <Route path="account-settings" element={<AccountSettings />} />
            <Route path="support-docs" element={<Documentation />} />
            <Route path="analytics-logs" element={<AnalyticsLogs />} />
            <Route path="map" element={<Map />} />
            <Route
              path="billing-subscription"
              element={<BillingSubscription />}
            />
            <Route path="geocoding" element={<NavigationInput />} />
            <Route path="route-optimization" element={<RouteOptimization />} />
            <Route path="directions-api" element={<DirectionsApi />} />
            <Route path="matrix-api" element={<MatrixApi />} />
            <Route path="team-management" element={<TeamManagement />} />
          </Route>

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
