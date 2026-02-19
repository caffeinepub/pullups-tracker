/**
 * React hook for Pakistan Standard Time synchronization
 * Polls every 60 seconds to detect midnight transitions
 */

import { useEffect, useState, useRef } from 'react';
import { getCurrentPSTDate } from '../lib/pstDate';

type DateChangeCallback = (newDate: string) => void;

export function usePSTSync() {
  const [currentPSTDate, setCurrentPSTDate] = useState<string>(getCurrentPSTDate());
  const previousDateRef = useRef<string>(currentPSTDate);
  const callbacksRef = useRef<Set<DateChangeCallback>>(new Set());

  useEffect(() => {
    // Initialize with current PST date
    const initialDate = getCurrentPSTDate();
    setCurrentPSTDate(initialDate);
    previousDateRef.current = initialDate;

    // Poll every 60 seconds
    const interval = setInterval(() => {
      const newDate = getCurrentPSTDate();
      
      if (newDate !== previousDateRef.current) {
        // Date changed - midnight passed!
        previousDateRef.current = newDate;
        setCurrentPSTDate(newDate);
        
        // Notify all subscribers
        callbacksRef.current.forEach(callback => {
          callback(newDate);
        });
      }
    }, 60000); // 60 seconds

    return () => clearInterval(interval);
  }, []);

  const onDateChange = (callback: DateChangeCallback) => {
    callbacksRef.current.add(callback);
    
    // Return cleanup function
    return () => {
      callbacksRef.current.delete(callback);
    };
  };

  return {
    currentPSTDate,
    onDateChange,
  };
}
