import setupPersistCleanupOnBrowserClose from "./Redux/clear-persist-onClose";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
setupPersistCleanupOnBrowserClose()
import { persistor, store } from "./Redux/Store.js";
import { PersistGate } from "redux-persist/integration/react";
import { ThemeProvider } from "@/pages/dashboard/theme-provider";
// import MapComponent from "./pages/demo";


createRoot(document.getElementById("root")).render(
  // <StrictMode>
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <ThemeProvider storageKey="vite-ui-theme">
        <App />
        {/* <MapComponent/> */}
      </ThemeProvider>
    </PersistGate>
  </Provider>
  // </StrictMode>
);


