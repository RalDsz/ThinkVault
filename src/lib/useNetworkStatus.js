import { useEffect } from 'react';
import toast from 'react-hot-toast';

export const useNetworkStatus = (onReconnectCallback) => {
  useEffect(() => {
    const offlineToastId = 'network-status';

    const handleOffline = () => {
      toast.error('You have lost connection.', { id: offlineToastId });
    };

    const handleOnline = () => {
      toast.dismiss(offlineToastId);
      toast.success('Connection restored!', { id: offlineToastId });

      // Optional refetch function
      if (onReconnectCallback) {
        onReconnectCallback();
      }
    };

    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);

    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, [onReconnectCallback]);
};
