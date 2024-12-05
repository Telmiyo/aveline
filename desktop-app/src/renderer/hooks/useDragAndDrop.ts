import { useState, useCallback } from 'react';

const useDragAndDrop = (callbacks: {
  onDrop: (files: FileList) => void;
  onDragEnter?: () => void;
  onDragLeave?: () => void;
}) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnter = useCallback(
    (event: DragEvent) => {
      event.preventDefault();
      event.stopPropagation();
      setIsDragging(true);
      callbacks.onDragEnter?.();
    },
    [callbacks],
  );

  const handleDragLeave = useCallback(
    (event: DragEvent) => {
      event.preventDefault();
      event.stopPropagation();
      setIsDragging(false);
      callbacks.onDragLeave?.();
    },
    [callbacks],
  );

  const handleDrop = useCallback(
    (event: DragEvent) => {
      event.preventDefault();
      event.stopPropagation();
      setIsDragging(false);
      if (event.dataTransfer?.files) {
        callbacks.onDrop(event.dataTransfer.files);
      }
    },
    [callbacks],
  );

  // Attach global event listeners to handle drag over and leave
  const handleDragOver = useCallback((event: DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
  }, []);

  return {
    isDragging,
    handleDrop,
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
  };
};

export default useDragAndDrop;
