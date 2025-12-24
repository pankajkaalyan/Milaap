import { API } from '@/services/api';

export const logAutoLogout = async (details: Record<string, any>) => {
  // 1. Retrieve the token from localStorage
  const token = localStorage.getItem('token'); // or 'jwt', 'authToken' depending on your key name

  // 2. Only proceed if the token exists
  if (!token) {
    console.log('No token found, skipping telemetry log.');
    return;
  }

  const payload = {
    event: 'automatic_logout',
    timestamp: new Date().toISOString(),
    ...details,
  };

  try {
    // 3. Optional: Pass the token in headers if your API instance doesn't do it automatically
    await API.post('/api/telemetry/events', payload, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('Telemetry (auto-logout) fallback:', payload, err);
  }
};

export const logEvent = async (name: string, props?: Record<string, any>) => {
  const payload = {
    event: name,
    timestamp: new Date().toISOString(),
    props: props || {},
  };

  try {
    await API.post('/api/telemetry/events', payload);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('Telemetry event fallback:', payload, err);
  }
};
