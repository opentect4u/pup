const fetchProjectDetails = async () => {

        // if(fetchDataDetails) {
        // setFetchDataDetails(false);
        // } else {
        // setFetchDataDetails(true);
        // }
        
        setFetchDataDetails(true);

        setLoading(true);
        const formData = new FormData();
        formData.append('approval_no', formData1?.projectId?.split(',')[0]);

        try {
            const res = await axios.post(
                `${ADDRESSES.FETCH_PROJECT_PROCESS}`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        // auth_key: AUTH_KEY,
                        'Authorization': `Bearer ` + loginTokenStore?.token
                    },
                },
            );
            console.log(res, 'fetchProjectDetails_');
            if (res?.data?.status === 1) {
                console.log('PROJECT DTLS : ', res?.data);
                // const newProjectsList = res?.data?.message?.map((item: any) => ({
                //     label: `${item?.project_id} / ${item?.approval_no}\n${item?.scheme_name}`,
                //     value: item?.approval_no
                // }))
                // setProjectsList(newProjectsList)
                setFetchedProjectDetails(JSON.stringify(res?.data));
            } else {
                setFetchedProjectDetails('');
                ToastAndroid.show('Have No Project Data.', ToastAndroid.SHORT);
            }
        } catch (err) {
            console.log('ERR PROJ DTLS', err, 'fetchProjectDetails_');
            ToastAndroid.show(
                'Some error occurred while fetching project details.',
                ToastAndroid.SHORT,
            );
        }
        setLoading(false);
    };