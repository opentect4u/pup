import { useState, useCallback, useMemo } from 'react';
import axios from 'axios';
import { ToastAndroid } from 'react-native';
import { loginToken } from '../storage/appStorage';
import { ADDRESSES } from '../config/api_list';



export const useFetchProjectDetails = () => {
  const [loading, setLoading] = useState(false);
  const [fetchedProjectDetails, setFetchedProjectDetails] = useState<string>('');
  const loginTokenStore = useMemo(
            () => JSON.parse(loginToken?.getString('login-token') ?? '{}'),
            [],
        );

  const fetchProjectDetails = useCallback(async (projectId: string) => {
    console.log('fetchProjectDetails_sssssswssssssss', projectId);
    setLoading(true);

    const formData = new FormData();
    formData.append('approval_no', projectId?.split(',')[0]);

    try {
      const res = await axios.post(
        `${ADDRESSES.FETCH_PROJECT_PROCESS}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${loginTokenStore?.token}`,
          },
        }
      );
      console.log('FETCH PROJECT DETAILS RESPONSE', res?.data);
      if (res?.data?.status === 1) {
        setFetchedProjectDetails(JSON.stringify(res?.data));
      } else {
        setFetchedProjectDetails('');
        ToastAndroid.show('Have No Project Data.', ToastAndroid.SHORT);
      }
    } catch (err) {
      console.log('ERR PROJ DTLS', err);
      ToastAndroid.show(
        'Some error occurred while fetching project details.',
        ToastAndroid.SHORT
      );
    }

    setLoading(false);
  }, []);

  return {
    loading,
    fetchedProjectDetails,
    fetchProjectDetails,
    setFetchedProjectDetails, // optional setter
  };
};
