import { useState, useCallback, useMemo } from 'react';
import { ToastAndroid } from 'react-native';
import axios from 'axios';
import { ADDRESSES } from '../config/api_list'; // adjust path as needed
import { livPprojectListStorage, loginStorage, loginToken } from '../storage/appStorage'; // adjust path
// import { useLoginStore } from '../stores/loginStore'; // adjust path

const useloadLiveProjectList = () => {
  const [loadingLivePro, setLoadingLivePro] = useState(false);

      const loginStore = useMemo(
          () => JSON.parse(loginStorage?.getString('login-data') ?? '{}'),
          [],
      );

      const loginTokenStore = useMemo(
          () => JSON.parse(loginToken?.getString('login-token') ?? '{}'),
          [],
      );

  const loadLiveProjectList = useCallback(async () => {
    setLoadingLivePro(true);

    const formData = new FormData();
    formData.append('user_id', loginStore?.user_id);

    try {
      const res = await axios.post(
        `${ADDRESSES.LOAD_LIVE_PROJECT}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${loginTokenStore?.token}`,
          },
        },
      );

      console.log('PROJECTS___', res?.data);

      if (res?.data?.status === 1) {
        livPprojectListStorage.set(
          'liveProjectListStore',
          JSON.stringify(res?.data?.message)
        );
        console.log('fetchProjectsList()');
      } else {
        ToastAndroid.show('Projects fetch error.', ToastAndroid.SHORT);
      }
    } catch (err) {
      console.log('PROJECTS___', err);
      ToastAndroid.show(
        'Some error occurred while fetching projects.',
        ToastAndroid.SHORT
      );
    } finally {
      setLoadingLivePro(false);
    }
  }, [loginStore?.user_id, loginTokenStore?.token]);

  return {
    loadingLivePro,
    loadLiveProjectList,
  };
};

export default useloadLiveProjectList;
