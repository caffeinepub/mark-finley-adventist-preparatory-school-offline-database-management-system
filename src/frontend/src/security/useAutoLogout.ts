import { useEffect, useRef } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';

const INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutes

export function useAutoLogout() {
  const { clear, identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!identity) return;

    const resetTimer = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(async () => {
        await clear();
        queryClient.clear();
      }, INACTIVITY_TIMEOUT);
    };

    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    
    events.forEach(event => {
      document.addEventListener(event, resetTimer);
    });

    resetTimer();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      events.forEach(event => {
        document.removeEventListener(event, resetTimer);
      });
    };
  }, [identity, clear, queryClient]);
}
