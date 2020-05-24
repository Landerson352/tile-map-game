import React from 'react';
import panzoom from 'panzoom';

const usePanZoom = () => {
  const elementRef = React.useRef();

  React.useEffect(() => {
    if (!elementRef.current) return;
    const panzoomElement = panzoom(elementRef.current);

    return () => {
      panzoomElement.dispose();
    };
  });

  return elementRef;
};

export default usePanZoom;
