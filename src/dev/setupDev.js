// Dev helper: set test user and points in localStorage
try {
  const username = localStorage.getItem("username");
  if (!username) {
    localStorage.setItem("username", "devtest");
  }
  const userId = localStorage.getItem("userId");
  if (!userId) {
    localStorage.setItem("userId", "1");
  }

  localStorage.setItem("points", "100000");
  window.dispatchEvent(
    new CustomEvent("pointsUpdated", { detail: { points: 100000 } }),
  );
  window.dispatchEvent(new Event("loginStatusChanged"));
   
  console.log("[setupDev] test user/dev points set (100,000P)");
} catch (e) {
  // ignore in non-browser environments
}
