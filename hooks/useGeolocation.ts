import { useState } from 'react';

interface GeolocationState {
  loading: boolean;
  error: GeolocationPositionError | { code: number; message: string } | null;
  data: {
    latitude: number;
    longitude: number;
  } | null;
}

export const useGeolocation = (addToast?: (message: string, type: string) => void, t?: (key: string) => string) => {
  const [state, setState] = useState<GeolocationState>({
    loading: false,
    error: null,
    data: null,
  });

  const getLocation = () => {
    if (!navigator.geolocation) {
       if (addToast) addToast("Geolocation is not supported by your browser.", "error");
       setState({ loading: false, error: { code: 99, message: "Geolocation not supported" }, data: null });
       return;
    }
    
    setState({ loading: true, error: null, data: null });
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          loading: false,
          error: null,
          data: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          },
        });
      },
      (error) => {
        let message = t ? t('toast.geolocation.error') : 'Geolocation error occurred';
        if (error.code === error.PERMISSION_DENIED) {
            message = t ? t('toast.geolocation.permission_denied') : 'Permission denied for geolocation';
        }
        if (addToast) addToast(message, "error");
        setState({
          loading: false,
          error,
          data: null,
        });
      }
    );
  };

  return { ...state, getLocation };
};
