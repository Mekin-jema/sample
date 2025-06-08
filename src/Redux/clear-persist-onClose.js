const SESSION_TIMESTAMP_KEY = "app_last_opened";
const PERSIST_KEY = "persist:root";
const SESSION_EXPIRY_MINUTES = 5; // Session expires after 5 minutes of inactivity

export default function setupPersistCleanupOnBrowserClose() {
  const now = Date.now();
  const lastOpened = parseInt(localStorage.getItem(SESSION_TIMESTAMP_KEY), 10);

  if (lastOpened && (now - lastOpened) / (1000 * 60) > SESSION_EXPIRY_MINUTES) {
    localStorage.removeItem(PERSIST_KEY); // Clear persisted Redux store
    console.log("Redux store cleared due to browser session expiration.");
  }

  // Update timestamp on load
  localStorage.setItem(SESSION_TIMESTAMP_KEY, now.toString());

  // Optionally update again before unload
  window.addEventListener("beforeunload", () => {
    localStorage.setItem(SESSION_TIMESTAMP_KEY, Date.now().toString());
  });
}
