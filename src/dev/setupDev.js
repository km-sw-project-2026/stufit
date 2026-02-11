// Dev helper: set test user and points in localStorage
try {
  const username = localStorage.getItem('username');
  if (!username) {
    localStorage.setItem('username', 'devtest');
  }
  const userId = localStorage.getItem('userId');
  if (!userId) {
    localStorage.setItem('userId', '1');
  }

  localStorage.setItem('points', '1000000');
  window.dispatchEvent(new CustomEvent('pointsUpdated', { detail: { points: 1000000 } }));
  window.dispatchEvent(new Event('loginStatusChanged'));
  // eslint-disable-next-line no-console
  console.log('[setupDev] test user/dev points set (1,000,000P)');
} catch (e) {
  // ignore in non-browser environments
}
