import React, { useEffect, useRef } from 'react';
import Globe from 'react-globe.gl';

const GlobeBackground = () => {
  const globeEl = useRef();

  useEffect(() => {
    // Auto-rotate
    globeEl.current.controls().autoRotate = true;
    globeEl.current.controls().autoRotateSpeed = 0.5;
    
    // Set initial position
    globeEl.current.pointOfView({ lat: 0, lng: 0, altitude: 2.5 });
  }, []);

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: -1 }}>
      <Globe
        ref={globeEl}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        backgroundColor="rgba(0,0,0,0)"
        atmosphereColor="rgba(200,200,255,0.2)"
        width={window.innerWidth}
        height={window.innerHeight}
      />
    </div>
  );
};

export default GlobeBackground;