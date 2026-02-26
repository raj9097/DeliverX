export const SHIPMENTS = [];
export const DRIVERS = [];
export const MONTHLY_STATS = [];
export const REVENUE_DATA = [];
export const NOTIFICATIONS = [];

export const initializeData = async () => {
  try {
    const [s, d, m, r, n] = await Promise.all([
      fetch('http://localhost:5000/api/shipments').then(res => res.json()),
      fetch('http://localhost:5000/api/drivers').then(res => res.json()),
      fetch('http://localhost:5000/api/stats/monthly').then(res => res.json()),
      fetch('http://localhost:5000/api/stats/revenue').then(res => res.json()),
      fetch('http://localhost:5000/api/notifications').then(res => res.json()),
    ]);

    // Clear and push to maintain the same reference
    SHIPMENTS.length = 0; SHIPMENTS.push(...s);
    DRIVERS.length = 0; DRIVERS.push(...d);
    MONTHLY_STATS.length = 0; MONTHLY_STATS.push(...m);
    REVENUE_DATA.length = 0; REVENUE_DATA.push(...r);
    NOTIFICATIONS.length = 0; NOTIFICATIONS.push(...n);
  } catch (error) {
    console.error('Failed to initialize data from backend:', error);
  }
};
