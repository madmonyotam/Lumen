import { useState, useEffect } from 'react';

const MOBILE_BREAKPOINT = 768; // standard mobile breakpoint

export const useMobile = (breakpoint: number = MOBILE_BREAKPOINT) => {
    const [isMobile, setIsMobile] = useState<boolean>(false);

    useEffect(() => {
        // Only run on the client side
        if (typeof window === 'undefined') return;

        const mediaQuery = window.matchMedia(`(max-width: ${breakpoint}px)`);

        // Initial check
        setIsMobile(mediaQuery.matches);

        // Handle resize events
        const handleResize = (e: MediaQueryListEvent) => {
            setIsMobile(e.matches);
        };

        // Add listener (using modern event listener method)
        mediaQuery.addEventListener('change', handleResize);

        // Cleanup
        return () => {
            mediaQuery.removeEventListener('change', handleResize);
        };
    }, [breakpoint]);

    return isMobile;
};
