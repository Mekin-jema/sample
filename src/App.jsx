
// import { AmbaBoard } from "./components";
import { Navigate, Route, Routes, BrowserRouter } from "react-router-dom";
import { AccountSettings, ApiClients, Board, Map } from "./pages/dashboard";
import AnalyticsLogs from "./pages/dashboard/analytic-logs/analytics-logs";
import Documentation from "./pages/dashboard/support-docs/support-docs";
import BillingSubscription from "./pages/dashboard/billing-subscription/billing-subscription";
import DashboardMainPage from "./pages/dashboard/amba-dashboard";
import NavigationInput from "./pages/dashboard/geo-coding/geocoding";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Users, { loader as usersLoader } from "./pages/dashboard/team-managment/layout/users";
import NotFoundError from "./pages/error/404";
import UserAdd from "./pages/dashboard/team-managment/add/route";
import UserInvite from "./pages/dashboard/team-managment/invite/route";
import ForgotPassword from "./pages/auth/forgot-password/route";
import SignIn from "./pages/auth/sign-in/route";
import SignUp from "./pages/auth/sign-up/route";
import Otp from "./pages/auth/otp/route";

const router = createBrowserRouter([


  { path: "/404", element: <NotFoundError /> },

  {
    path: "/dashboard",
    element: <DashboardMainPage />,
    children: [
      { index: true, element: <Board /> },
      { path: "api-keys", element: <ApiClients /> },
      { path: "account-settings", element: <AccountSettings /> },
      { path: "support-docs", element: <Documentation /> },
      { path: "analytics-logs", element: <AnalyticsLogs /> },
      { path: "map", element: <Map /> },
      , {
        path: "billing-subscription"
        , element: <BillingSubscription />
      },
      { path: "geocoding", element: <NavigationInput /> },
      { path: "invite", element: <UserInvite /> },
      { path: "add", element: <UserAdd /> },
      {
        path: "users",
        element: <Users />,
        loader: usersLoader,

      }
      // ... other nested routes
    ],
  },
  {
    path: "/signin",
    element: <SignIn />
  },
  {
    path: "/otp",
    element: <Otp />
  },
  {
    path: "/signup",
    element: <SignUp />
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />
  },

  {
    path: "*", element: <Navigate to="/404" replace />,
  },

]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;