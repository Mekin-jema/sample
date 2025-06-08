function setupPersistCleanupOnBrowserClose() {
  const LAST_OPEN_KEY = "last_opened_timestamp";
  const PERSIST_KEY = "persist:root";
  const SESSION_TIMEOUT_MINUTES = 2; // Consider session dead if inactive for 2+ minutes

  const now = Date.now();
  const lastOpen = parseInt(localStorage.getItem(LAST_OPEN_KEY), 10);

  const minutesSinceLastOpen = (now - lastOpen) / 1000 / 60;

  // If this is the first visit or session was inactive for too long → clear
  if (!lastOpen || minutesSinceLastOpen > SESSION_TIMEOUT_MINUTES) {
    localStorage.removeItem(PERSIST_KEY);
    console.log(
      "Cleared Redux store due to browser/tab being closed too long."
    );
  }

  // Always update last opened timestamp on load
  localStorage.setItem(LAST_OPEN_KEY, now.toString());

  // On tab/browser close or refresh, update timestamp
  window.addEventListener("beforeunload", () => {
    localStorage.setItem(LAST_OPEN_KEY, Date.now().toString());
  });
}

export default setupPersistCleanupOnBrowserClose;
