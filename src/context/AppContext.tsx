import axios from 'axios';
import React, { createContext, useEffect, useMemo, useRef, useState } from 'react';
import { Alert, AppState, ToastAndroid } from 'react-native';
import {
  fileStorage,
  loginStorage,
  loginToken,
  projectStorage,
} from '../storage/appStorage';
import { ADDRESSES } from '../config/api_list';
import { AppStoreContext } from '../models/context_types';
// @ts-ignore
import { AUTH_KEY } from '@env';

const defaultAppStoreContext: AppStoreContext = {
  isLogin: false,
  isLoading: false,
  handleLogin: async () => {},
  handleLogout: async () => {},
};

export const AppStore = createContext<AppStoreContext>(defaultAppStoreContext);

const AppContext = ({ children }: any) => {
  console.log('AUTH KEY', AUTH_KEY);
  const appState = useRef(AppState.currentState);

  const [isLogin, setIsLogin] = useState<boolean>(() => false);
  const [isLoading, setIsLoading] = useState<boolean>(() => false);

  const loginTokenStore = useMemo(
      () => JSON.parse(loginToken?.getString('login-token') ?? '{}'),
      [],
  );

  const handleLogin = async (username: string, password: string , loginType: string) => {
    setIsLoading(true);

    const formData = new FormData();
    formData.append('user_id', username);
    formData.append('user_pwd', password);
    formData.append('login_type', loginType);

    console.log('LOGIN-----USERNAME-----PASS', formData);

    await axios
      .post(`${ADDRESSES.LOGIN}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          // auth_key: AUTH_KEY,
        },
      })
      .then(res => {
        if (res?.data?.status === 1) {
          // console.log('Login Data : ', res?.data);
          console.log('utsabbbbbbbbbbb', res?.data);

          loginStorage.set('login-data', JSON.stringify(res?.data?.message));

          loginToken.set(
          'login-token', JSON.stringify({
          expires_at: res?.data?.expires_at,
          token: res?.data?.token
          }
          ));

          setIsLogin(true);
        } else {
          Alert.alert('Not Found', 'User not found!');
          console.log('Login Status not 1 : ', res?.data);
          setIsLogin(false);
        }
      })
      .catch(err => {
        console.log('Login Catch Err >>>>> ', err);
        ToastAndroid.show(
          `Something went wrong while logging in.`,
          ToastAndroid.SHORT,
        );
      });

    setIsLoading(false);
  };

  const isLoggedIn = () => {
    
    if (loginStorage.getAllKeys().length === 0) {
      console.log('IF - isLoggedIn');
      setIsLogin(false);
    } else {
      console.log('ELSE - isLoggedIn');
      setIsLogin(true);
    }
  };

  useEffect(() => {
    if (appState.current === 'active') {
      isLoggedIn();
    }
  }, []);


// const expairyTime = loginTokenStore?.expires_at;
// const currentDate = new Date();


  useEffect(() => {
    const expiryDate = new Date(loginTokenStore?.expires_at?.replace(' ', 'T'));
    console.log(loginTokenStore?.expires_at, 'expairyTime', new Date(loginTokenStore?.expires_at?.replace(' ', 'T')));
    
    // handleLogout()
  }, []);
  

  const handleLogout = async () => {
    loginStorage.clearAll();
    fileStorage.clearAll();
    projectStorage.clearAll();
    loginToken.clearAll();
    setIsLogin(false);
  };

  return (
    <AppStore.Provider
      value={{
        isLogin,
        isLoading,
        handleLogin,
        handleLogout,
      }}>
      {children}
    </AppStore.Provider>
  );
};

export default AppContext;
