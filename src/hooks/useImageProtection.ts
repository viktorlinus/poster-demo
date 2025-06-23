import { useEffect, RefObject } from 'react';

export function useImageProtection(canvasRef: RefObject<HTMLCanvasElement | null>) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const preventActions = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
      return false;
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && (e.key === 's' || e.key === 'a' || e.key === 'c' || e.key === 'v')) {
        e.preventDefault();
        return false;
      }
    };

    // Event listeners
    canvas.addEventListener('contextmenu', preventActions);
    canvas.addEventListener('selectstart', preventActions);
    canvas.addEventListener('dragstart', preventActions);
    document.addEventListener('keydown', handleKeyDown);
    
    // CSS protection
    const style = canvas.style;
    style.userSelect = 'none';
    // Use setProperty for vendor-prefixed properties
    style.setProperty('-webkit-user-select', 'none');
    style.setProperty('-moz-user-select', 'none');
    style.setProperty('-ms-user-select', 'none');
    style.setProperty('-webkit-touch-callout', 'none');
    style.setProperty('-webkit-user-drag', 'none');
    style.pointerEvents = 'none';

    return () => {
      canvas.removeEventListener('contextmenu', preventActions);
      canvas.removeEventListener('selectstart', preventActions);
      canvas.removeEventListener('dragstart', preventActions);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [canvasRef]);
}
