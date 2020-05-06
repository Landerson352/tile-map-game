import React from 'react';
import panzoom from 'panzoom';

const usePanZoom = (setMapPanning = () => null, setMapZooming = () => null) => {
  const elementRef = React.useRef();

  React.useEffect(() => {
    if (!elementRef.current) return;

    const onPanStart = () => setMapPanning(true);
    const onPanEnd = () => setMapPanning(false);
    const onZoomStart = () => setMapZooming(true);
    const onZoomEnd = () => setMapZooming(false);

    const element = panzoom(elementRef.current);
    element.on('panstart', onPanStart);
    element.on('panend', onPanEnd);
    element.on('zoomStart', onZoomStart);
    element.on('zoomend', onZoomEnd);

    return () => {
      element.off('panstart', onPanStart);
      element.off('panend', onPanEnd);
      element.off('zoomStart', onZoomStart);
      element.off('zoomend', onZoomEnd);
    };
  }, [setMapPanning, setMapZooming]);

  return elementRef;
};

export default usePanZoom;
