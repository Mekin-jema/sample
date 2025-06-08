// utils/clearPersistOnClose.js
function setupPersistCleanupOnBrowserClose() {
  const SESSION_FLAG_KEY = "app_session_active";

  // Mark session as active on load
  localStorage.setItem(SESSION_FLAG_KEY, "true");

  // When browser/tab is closed (not refreshed), remove persisted data
  window.addEventListener("unload", () => {
    // Remove session flag after short delay (indicates browser closed)
    navigator.sendBeacon("/cleanup-session");
    localStorage.removeItem(SESSION_FLAG_KEY);
    localStorage.removeItem("persist:root"); // Remove redux-persist storage
  });

  // On refresh: re-set the session flag (keeps data alive)
  window.addEventListener("load", () => {
    localStorage.setItem(SESSION_FLAG_KEY, "true");
  });
}

export default setupPersistCleanupOnBrowserClose;
