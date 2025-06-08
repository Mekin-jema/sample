// utils/clearPersistOnClose.js
function setupPersistCleanupOnBrowserClose() {
  const LAST_OPEN_KEY = "last_opened";
  const PERSIST_KEY = "persist:root";
  const EXPIRY_MINUTES = 3; // Consider browser closed if not reopened within 3 mins

  const now = Date.now();
  const lastOpen = parseInt(localStorage.getItem(LAST_OPEN_KEY), 10);

  // If lastOpen is old or not set → assume browser was closed
  const minutesSinceLastOpen = (now - lastOpen) / 1000 / 60;
  if (!lastOpen || minutesSinceLastOpen > EXPIRY_MINUTES) {
    localStorage.removeItem(PERSIST_KEY);
    console.log("Browser was closed. Redux state cleared.");
  }

  // On page load, update timestamp
  localStorage.setItem(LAST_OPEN_KEY, now.toString());

  // Also update timestamp before unload (for tab switches/refresh)
  window.addEventListener("beforeunload", () => {
    localStorage.setItem(LAST_OPEN_KEY, Date.now().toString());
  });
}

export default setupPersistCleanupOnBrowserClose;
