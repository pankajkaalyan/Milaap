import { useState } from 'react';
import { useAppContext } from './useAppContext';

interface GeolocationState {
  loading: boolean;
  error: GeolocationPositionError | { code: number; message: string } | null;
  data: {
    latitude: number;
    longitude: number;
  } | null;
}

export const useGeolocation = () => {
  const { addToast, t } = useAppContext();
  const [state, setState] = useState<GeolocationState>({
    loading: false,
    error: null,
    data: null,
  });

  const getLocation = () => {
    if (!navigator.geolocation) {
       addToast("Geolocation is not supported by your browser.", "error");
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
        let message = t('toast.geolocation.error');
        if (error.code === error.PERMISSION_DENIED) {
            message = t('toast.geolocation.permission_denied');
        }
        addToast(message, "error");
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
