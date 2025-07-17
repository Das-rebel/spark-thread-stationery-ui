import { useState, useRef, useEffect, ReactNode } from "react";
import { RefreshCw } from "lucide-react";

interface PullToRefreshProps {
  children: ReactNode;
  onRefresh: () => Promise<void>;
  disabled?: boolean;
}

export function PullToRefresh({ children, onRefresh, disabled = false }: PullToRefreshProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [startY, setStartY] = useState(0);
  const [canPull, setCanPull] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const threshold = 80; // Distance to trigger refresh
  const maxPull = 120; // Maximum pull distance

  useEffect(() => {
    const container = containerRef.current;
    if (!container || disabled) return;

    const handleTouchStart = (e: TouchEvent) => {
      if (container.scrollTop === 0) {
        setStartY(e.touches[0].clientY);
        setCanPull(true);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!canPull || container.scrollTop > 0) {
        setCanPull(false);
        setPullDistance(0);
        return;
      }

      const currentY = e.touches[0].clientY;
      const distance = Math.max(0, (currentY - startY) * 0.5); // Reduce sensitivity
      
      if (distance > 0) {
        e.preventDefault();
        setPullDistance(Math.min(distance, maxPull));
      }
    };

    const handleTouchEnd = async () => {
      if (pullDistance >= threshold && !isRefreshing) {
        setIsRefreshing(true);
        try {
          await onRefresh();
        } finally {
          setIsRefreshing(false);
        }
      }
      
      setCanPull(false);
      setPullDistance(0);
    };

    // Mouse events for desktop testing
    const handleMouseDown = (e: MouseEvent) => {
      if (container.scrollTop === 0) {
        setStartY(e.clientY);
        setCanPull(true);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!canPull || container.scrollTop > 0) {
        setCanPull(false);
        setPullDistance(0);
        return;
      }

      if (e.buttons === 1) { // Left mouse button is pressed
        const distance = Math.max(0, (e.clientY - startY) * 0.5);
        if (distance > 0) {
          e.preventDefault();
          setPullDistance(Math.min(distance, maxPull));
        }
      }
    };

    const handleMouseUp = async () => {
      if (pullDistance >= threshold && !isRefreshing) {
        setIsRefreshing(true);
        try {
          await onRefresh();
        } finally {
          setIsRefreshing(false);
        }
      }
      
      setCanPull(false);
      setPullDistance(0);
    };

    container.addEventListener('touchstart', handleTouchStart, { passive: false });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd);
    
    container.addEventListener('mousedown', handleMouseDown);
    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseup', handleMouseUp);

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
      container.removeEventListener('mousedown', handleMouseDown);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseup', handleMouseUp);
    };
  }, [canPull, pullDistance, startY, threshold, isRefreshing, onRefresh, disabled]);

  const refreshOpacity = Math.min(pullDistance / threshold, 1);
  const refreshRotation = (pullDistance / threshold) * 180;

  return (
    <div 
      ref={containerRef}
      className="relative overflow-y-auto h-full"
      style={{ 
        transform: `translateY(${pullDistance}px)`,
        transition: canPull ? 'none' : 'transform 0.3s ease-out'
      }}
    >
      {/* Pull to Refresh Indicator */}
      {(pullDistance > 0 || isRefreshing) && (
        <div 
          className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full
                     flex items-center justify-center w-16 h-16 
                     bg-gradient-sakura rounded-full shadow-floating z-10"
          style={{
            opacity: isRefreshing ? 1 : refreshOpacity,
            transform: `translateX(-50%) translateY(${pullDistance - 80}px)`
          }}
        >
          <RefreshCw 
            className={`w-6 h-6 text-white ${isRefreshing ? 'animate-spin' : ''}`}
            style={{ 
              transform: isRefreshing ? 'none' : `rotate(${refreshRotation}deg)` 
            }}
          />
        </div>
      )}

      {children}
    </div>
  );
}