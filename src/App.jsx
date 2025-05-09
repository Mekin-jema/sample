// Main App Entry: Sets up routes using React Router v6's createBrowserRouter
// This includes authentication pages, dashboard subpages, and a 404 redirect.

import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";

// Dashboard pages
import { Board, Map } from "./pages/dashboard";
import AnalyticsLogs from "./pages/dashboard/analytic-logs/analytics-logs";
import Documentation from "./pages/dashboard/support-docs/support-docs";
import BillingSubscription from "./pages/dashboard/billing-subscription/billing-subscription";
import DashboardMainPage from "./pages/dashboard/amba-dashboard";
import NavigationInput from "./pages/dashboard/geo-coding/geocoding";

// Team management
import Users, {
  loader as usersLoader,
} from "./pages/dashboard/team-management/users";
import { loader as UpdateLoader } from "./pages/dashboard/team-management/update/update";
import { loader as DeleteLoader } from "./pages/dashboard/team-management/delete/delete-user";
import UserAdd from "./pages/dashboard/team-management/add/add-team";
import UserInvite from "./pages/dashboard/team-management/invite/invite";
import UserDelete from "./pages/dashboard/team-management/delete/delete-user";

// API clients
import ClientsPage, {
  Loader as ClientLoader,
} from "./pages/dashboard/api-key/api-client";
import ClientAdd from "./pages/dashboard/api-key/add/add-api";

// Auth pages
import ForgotPassword from "./pages/auth/forgot-password/route";
import SignIn from "./pages/auth/sign-in/route";
import SignUp from "./pages/auth/sign-up/route";
import Otp from "./pages/auth/otp/route";

// Error page
import NotFoundError from "./pages/error/404";
import UserUpdate from "./pages/dashboard/team-management/update/update";
import Home from "./pages";

const router = createBrowserRouter([
  { path: "/404", element: <NotFoundError /> },
  { path: "/", element: <Home /> },
  {
    path: "/dashboard",
    element: <DashboardMainPage />,
    children: [
      { index: true, element: <Board /> },
      {
        path: "api-keys",
        element: <ClientsPage />,
        loader: ClientLoader,
        children: [
          { path: "invite", element: <UserInvite /> },
          { path: "add", element: <ClientAdd /> },
          { path: "delete", element: <UserDelete /> },
        ],
      },
      { path: "support-docs", element: <Documentation /> },
      { path: "analytics-logs", element: <AnalyticsLogs /> },
      { path: "map", element: <Map /> },
      { path: "billing-subscription", element: <BillingSubscription /> },
      { path: "geocoding", element: <NavigationInput /> },
      {
        path: "users",
        element: <Users />,
        loader: usersLoader,
        children: [
          { path: "invite", element: <UserInvite /> },
          { path: "add", element: <UserAdd /> },
          {
            path: ":user/delete",
            element: <UserDelete />,
            loader: DeleteLoader,
            errorElement: <NotFoundError />,
          },
          {
            path: ":user/update",
            element: <UserUpdate />,
            loader: UpdateLoader,
            errorElement: <NotFoundError />,
          },
        ],
      },
    ],
  },
  { path: "/signin", element: <SignIn /> },
  { path: "/otp", element: <Otp /> },
  { path: "/signup", element: <SignUp /> },
  { path: "/forgot-password", element: <ForgotPassword /> },
  { path: "*", element: <Navigate to="/404" replace /> },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
