import { API } from '@/services/api';
import { storageManager } from './storageManager';

// Feature flag: set VITE_TELEMETRY_ENABLED=true in your environment to enable telemetry calls.
// When disabled (default), telemetry helpers will no-op and avoid noisy console errors when
// the telemetry backend is not available.
const TELEMETRY_ENABLED = import.meta.env.VITE_TELEMETRY_ENABLED === 'true';
let TELEMETRY_AVAILABLE = false; // runtime flag toggled by health-check

/**
 * Attempt to probe the telemetry endpoint to check availability.
 * Returns true if probe succeeds (2xx), false otherwise.
 */
export const probeTelemetry = async (timeout = 3000): Promise<boolean> => {
  if (!TELEMETRY_ENABLED) {
    TELEMETRY_AVAILABLE = false;
    // eslint-disable-next-line no-console
    console.debug('Telemetry disabled: skipping probe');
    return false;
  }

  try {
    // Use a lightweight request (HEAD) to keep payload small and quick
    const resp = await API.head('/api/telemetry/events', { timeout });
    const ok = resp?.status >= 200 && resp?.status < 300;
    TELEMETRY_AVAILABLE = ok;
    // eslint-disable-next-line no-console
    console.debug('Telemetry probe result:', ok, resp?.status);
    return ok;
  } catch (err) {
    TELEMETRY_AVAILABLE = false;
    // eslint-disable-next-line no-console
    console.warn('Telemetry probe failed:', err);
    return false;
  }
};

/** Initialize the telemetry health check once on app start. */
export const initTelemetryHealthCheck = async () => {
  // run a background probe but don't block app startup
  void probeTelemetry();
};

export const isTelemetryAvailable = () => TELEMETRY_ENABLED && TELEMETRY_AVAILABLE;

export const logAutoLogout = async (details: Record<string, any>) => {
  if (!TELEMETRY_ENABLED || !TELEMETRY_AVAILABLE) {
    // Telemetry not enabled/available — no-op quietly
    // eslint-disable-next-line no-console
    console.debug('Telemetry not available: skipping auto-logout telemetry', details);
    return;
  }

  // 1. Retrieve the token from localStorage
  const token = storageManager.getItem('token', 'local'); // or 'jwt', 'authToken' depending on your key name

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
  if (!TELEMETRY_ENABLED || !TELEMETRY_AVAILABLE) {
    // eslint-disable-next-line no-console
    console.debug('Telemetry not available: skipping event', { name, props });
    return;
  }

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
