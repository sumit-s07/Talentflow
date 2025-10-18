import { useRef, useCallback } from 'react';

export const useDragAndDrop = <T,>(
  list: T[],
  onReorder: (reorderedList: T[]) => void
) => {
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);
  const scrollIntervalRef = useRef<number | null>(null);

  const stopScrolling = useCallback(() => {
    if (scrollIntervalRef.current) {
      cancelAnimationFrame(scrollIntervalRef.current);
      scrollIntervalRef.current = null;
    }
  }, []);

  const startScrolling = useCallback((direction: 'up' | 'down') => {
    if (scrollIntervalRef.current) return;
    const scrollStep = () => {
      const scrollAmount = direction === 'up' ? -15 : 15;
      window.scrollBy(0, scrollAmount);
      scrollIntervalRef.current = requestAnimationFrame(scrollStep);
    };
    scrollIntervalRef.current = requestAnimationFrame(scrollStep);
  }, []);

  const handleDragStart = (index: number) => {
    dragItem.current = index;
  };

  const handleDragEnter = (index: number) => {
    dragOverItem.current = index;
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const viewportHeight = window.innerHeight;
    const hotZonePercentage = 0.15;
    const hotZoneSize = viewportHeight * hotZonePercentage;
    const cursorY = e.clientY;

    if (cursorY < hotZoneSize) {
      startScrolling('up');
    } else if (cursorY > viewportHeight - hotZoneSize) {
      startScrolling('down');
    } else {
      stopScrolling();
    }
  };

  const handleDrop = () => {
    stopScrolling();
    if (dragItem.current === null || dragOverItem.current === null || dragItem.current === dragOverItem.current) {
      dragItem.current = null;
      dragOverItem.current = null;
      return;
    }
    const newList = [...list];
    const draggedItemContent = newList.splice(dragItem.current, 1)[0];
    newList.splice(dragOverItem.current, 0, draggedItemContent);
    dragItem.current = null;
    dragOverItem.current = null;
    onReorder(newList);
  };
  
  const handleDragEnd = () => {
    // This is the crucial cleanup step. It ensures scrolling stops
    // even if the item is dropped outside a valid target.
    stopScrolling();
    // Also reset refs as a good practice
    dragItem.current = null;
    dragOverItem.current = null;
  };

  return {
    handleDragStart,
    handleDragEnter,
    handleDragOver,
    handleDrop,
    handleDragEnd, 
  };
};