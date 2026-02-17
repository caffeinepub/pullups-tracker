import { useEffect, useRef } from 'react';

export function useScrollLock(isLocked: boolean) {
  const scrollPositionRef = useRef(0);

  useEffect(() => {
    if (isLocked) {
      // Save current scroll position
      scrollPositionRef.current = window.scrollY;
      
      // Lock scroll
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollPositionRef.current}px`;
      document.body.style.width = '100%';
      document.body.style.touchAction = 'none';
    } else {
      // Restore scroll
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.touchAction = '';
      
      window.scrollTo(0, scrollPositionRef.current);
    }

    return () => {
      // Cleanup on unmount
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.touchAction = '';
    };
  }, [isLocked]);
}
