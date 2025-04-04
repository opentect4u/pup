import { useState, useEffect } from 'react';
import { Dimensions } from 'react-native';

const useScreenDimensions = () => {
  const [screenDimensions, setScreenDimensions] = useState({
    screenWidth: Dimensions.get('window').width,
    screenHeight: Dimensions.get('window').height,
  });

  useEffect(() => {
    const onChange = ({ window }: any) => {
      setScreenDimensions({
        screenWidth: window.width,
        screenHeight: window.height,
      });
    };

    const subscription = Dimensions.addEventListener('change', onChange);

    return () => subscription?.remove();
  }, []);

  return screenDimensions;
};

export default useScreenDimensions;
