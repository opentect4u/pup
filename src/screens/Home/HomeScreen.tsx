import React, { useEffect, useState, useCallback, useMemo, useContext } from 'react';
import {
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    ToastAndroid,
    View,
    TouchableOpacity,
    RefreshControl,
    Linking,
} from 'react-native';
import {
    ActivityIndicator,
    Icon,
    ProgressBar,
    Text,
    TextInput,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { usePaperColorScheme } from '../../theme/theme';
import { homeScreenStrings } from '../../constants/strings';
import useGeoLocation from '../../hooks/useGeoLocation';
import { Dropdown } from 'react-native-element-dropdown';
import ButtonPaper from '../../components/ButtonPaper';
import InputPaper from '../../components/InputPaper';
import Header from '../../components/Header';
import {
    fileStorage,
    livPprojectListStorage,
    loginStorage,
    loginToken,
    projectSaveSpecificStorage,
} from '../../storage/appStorage';
// import { AUTH_KEY, REVERSE_GEOENCODING_API_KEY } from '@env';
import { AUTH_KEY, REVERSE_GEOENCODING_API_KEY } from '@env';
import { ADDRESSES } from '../../config/api_list';
import axios from 'axios';
import { CommonActions, useIsFocused, useNavigation } from '@react-navigation/native';
import {
    Asset,
    ImageLibraryOptions,
    ImagePickerResponse,
    launchImageLibrary,
    launchCamera,
    CameraOptions,
} from 'react-native-image-picker';
import ImageResizer from '@bam.tech/react-native-image-resizer';
import RNFS from 'react-native-fs';
import { ProjectStoreModel } from '../../models/global_models';
import ProjectGrid from '../../components/complex/ProjectGrid';
import DatePicker from 'react-native-date-picker';
import { AppStore } from '../../context/AppContext';
import GetLocation from 'react-native-get-location';
import NetInfo from "@react-native-community/netinfo";
import InternetStatusContext from '../../context/InternetStatusContext';
import navigationRoutes from '../../routes/routes';
import useloadLiveProjectList from '../../hooks/useLoadLiveProjectList';


const strings = homeScreenStrings.getStrings();

const HomeScreen = () => {
    const navigation = useNavigation();
    const theme = usePaperColorScheme();
    const { location, error } = useGeoLocation();
    const { checkTokenExpiry } = useContext(AppStore);

    const isFocused = useIsFocused();

    const maxSaveProjCount = 4; // Maximum number of projects allowed 5
    const nowDate = new Date();

    // const now = new Date();
    // const nowDate = new Date(now);
    // nowDate.setDate(now.getDate() + 1);
    // const nowDate = '2025-08-06T09:11:56.915Z';
    const { loadingLivePro, loadLiveProjectList } = useloadLiveProjectList();




    const [geolocationFetchedAddress, setGeolocationFetchedAddress] = useState(
        () => '',
    );

    // Memoize loginStore so it doesn't change on every render
    const loginStore = useMemo(
        () => JSON.parse(loginStorage?.getString('login-data') ?? '{}'),
        [],
    );

    const loginTokenStore = useMemo(
        () => JSON.parse(loginToken?.getString('login-token') ?? '{}'),
        [],
    );

    const [refreshing, setRefreshing] = useState(() => false);
    const [imgData, setImgData] = useState<Asset[]>([]);
    const [projectsList, setProjectsList] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    // const [loadingLivePro, setLoadingLivePro] = useState(false);
    const [fetchedProjectDetails, setFetchedProjectDetails] = useState(() => '');
    const [progressComplete, setProgressComplete] = useState(() => Number(0));
    const [progressCompleteAPI, setProgressCompleteAPI] = useState(() => Number(0));
    const [openDate, setOpenDate] = useState(() => false);
    const [dateFinal, setDateFinal] = useState(() => '');
    const [projects, setProjects] = useState<ProjectStoreModel[]>([]);
    const [projectsDate, setProjectsDate] = useState('');
    const [fetchDataDetails, setFetchDataDetails] = useState(false);

    const [internetStatus, setInternetStatus] = useState(false);

    const isOnline = useContext(InternetStatusContext);

    useEffect(() => {
        console.log('isOnlineCopy', isOnline, 'isFocusedCopy', isFocused);
    if (isOnline) {
    setInternetStatus(true);
    
    }

    if (!isOnline) {
    // Alert.alert('No Internet', 'Please connect to the internet.');
    // console.log('interStatus', 'No Internet Please connect to the internet.');
    setInternetStatus(false);
    }

    }, [isOnline]);

    // Set projectId to null instead of "" to indicate no selection
    const [formData1, setFormData1] = useState({
        projectId: null as string | null,
        progress: '',
        latitude: '',
        longitude: '',
        locationAddress: '',
        // actual_date_comp: '',
        remarks: '',
        actual_date_comp: '',
    });

    const handleFormChange = useCallback((field: string, value: any) => {
        setFormData1(prev => ({
            ...prev,
            [field]: value,
        }));
    }, []);

    useEffect(() => {
        if (error) {
            Alert.alert(
                'Turn on Location',
                'Give access to Location or Turn on GPS from app settings.',
                [
                    {
                        text: 'Go to Settings',
                        onPress: () => {
                            navigation.dispatch(CommonActions.goBack());
                            Linking.openSettings();
                        },
                    },
                ],
            );
        }
    }, [error]);

    

    const fetchProjectsList = async () => {
        // setProjectsList([])

       
    if(isOnline) {
        console.log('fetchProjectsList__', isOnline, 'isOnline'); 
        setLoading(true);

        // Alert.alert('Online Mode__', 'You are online. Fetching live projects.'+ isOnline);
        const formData = new FormData();
        formData.append('user_id', loginStore?.user_id);
        try {
            const res = await axios.post(
                `${ADDRESSES.FETCH_PROJECTS_LIST}`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ` + loginTokenStore?.token
                    },
                },
            );

            
            if (res?.data?.status === 1) {

                const newProjectsList = res?.data?.message?.map((item: any) => ({
                    // label: `${item?.project_id} / ${item?.approval_no}\n${item?.scheme_name}`,
                    // label: `${item?.project_id} \n${item?.scheme_name} ---online`,
                    label: `${item?.project_id} \n${item?.scheme_name}`,
                    value: `${item?.approval_no},${item?.project_id}`,
                }));
                console.log(newProjectsList, 'newProjectsList__');
                
                setProjectsList(newProjectsList);
                setLoading(false);
            } else {
                ToastAndroid.show('Projects fetch error.', ToastAndroid.SHORT);
            }
        } catch (err) {
            console.log(formData, 'hhhhhhhhhhhhhhhhh', err);
            console.log('ERR PROJ', err, 'fetchProjectsList__');
            setLoading(false);
            ToastAndroid.show(
                'Some error occurred while fetching projects.',
                ToastAndroid.SHORT,
            );
        }
    }
    else{
        console.log('fetchProjectsList__', isOnline, 'isOFFline'); 
        const projectsData__live = livPprojectListStorage.getString('liveProjectListStore');
        console.log(projectsData__live, 'projectsData__live');
        
            if (projectsData__live) {
            var parsedProjects__ = JSON.parse(projectsData__live);
            console.log('projectsData__live', parsedProjects__);
            const dt = parsedProjects__.map((item: any) => ({
                    // label: `${item?.project_id} / ${item?.approval_no}\n${item?.scheme_name}`,
                    // label: `${item?.project_id} \n${item?.scheme_name} + ${item?.approval_no} ofline`,
                    label: `${item?.project_id} \n${item?.scheme_name}`,
                    value: `${item?.approval_no},${item?.project_id}`,
                }));
                console.log(dt, 'dt____________');
                setProjectsList(dt)
            }
    }

        
    };


    const fetchProgressDone = async (data: any) => {

    if(isOnline) {
        setLoading(true);
        console.log('Percentage_', data);
        const formData = new FormData();
        formData.append('approval_no', data);

        try {
            const res = await axios.post(
                `${ADDRESSES.FETCH_PROGRESS_DONE}`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        // auth_key: AUTH_KEY,
                        'Authorization': `Bearer ` + loginTokenStore?.token
                    },
                },
            );

            console.log(res, 'fetchProgressDone_ ');

            if (res?.data?.status === 1) {
                console.log('Percentage_ ', res, 'iffffffff');
                // const newProjectsList = res?.data?.message?.map((item: any) => ({
                //     label: `${item?.project_id} / ${item?.approval_no}\n${item?.scheme_name}`,
                //     value: `${item?.approval_no},${item?.project_id}`
                // }))
                // setProjectsList(newProjectsList)
                setProgressComplete(res?.data?.progress_percent);
                setProgressCompleteAPI(res?.data?.progress_percent);
            } else {
                console.log('Percentage_ ', res, 'else');
                setProgressComplete(Number(0));
                setProgressCompleteAPI(Number(0));
                ToastAndroid.show('Percentage fetch error.', ToastAndroid.SHORT);
            }
            setLoading(false);
        } catch (err) {
            console.log('ERR PROJ', err, 'fetchProgressDone_ ');
            ToastAndroid.show(
                'Some error occurred while fetching projects uuuuu.',
                ToastAndroid.SHORT,
            );
            
            setLoading(false);
        }
    } else {

    const projectsData__live = livPprojectListStorage.getString('liveProjectListStore');
    if (projectsData__live) {
    var parsedProjects__ = JSON.parse(projectsData__live);
    console.log('projectsData__live', parsedProjects__);

    const result = parsedProjects__.find((item: any) => item?.approval_no === data);
    console.log(result, 'fetchProgressDone__data', isOnline, 'isOnline');

    setProgressComplete(result?.progress_percent);
    setProgressCompleteAPI(result?.progress_percent);

    // setProgressComplete(res?.data?.progress_percent);
    // setProgressCompleteAPI(res?.data?.progress_percent);

    // const dt = parsedProjects__.map((item: any) => ({
    // // label: `${item?.project_id} / ${item?.approval_no}\n${item?.scheme_name}`,
    // label: `${item?.project_id} \n${item?.scheme_name}`,
    // value: `${item?.approval_no},${item?.project_id}`,
    // }));
    // console.log(dt, 'dt____________');
    // setProjectsList(dt)
    }
    }
        
    };

 

    // useEffect(() => {
    //     fetchProjectsList();
    // }, [fetchProjectsList]);



    //  useEffect(() => {
    //     fetchProjectsList();
    // }, []);

     useEffect(() => {
        // fetchProjectDetails();
        // if(fetchDataDetails) {
        setFetchDataDetails(false);
        // } else {
        // setFetchDataDetails(true);
        // }

    }, [formData1.projectId]);
    

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

    const openGallery = useCallback(() => {
        const options: ImageLibraryOptions = {
            mediaType: 'photo',
            includeBase64: true,
            selectionLimit: 4,
        };

        launchImageLibrary(options, (response: ImagePickerResponse) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
                fileStorage.clearAll();
            } else if (response.errorCode) {
                console.log('ImagePicker Error: ', response.errorMessage);
                fileStorage.clearAll();
            } else {
                const assets = response?.assets as Asset[];
                if (assets && assets.length > 0) {
                    setImgData(prev => {
                        const currentCount = prev.length;
                        const allowedCount = 4 - currentCount;
                        if (allowedCount <= 0) {
                            ToastAndroid.show('Maximum 4 images allowed', ToastAndroid.SHORT);
                            return prev;
                        }
                        const newAssets = assets.slice(0, allowedCount);
                        return [...prev, ...newAssets];
                    });

                    fileStorage.set('file-data', assets[0].base64?.toString() || '');
                    fileStorage.set('file-uri', assets[0].uri?.toString() || '');
                    console.log(
                        'Selected images:',
                        assets.map(a => a.uri),
                    );
                }
            }
        });
    }, []);

    const openCamera = useCallback(() => {
        const options: CameraOptions = {
            mediaType: 'photo',
            includeBase64: true,
        };
        launchCamera(options, (response: ImagePickerResponse) => {
            if (response.didCancel) {
                console.log('User cancelled camera');
                fileStorage.clearAll();
            } else if (response.errorCode) {
                console.log('Camera Error: ', response.errorMessage);
                fileStorage.clearAll();
            } else {
                const assets = response?.assets as Asset[];
                if (assets && assets.length > 0) {
                    setImgData(prev => {
                        const currentCount = prev.length;
                        const allowedCount = 4 - currentCount;
                        if (allowedCount <= 0) {
                            ToastAndroid.show('Maximum 4 images allowed', ToastAndroid.SHORT);
                            return prev;
                        }
                        const newAssets = assets.slice(0, allowedCount);
                        return [...prev, ...newAssets];
                    });
                    // Optionally store the first captured image's data
                    fileStorage.set('file-data', assets[0].base64?.toString() || '');
                    fileStorage.set('file-uri', assets[0].uri?.toString() || '');
                    console.log(
                        'Captured images:',
                        assets.map(a => a.uri),
                    );
                }
            }
        });
    }, []);

    const selectPhoto = useCallback(() => {
        Alert.alert('Upload Photo', 'Select an option', [
            { text: 'Take Photo', onPress: openCamera },
            { text: 'Choose from Gallery', onPress: openGallery },
            { text: 'Cancel', style: 'cancel' },
        ]);
    }, [openCamera, openGallery]);

    useEffect(() => {
        if (isFocused) {
            checkTokenExpiry();
        }
    }, [isFocused, formData1.projectId, formData1.progress]);

    const removeImage = useCallback((index: number) => {
        setImgData(prev => prev.filter((_, i) => i !== index));
    }, []);

    const removeAllImages = useCallback(() => {
        setImgData([]);
        fileStorage.delete('file-data');
        fileStorage.delete('file-uri');
    }, []);

    // Start Now its not working (Use for fixed the range of progress)
    // const fetchProgressRangeCap = async () => {
    //     const formData = new FormData();

    //     formData.append('project_id', formData1.projectId?.split(',')[1]);

    //     await axios
    //         .post(ADDRESSES.FETCH_PROJECT_RANGE, formData, {
    //             headers: {
    //                 'Content-Type': 'multipart/form-data',
    //                 // auth_key: AUTH_KEY,
    //                 'Authorization': `Bearer ` + loginTokenStore?.token
    //             },
    //         })
    //         .then(res => {
    //             if (res?.data?.status === 1) {
    //                 const [a, b] = getWorkRange(res?.data?.message) ?? [];
    //                 setCheckErr(formData1.progress < a || formData1.progress > b);
    //             }
    //         })
    //         .catch(err => {
    //             console.log('Project Ranges CAP ERRRR === ', err, 'fetchProgressRangeCap__');
    //             ToastAndroid.show(
    //                 'Some error occurred while fetching Project Ranges.',
    //                 ToastAndroid.SHORT,
    //             );
    //         });
    // };
    // End Now its not working (Use for fixed the range of progress)

    // useEffect(() => {
    //     fetchProgressRangeCap();
    // }, [formData1.projectId, formData1.progress, handleFormChange]);

    const updateProjectProgressDetails = useCallback(async (currentLocation: any) => {
        await axios
            .get(
                `https://maps.googleapis.com/maps/api/geocode/json?latlng=${currentLocation?.latitude},${currentLocation?.longitude}&key=${REVERSE_GEOENCODING_API_KEY}`,
            )
            .then(async (res) => {
                // setGeolocationFetchedAddress(res?.data?.results[0]?.formatted_address);

                setLoading(true);
                const formData = new FormData();
                formData.append('approval_no', formData1.projectId?.split(',')[0] || '');
                formData.append('progress_percent', formData1.progress);
                formData.append('progressive_percent', (Number(progressComplete) + Number(formData1.progress)).toString());
                // formData.append('lat', location?.latitude!);
                // formData.append('long', location.longitude!);
                formData.append('lat', currentLocation?.latitude!);
                formData.append('long', currentLocation.longitude!);

                formData.append('address', res?.data?.results[0]?.formatted_address);
                formData.append('actual_date_comp', dateFinal);
                formData.append('remarks', formData1.remarks);

                console.log(dateFinal, 'projectsprojectsprojectsprojectsprojects', formData);

                // Process each image to ensure its size is under 2MB (2 * 1024 * 1024 bytes)
                const processedImages = await Promise.all(
                    imgData.map(async (asset, index) => {
                        if (asset.fileSize && asset.fileSize > 2 * 1024 * 1024) {
                            // Reduce dimensions by 80% (adjust factor as needed)
                            const targetWidth = asset.width ? Math.round(asset.width * 0.8) : 800;
                            const targetHeight = asset.height
                                ? Math.round(asset.height * 0.8)
                                : 600;
                            try {
                                const resizedImage = await ImageResizer.createResizedImage(
                                    asset.uri!,
                                    targetWidth,
                                    targetHeight,
                                    'JPEG',
                                    80, // quality (0-100)
                                    0, // rotation
                                    null, // outputPath (null uses cache folder)
                                    true, // keepMeta
                                    {}, // options
                                );
                                return {
                                    ...asset,
                                    uri: resizedImage.uri,
                                    fileName:
                                        resizedImage.name ||
                                        asset.fileName ||
                                        `progress_pic_${index}.jpg`,
                                    type: 'image/jpeg',
                                };
                            } catch (err) {
                                console.log('Image resizing error', err);
                                return asset;
                            }
                        }
                        return asset;
                    }),
                );

                // Append processed images to formData
                processedImages.forEach((asset, index) => {
                    formData.append('progress_pic[]', {
                        uri: asset.uri!,
                        type: asset.type || 'image/jpeg',
                        name: asset.fileName || `progress_pic_${index}.jpg`,
                    } as any);
                });

                formData.append('created_by', loginStore?.user_id);

                await axios.post(`${ADDRESSES.PROJECT_PROGRESS_UPDATE}`, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        // "auth_key": AUTH_KEY
                        'Authorization': `Bearer ` + loginTokenStore?.token
                    }
                }).then(res => {
                    console.log("Response:", res?.data)
                    if (res?.data?.status === 1) {
                        Alert.alert("Approval Photo", "Approval project photo(s) uploaded successfully.")
                        removeAllImages()
                        setFormData1({
                            projectId: "",
                            progress: "",
                            latitude: "",
                            longitude: "",
                            locationAddress: "",
                            actual_date_comp: '',
                            remarks: "",
                        })
                        setProgressComplete(Number(0))
                        setFetchedProjectDetails(() => "")

                        loadLiveProjectList();
                    } else {
                        ToastAndroid.show("Sending details with photo error.", ToastAndroid.SHORT)
                    }
                }).catch(err => {
                    console.log("Response:", err)
                    console.log("Upload error:", err)
                })

                setLoading(false);

            });


    }, [formData1, imgData, loginStore, removeAllImages, handleFormChange]);
    // }, [formData1, imgData, loginStore, removeAllImages, handleFormChange]);

    const checkAndSubmit = async () => {
        try {
            const currentLocation = await GetLocation.getCurrentPosition({
                enableHighAccuracy: true,
                timeout: 60000,
            });

            console.log(currentLocation, ' : currentLocation', location, 'ddddddddddddd');

            Alert.alert(
                'Alert',
                'Are you sure you want to submit the details?',
                [
                    { text: strings.noTxt, onPress: () => null },
                    {
                        text: strings.yesTxt,
                        onPress: async () => {
                            await updateProjectProgressDetails(currentLocation);
                            // fetchGeoLocaltionAddress();
                        },
                    },
                ],
            );
        } catch (err) {
            console.log(err);
            // if (err.code === 'UNAVAILABLE') {
            // console.log(err.code, 'codeerror');
            if (typeof err === 'object' && err !== null && 'code' in err && (err as any).code === 'UNAVAILABLE') {
                console.log((err as any).code, 'codeerror');

                Alert.alert(
                    'Turn on Location',
                    'Please turn on GPS/location services to update progress.',
                    [
                        {
                            text: 'Go to Settings',
                            onPress: () => Linking.openSettings(),
                            style: 'default',
                        },
                        {
                            text: 'Cancel',
                            style: 'cancel',
                        },
                    ],
                );
            }
        }
    };

      const fetchLocalStorageProjects = async () => {
        try {

          const projectsData = projectSaveSpecificStorage.getString('projects');
          console.log(projectsData, '(:-projectsprojectsprojectsprojectsprojects');
          if (projectsData) {
            var parsedProjects = JSON.parse(projectsData);
            console.log(parsedProjects.length, '>>>', 'projectsprojectsprojectsprojectsprojects', maxSaveProjCount);

            if(parsedProjects.length > maxSaveProjCount) {
                Alert.alert(
                'Offline Limit Reached',
                `You’ve saved the maximum of ${maxSaveProjCount + 1} projects offline. Please connect to the internet to sync your data before adding new projects.`,
                [
                {
                text: 'OK',
                onPress: () => {
                // Nasted navigation to settings
                navigation.dispatch(
                CommonActions.navigate(
                navigationRoutes.settingsNavigation, { screen: navigationRoutes.settingsScreen }));
                },
                },
                ],
                { cancelable: false } // prevents closing without pressing OK
                );

            }

            // setProjects(parsedProjects);
          } else {
            // setProjects([]);
          }

          try {
          const projectsData_Date = projectSaveSpecificStorage.getString('projects_date');
          console.log(projectsData_Date, '-------projectsData_Date-------')
          if (projectsData_Date) {
            // const parsedProjects_Date = JSON.parse(projectsData_Date ?? '');
            const parsedProjects_Date = projectsData_Date ?? '';


            console.log(parsedProjects_Date, 'projectsprojectsprojectsprojectsprojects', parsedProjects, 'hhhhhh', JSON.stringify(nowDate.toISOString()));
            
            const parsedDateOnly = parsedProjects_Date.split('T')[0];
            const currentDateOnly = nowDate.toISOString().split('T')[0];
            console.log(parsedDateOnly, '__________mm__', currentDateOnly, 'kkk', nowDate.toISOString(), 'storeDate', parsedProjects_Date);
            

            if(parsedProjects.length > 0) {
                // Alert.alert(parsedProjects_Date > JSON.stringify(nowDate.toISOString()) ? 'New Day Detected' : 'Same Day Detected', `Projects saved on ${new Date(parsedProjects_Date).toLocaleDateString()}.`);
                if (parsedDateOnly < currentDateOnly) {
                Alert.alert(
                'Sync Needed',
                'New day detected. Please sync your saved projects before adding more.'
                );

                navigation.dispatch(
                CommonActions.navigate({
                  name: navigationRoutes.settingsNavigation,
                }),
              )

                }
            }
            

            // Alert.alert(parsedProjects_Date)
            // setProjectsDate(parsedProjects_Date);
          } else {
            // setProjectsDate('');
          }
        } catch (error) {
          console.log('Error fetching projects:', error);
        //   ToastAndroid.show('Error fetching saved projects.', ToastAndroid.SHORT);
        }


        } catch (error) {
          console.log('Error fetching projects:', error);
        //   ToastAndroid.show('Error fetching saved projects.', ToastAndroid.SHORT);
        }
      };

    


    useEffect(() => {
        // fetchProjects_Date()
        if (isFocused) {
        fetchLocalStorageProjects();
        }

      }, [isFocused]);


    const saveLocally = useCallback(async (currentLocation: any) => {

        if(isOnline) {
        setLoading(true);

        await axios
        .get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${currentLocation?.latitude},${currentLocation?.longitude}&key=${REVERSE_GEOENCODING_API_KEY}`,
        )
        .then(async (res) => {

            if (
            !formData1.projectId ||
            !formData1.progress ||
            (100 - progressComplete === parseInt(formData1.progress, 10)
                ? !formData1.remarks
                : false) ||
            (100 - progressComplete === parseInt(formData1.progress, 10) ? dateFinal.length == 0 : false) ||
            imgData.length === 0
        ) {
            ToastAndroid.show(
                'Please fill all fields and add at least one photo.',
                ToastAndroid.SHORT,
            );
            return;
        }
        try {
            let permanentUris: string[] = [];
            // Copy each selected image to a permanent location
            for (const asset of imgData) {

            const filename = asset.fileName || `progress_pic_${Date.now()}.jpg`;
            const newPath = `${RNFS.DocumentDirectoryPath}/${filename}`;
            await RNFS.copyFile(asset.uri!, newPath);
            // Ensure the URI has a file:// prefix
            const permanentUri = newPath.startsWith('file://')
            ? newPath
            : 'file://' + newPath;
            permanentUris.push(permanentUri);
            }

            // Retrieve existing projects from projectSaveSpecificStorage
            let storedProjects: any[] = [];

            const projectsData = await projectSaveSpecificStorage.getString('projects');
            
            console.log(projectsData, ' projectsData:-')

            if (projectsData) {
                storedProjects = JSON.parse(projectsData);
            }

            // Create a new project object with permanent image URIs
            const newProject: ProjectStoreModel = {
                approval_no: formData1.projectId?.split(',')[0],
                progress_percent: +formData1.progress,
                progressive_percent: (Number(progressComplete) + Number(formData1.progress)).toString(),
                lat: currentLocation?.latitude!,
                long: currentLocation?.longitude!,
                address: res?.data?.results[0]?.formatted_address,
                actual_date_comp: dateFinal,
                remarks: formData1.remarks,
                'progress_pic[]': permanentUris,
                created_by: loginStore?.user_id,
                
            };

            if (storedProjects.length == 0) {
                projectSaveSpecificStorage.set('projects_date', new Date().toISOString());
            }

            // storedProjects.push(newProject);
            const existingIndex = storedProjects.findIndex(
            (project) => project.approval_no === newProject.approval_no
            );

            if (existingIndex !== -1) {
            // If found, update the existing project
            storedProjects[existingIndex] = newProject;
            } else {
            // If not found, add as new project
            storedProjects.push(newProject);
            }

            // Save the updated projects list to projectSaveSpecificStorage
            projectSaveSpecificStorage.set('projects', JSON.stringify(storedProjects));
            fetchLocalStorageProjects()

            // const projectsString = await projectSaveSpecificStorage.getString('projects');
            // const projects = JSON.parse(projectsString ?? '{}')

            // const projectsDate = await projectSaveSpecificStorage.getString('projects_date');
            // const projectsDT = JSON.parse(projectsDate ?? '')

            console.log(projects, 'projectsprojectsprojectsprojectsprojects', projectsDate, 'submit');

            ToastAndroid.show('Project saved in device.', ToastAndroid.SHORT);
            removeAllImages();
            setFormData1({
                projectId: '',
                progress: '',
                latitude: '',
                longitude: '',
                locationAddress: '',
                // actual_date_comp: '',
                remarks: '',
                actual_date_comp: '',
            });
            setFetchedProjectDetails(() => '');
        } catch (err) {
            console.log('Error saving locally:', err);
            ToastAndroid.show('Error saving project locally.', ToastAndroid.SHORT);
        }

        // const formData = new FormData();
        // formData.append('address', res?.data?.results[0]?.formatted_address);


        setLoading(false);

        });

    } else {
        console.log(formData1.projectId, 'formData1projectId', progressComplete);
        
        if (
            !formData1.projectId ||
            !formData1.progress ||
            (100 - progressComplete === parseInt(formData1.progress, 10)
                ? !formData1.remarks
                : false) ||
            (100 - progressComplete === parseInt(formData1.progress, 10) ? dateFinal.length == 0 : false) ||
            imgData.length === 0
        ) {
            ToastAndroid.show(
                'Please fill all fields and add at least one photo.',
                ToastAndroid.SHORT,
            );
            return;
        }
        try {
            let permanentUris: string[] = [];
            // Copy each selected image to a permanent location
            for (const asset of imgData) {

            const filename = asset.fileName || `progress_pic_${Date.now()}.jpg`;
            const newPath = `${RNFS.DocumentDirectoryPath}/${filename}`;
            await RNFS.copyFile(asset.uri!, newPath);
            // Ensure the URI has a file:// prefix
            const permanentUri = newPath.startsWith('file://')
            ? newPath
            : 'file://' + newPath;
            permanentUris.push(permanentUri);
            }

            // Retrieve existing projects from projectSaveSpecificStorage
            let storedProjects: any[] = [];

            const projectsData = await projectSaveSpecificStorage.getString('projects');
            
            console.log(projectsData, ' projectsData:-')

            if (projectsData) {
                storedProjects = JSON.parse(projectsData);
            }

            // Create a new project object with permanent image URIs
            const newProject: ProjectStoreModel = {
                approval_no: formData1.projectId?.split(',')[0],
                progress_percent: +formData1.progress,
                progressive_percent: (Number(progressComplete) + Number(formData1.progress)).toString(),
                // lat: currentLocation?.latitude!,
                // long: currentLocation?.longitude!,
                lat: 0,
                long: 0,
                address: '',
                actual_date_comp: dateFinal,
                remarks: formData1.remarks,
                'progress_pic[]': permanentUris,
                created_by: loginStore?.user_id,
                
            };

            if (storedProjects.length == 0) {
                projectSaveSpecificStorage.set('projects_date', new Date().toISOString());
            }

            // storedProjects.push(newProject);
            const existingIndex = storedProjects.findIndex(
            (project) => project.approval_no === newProject.approval_no
            );

            if (existingIndex !== -1) {
            // If found, update the existing project
            storedProjects[existingIndex] = newProject;
            } else {
            // If not found, add as new project
            storedProjects.push(newProject);
            }

            // Save the updated projects list to projectSaveSpecificStorage
            projectSaveSpecificStorage.set('projects', JSON.stringify(storedProjects));
            fetchLocalStorageProjects()

            // const projectsString = await projectSaveSpecificStorage.getString('projects');
            // const projects = JSON.parse(projectsString ?? '{}')

            // const projectsDate = await projectSaveSpecificStorage.getString('projects_date');
            // const projectsDT = JSON.parse(projectsDate ?? '')

            console.log(projects, 'projectsprojectsprojectsprojectsprojects', projectsDate, 'submit');

            ToastAndroid.show('Project saved in device.', ToastAndroid.SHORT);
            removeAllImages();
            setFormData1({
                projectId: '',
                progress: '',
                latitude: '',
                longitude: '',
                locationAddress: '',
                // actual_date_comp: '',
                remarks: '',
                actual_date_comp: '',
            });
            setFetchedProjectDetails(() => '');
        } catch (err) {
            console.log('Error saving locally:', err);
            ToastAndroid.show('Error saving project locally.', ToastAndroid.SHORT);
        }
    }

        
    }, [formData1, imgData, removeAllImages]);

    const checkLocalAndSubmit = async () => {
        try {
            const currentLocation = await GetLocation.getCurrentPosition({
                enableHighAccuracy: true,
                timeout: 60000,
            });

            console.log(currentLocation, ' : currentLocation', location, 'ddddddddddddd');

            Alert.alert(
                'Alert',
                'Are you sure you want to submit the details?',
                [
                    { text: strings.noTxt, onPress: () => null },
                    {
                        text: strings.yesTxt,
                        onPress: async () => {
                            await saveLocally(currentLocation);
                            // fetchGeoLocaltionAddress();
                        },
                    },
                ],
            );
        } catch (err) {
            console.log(err);
            // if (err.code === 'UNAVAILABLE') {
            // console.log(err.code, 'codeerror');
            if (typeof err === 'object' && err !== null && 'code' in err && (err as any).code === 'UNAVAILABLE') {
                console.log((err as any).code, 'codeerror');

                Alert.alert(
                    'Turn on Location',
                    'Please turn on GPS/location services to update progress.',
                    [
                        {
                            text: 'Go to Settings',
                            onPress: () => Linking.openSettings(),
                            style: 'default',
                        },
                        {
                            text: 'Cancel',
                            style: 'cancel',
                        },
                    ],
                );
            }
        }
    };

    const onRefresh = () => {
        setRefreshing(true);

        fetchProjectsList();
        setImgData([]);
        fileStorage.delete('file-data');
        fileStorage.delete('file-uri');
        setFetchedProjectDetails(() => '');

        setTimeout(() => {
            setRefreshing(false);
            ToastAndroid.show('Home Refreshed.', ToastAndroid.SHORT);
        }, 2000);
    };

    const getWorkRange = (projectRangeCaps: any[]) => {
        if (!fetchedProjectDetails) return null;

        const projectDetails = JSON.parse(fetchedProjectDetails);
        const progImgLength = projectDetails?.prog_img?.length || 0;
        const nextVisitNo = (progImgLength + 1).toString();
        const rangeObj = projectRangeCaps?.find(
            item => +item?.visit_no === +nextVisitNo,
        );

        if (!rangeObj) return null;
        const { work_per_st, work_per_end } = rangeObj;
        return [work_per_st, work_per_end];
    };


    

    useEffect(() => {
        // && isFocused
        if (isOnline) {
            console.log('isOnline', isOnline, 'isFocused', isFocused);
            loadLiveProjectList();
            fetchProjectsList()
        }
        else{
            console.log('isOffline', !isOnline, 'isFocused', isFocused);

            fetchProjectsList()
        }

        
    }, [isOnline, isFocused]);
    


    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView
                keyboardShouldPersistTaps="handled"
                style={{ backgroundColor: theme.colors.background }}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }>
                <Header />
                {/* <Spin
                indicator={<LoadingOutlined spin />}
                size="large"
                className="text-gray-500 dark:text-gray-400"
                spinning={loading}
                ></Spin> */}

                {/* <ActivityIndicator size="small" color="#6200ee" /> */}

                <View style={{ padding: 30, gap: 5, flex: 1}}>

                

                    {/* <Text variant="titleLarge" style={{ color: theme.colors.secondary }}>
                        {strings.projectDropdownLabel}

                       {JSON.stringify(isOnline, null, 2)}
                    </Text> */}
                    <Dropdown
                        mode='auto'
                        // disable={!location?.latitude || !location?.longitude}
                        style={[
                            styles.dropdown,
                            {
                                width: '100%',
                                borderColor: theme.colors.secondary,
                                backgroundColor: theme.colors.secondaryContainer,
                            },
                        ]}
                        placeholderStyle={[
                            styles.placeholderStyle,
                            { color: theme.colors.onBackground },
                        ]}
                        selectedTextStyle={[
                            styles.selectedTextStyle,
                            { color: theme.colors.primary },
                        ]}
                        inputSearchStyle={[styles.inputSearchStyle, { borderRadius: 10 }]}
                        containerStyle={{ alignSelf: 'auto', borderRadius: 10 }}
                        iconStyle={styles.iconStyle}
                        data={projectsList}
                        search
                        maxHeight={550}
                        labelField="label"
                        valueField="value"
                        placeholder="Choose Project"
                        searchPlaceholder="Search Project..."
                        value={formData1?.projectId}
                        onChange={item => {
                            // console.log('Selected project:', item?.value.split(',')[0]);
                            handleFormChange('projectId', item?.value);
                            fetchProgressDone(item?.value.split(',')[0]);
                            handleFormChange('progress', '');
                            handleFormChange('remarks', '');
                            setDateFinal('')

                        }}
                        renderLeftIcon={() => <Icon size={25} source={'creation'} />}

                    />


                    {/* {JSON.stringify(fetchedProjectDetails.length, null, 2)} */}
                    {isOnline && (
                        <ButtonPaper
                        icon={'cloud-search-outline'}
                        mode="contained"
                        onPress={async () => await fetchProjectDetails()}
                        style={{ marginTop: 15, paddingVertical: 8 }}
                        disabled={!formData1.projectId || loading}
                        loading={loading}>
                        {strings.fetchProgress}
                        </ButtonPaper>
                    )}
                    

                    
                    {/* <view><text>{JSON.stringify(fetchedProjectDetails ? fetchedProjectDetails : '', null, 2)}</text></view> */}
                    {fetchDataDetails && (
                    <>
                    {fetchedProjectDetails && (
                        <View
                            style={{
                                paddingVertical: 5,
                            }}>
                            <Text variant="titleLarge">Project Details</Text>
                            {/* <InputPaper
                                label="District"
                                leftIcon="map-marker-radius-outline"
                                keyboardType="default"
                                value={
                                    fetchedProjectDetails &&
                                    JSON.parse(fetchedProjectDetails)?.message[0]?.dist_name
                                }
                                onChangeText={(txt: any) => handleFormChange('dist_name', txt)}
                                customStyle={{
                                    backgroundColor: theme.colors.background,
                                    marginTop: 10,
                                }}
                                disabled
                            /> */}
                            {/* <InputPaper
                                label="Block"
                                leftIcon="map-legend"
                                keyboardType="default"
                                value={
                                    fetchedProjectDetails &&
                                    JSON.parse(fetchedProjectDetails)?.message[0]?.block_name
                                }
                                onChangeText={(txt: any) => handleFormChange('block_name', txt)}
                                customStyle={{
                                    backgroundColor: theme.colors.background,
                                    marginTop: 10,
                                }}
                                disabled
                            /> */}
                            <InputPaper
                                label="Scheme"
                                leftIcon="file-document-outline"
                                keyboardType="default"
                                value={
                                    fetchedProjectDetails &&
                                    JSON.parse(fetchedProjectDetails)?.message[0]?.scheme_name
                                }
                                onChangeText={(txt: any) =>
                                    handleFormChange('scheme_name', txt)
                                }
                                customStyle={{
                                    backgroundColor: theme.colors.background,
                                    marginTop: 10,
                                }}
                                disabled
                                multiline
                            />
                            <InputPaper
                                label="Sector"
                                leftIcon="developer-board"
                                keyboardType="default"
                                value={
                                    fetchedProjectDetails &&
                                    JSON.parse(fetchedProjectDetails)?.message[0]?.sector_name
                                }
                                onChangeText={(txt: any) =>
                                    handleFormChange('sector_name', txt)
                                }
                                customStyle={{
                                    backgroundColor: theme.colors.background,
                                    marginTop: 10,
                                }}
                                disabled
                            />
                            <ProjectGrid fetchedProjectDetails={fetchedProjectDetails} />
                        </View>
                    )}
                    </>
                    )}






                    <View style={{ marginVertical: 10, marginBottom: 0 }}>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 0 }}>
                            <Text style={{ color: theme.colors.primary, fontWeight: 'bold' }}>
                                {Number(progressComplete)}% {strings.complete}
                            </Text>
                            <Text style={{ color: theme.colors.primary, fontWeight: 'bold' }}>
                                {strings.current_prg} {Number(progressComplete) + Number(formData1.progress)}%
                            </Text>
                        </View>

                        {Number(progressComplete) + Number(formData1.progress) > 100 && (
                            <Text
                                style={{
                                    color: theme.colors.error,
                                    fontWeight: 'bold',
                                    marginBottom: 5,
                                }}>
                                Don't exceed {100}% & not less than {progressComplete}%
                            </Text>
                        )}


                        <ProgressBar
                            progress={progressComplete / 100 + Number(formData1.progress) / 100}
                            color={theme.colors.primary}
                            style={{ height: 12, borderRadius: 6 }}
                        />

                    </View>

                    {formData1.projectId && (
                        <>


                            <InputPaper
                                // error={checkErr}
                                label="Project Progress..."
                                maxLength={100}
                                leftIcon="progress-clock"
                                keyboardType="number-pad"
                                value={formData1.progress}
                                // onChangeText={(txt: any) => handleFormChange("progress", txt)}
                                onChangeText={(txt: any) => {
                                    const cleanedText = txt.replace(/[.,]/g, '');
                                    handleFormChange('remarks', '');
                                    setDateFinal('')
                                    // handleFormChange('date', '');
                                    let num = parseInt(cleanedText, 10);
                                    handleFormChange('progress', cleanedText);
                                }}

                                customStyle={{ backgroundColor: theme.colors.background }}
                            />
                        </>
                    )}

                    {100 - Number(progressComplete) === Number(formData1.progress) && (
                        <>
                            <TextInput
                                // error={checkErr}
                                label="Remarks..."
                                maxLength={100}
                                value={formData1.remarks}
                                onChangeText={(txt: any) => handleFormChange('remarks', txt)}
                                // disabled={progressComplet === 100}
                                style={{ backgroundColor: theme.colors.background }}
                            />


                            <ButtonPaper
                                icon={'calendar-month-outline'}
                                mode="contained"
                                buttonColor={theme.colors.tertiary}
                                onPress={() => setOpenDate(true)}
                                // style={{ marginTop: 15, paddingVertical: 8}}
                                style={{ marginTop: 15, paddingVertical: 8, backgroundColor: theme.colors.primary, }}
                                disabled={!formData1.projectId}>
                                {strings.dateText}  {dateFinal}
                            </ButtonPaper>

                            <DatePicker
                                modal
                                mode="date"
                                open={openDate}
                                date={new Date()}
                                onConfirm={date => {
                                    setOpenDate(false);
                                    handleFormChange('date', date);
                                    console.log(date.toISOString().split('T')[0], 'datedatedate');
                                    setDateFinal(date.toISOString().split('T')[0])
                                }}
                                onCancel={() => {
                                    setOpenDate(false);
                                    setDateFinal('')
                                }}
                            />



                        </>
                    )}



                    <ButtonPaper
                        icon={'camera'}
                        mode="contained"
                        onPress={selectPhoto}
                        style={{ marginTop: 15, paddingVertical: 8 }}
                        disabled={!formData1.projectId}>
                        {strings.uploadPhotoBtnLabel}
                    </ButtonPaper>
                    <Text
                        variant="bodySmall"
                        style={{
                            color: theme.colors.onBackground,
                            fontFamily: strings.fontItalic,
                        }}>
                        {strings.uploadPhotoBtnSubText}
                    </Text>

                    {imgData.length > 0 && (
                        <ScrollView horizontal style={{ marginTop: 15 }}>
                            {imgData.map((asset, index) => (
                                <View
                                    key={asset.uri || index}
                                    style={{ marginRight: 10, position: 'relative' }}>
                                    <Image
                                        source={{ uri: asset.uri! }}
                                        style={styles.image}
                                        resizeMode="contain"
                                    />
                                    <TouchableOpacity
                                        onPress={() => removeImage(index)}
                                        style={[
                                            styles.removeIconContainer,
                                            { backgroundColor: theme.colors.errorContainer },
                                        ]}>
                                        <Icon
                                            size={20}
                                            color={theme.colors.onErrorContainer}
                                            source={'trash-can-outline'}
                                        />
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </ScrollView>
                    )}

                    {isOnline ? (
                    <ButtonPaper
                        icon={'progress-clock'}
                        mode="outlined"
                        onPress={() => checkAndSubmit()}
                        style={{ marginTop: 15, paddingVertical: 8 }}
                        loading={loading}
                        disabled={
                            !formData1.progress ||
                                !formData1.projectId ||
                                loading ||
                                // checkErr ||
                                imgData?.length === 0 ||
                                Number(formData1.progress) < 1 ? true : false ||
                                (Number(progressComplete) + Number(formData1.progress) >= 100 &&
                                    Number(formData1.progress) + Number(progressComplete) > progressCompleteAPI
                                    ? !formData1.remarks
                                    : false) ||
                            (Number(progressComplete) + Number(formData1.progress) >= 100 &&
                                Number(formData1.progress) + Number(progressComplete) > progressCompleteAPI
                                ? dateFinal.length == 0
                                : false)
                        }
                    >
                        Update Progress
                    </ButtonPaper>
                    ):(
                      <ButtonPaper
                        icon={'content-save-outline'}
                        mode="contained"
                        buttonColor={theme.colors.tertiary}
                        onPress={() => checkLocalAndSubmit()}
                        // onPress={() => {
                        //     Alert.alert(
                        //         'Alert',
                        //         'Are you sure you want to save the details?',
                        //         [
                        //             { text: strings.noTxt, onPress: () => null },
                        //             { text: strings.yesTxt, onPress: () => saveLocally() },
                        //         ],
                        //     );
                        // }}

                        style={{ marginTop: 15, paddingVertical: 8 }}
                        // disabled={
                        //     imgData?.length === 0 ||
                        //     !formData1.progress ||
                        //     !formData1.projectId ||
                        //     !location.latitude ||
                        //     !location.longitude ||
                        //     (Number(progressComplete) + Number(formData1.progress) >= 100 && Number(formData1.progress) + Number(progressComplete) > progressCompleteAPI
                        //         ? !formData1.remarks
                        //         : false) ||
                        //     (Number(progressComplete) + Number(formData1.progress) >= 100 && Number(formData1.progress) + Number(progressComplete) > progressCompleteAPI ? dateFinal.length == 0 : false) ||
                        //     !geolocationFetchedAddress
                        // }

                        disabled={
                            !formData1.progress ||
                                !formData1.projectId ||
                                loading ||
                                // checkErr ||
                                imgData?.length === 0 ||
                                Number(formData1.progress) < 1 ? true : false ||
                                (Number(progressComplete) + Number(formData1.progress) >= 100 &&
                                    Number(formData1.progress) + Number(progressComplete) > progressCompleteAPI
                                    ? !formData1.remarks
                                    : false) ||
                            (Number(progressComplete) + Number(formData1.progress) >= 100 &&
                                Number(formData1.progress) + Number(progressComplete) > progressCompleteAPI
                                ? dateFinal.length == 0
                                : false)
                        }

                        >
                        {strings.saveText}
                    </ButtonPaper>
                    )}
                    

                    
                </View>
                
            </ScrollView>
        </SafeAreaView>
    );
};

export default HomeScreen;

const styles = StyleSheet.create({
    dropdown: {
        minHeight: 100,
        maxHeight: 100,
        alignSelf: 'center',
        paddingHorizontal: 30,
        borderRadius: 20,
        borderWidth: 1,
        marginTop: 5,
    },
    placeholderStyle: {
        fontSize: 16,
        marginLeft: 16,
        fontFamily: strings.fontName,
    },
    selectedTextStyle: {
        fontSize: 16,
        marginLeft: 16,
        fontFamily: strings.fontName,
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
        fontFamily: strings.fontName,
    },
    image: {
        width: 100,
        height: 100,
        borderWidth: 1,
        borderRadius: 10,
    },
    removeIconContainer: {
        position: 'absolute',
        top: 2,
        right: 2,
        backgroundColor: 'rgba(255,255,255,0.7)',
        borderRadius: 15,
        padding: 2,
    },

    // container: {
    //     flex: 1,
    //     justifyContent: "center",
    //     alignItems: "center",
    // },
    // openButton: {
    //     padding: 10,
    //     backgroundColor: "#007bff",
    //     borderRadius: 5,
    // },
    // buttonText: {
    //     color: "#fff",
    //     fontSize: 16,
    // },
    // modalContainer: {
    //     flex: 1,
    //     justifyContent: "center",
    //     alignItems: "center",
    //     backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
    //     zIndex: 1000,
    // },
    // modalContent: {
    //     backgroundColor: "#fff",
    //     padding: 20,
    //     borderRadius: 10,
    // },
});
