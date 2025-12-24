import { API } from '@/services/api';

export const logAutoLogout = async (details: Record<string, any>) => {
  const payload = {
    event: 'automatic_logout',
    timestamp: new Date().toISOString(),
    ...details,
  };

  // Best-effort: try to send to telemetry endpoint; fall back to console if unavailable
  try {
    await API.post('/api/telemetry/events', payload);
  } catch (err) {
    // Servers may not have telemetry endpoint; log locally for audits
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
