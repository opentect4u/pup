/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import AppContext from './src/context/AppContext';
import { PaperProvider } from 'react-native-paper';
import { name as appName } from './app.json';
import { usePaperColorScheme } from './src/theme/theme';
import { createContext, useEffect, useMemo, useState } from 'react';
import NetInfo from "@react-native-community/netinfo";
import InternetStatusContext from './src/context/InternetStatusContext';

// export const InternetStatusContext = createContext(false);

export default function Main() {

  const [isOnline, setOnline] = useState(false);

  useMemo(() => {
    const removeNetInfoSubscription = NetInfo.addEventListener(state => {
      const offline = state.isConnected && state.isInternetReachable;
      // console.log("..............CHECK NET STATUS..............", offline);
      setOnline(offline);
    });
    return () => removeNetInfoSubscription();
  }, []);


  const theme = usePaperColorScheme();
  return (
    <InternetStatusContext.Provider value={isOnline}>
    <AppContext>
      <PaperProvider theme={theme} settings={{ rippleEffectEnabled: true }}>
        <App />
      </PaperProvider>
    </AppContext>
    </InternetStatusContext.Provider>
  );
}

AppRegistry.registerComponent(appName, () => Main);
