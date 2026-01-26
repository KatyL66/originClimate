import { useState, useCallback } from 'react';
import { DEMO_ZIP_SCENARIOS } from './demoZipScenarios';

export const useLocation = () => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const getGPSLocation = useCallback(() => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by your browser'));
        return;
      }

      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLoc = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            isDemo: false
          };
          setLocation(newLoc);
          setLoading(false);
          resolve(newLoc);
        },
        (err) => {
          setLoading(false);
          setError(err.message);
          reject(err);
        }
      );
    });
  }, []);

  const getCoordsFromZip = useCallback(async (zip) => {
    setLoading(true);
    try {
      if (DEMO_ZIP_SCENARIOS[zip]) {
      const demoLoc = {
        latitude: DEMO_ZIP_SCENARIOS[zip].latitude,
        longitude: DEMO_ZIP_SCENARIOS[zip].longitude,
        zip_code: zip,
        isDemo: true
      };
      setLocation(demoLoc);
      setLoading(false);
      return demoLoc;
    }


      const response = await fetch(`https://api.zippopotam.us/us/${zip}`);
      if (!response.ok) throw new Error('Invalid ZIP code');
      const data = await response.json();
      const newLoc = {
        latitude: parseFloat(data.places[0].latitude),
        longitude: parseFloat(data.places[0].longitude),
        zip_code: zip,
        isDemo: false
      };
      setLocation(newLoc);
      setLoading(false);
      return newLoc;
    } catch (err) {
      setLoading(false);
      setError(err.message);
      throw err;
    }
  }, []);

  const clearLocation = useCallback(() => {
    setLocation(null);
    setError(null);
  }, []);

  return { location, error, loading, getGPSLocation, getCoordsFromZip, clearLocation };
};
