import React, { useEffect, useState, useCallback, useMemo } from 'react'
import { Alert, Image, ScrollView, StyleSheet, ToastAndroid, View, TouchableOpacity, RefreshControl, Linking } from 'react-native'
import { Icon, Text } from 'react-native-paper'
import { SafeAreaView } from 'react-native-safe-area-context'
import { usePaperColorScheme } from '../../theme/theme'
import { homeScreenStrings } from '../../constants/strings'
import useGeoLocation from '../../hooks/useGeoLocation'
import { Dropdown } from 'react-native-element-dropdown'
import ButtonPaper from '../../components/ButtonPaper'
import InputPaper from '../../components/InputPaper'
import Header from '../../components/Header'
import { fileStorage, loginStorage, projectStorage } from '../../storage/appStorage'
// @ts-ignore
import { AUTH_KEY } from "@env"
import { ADDRESSES } from '../../config/api_list'
import axios from 'axios'
import { CommonActions, useNavigation } from '@react-navigation/native'
import {
    Asset,
    ImageLibraryOptions,
    ImagePickerResponse,
    launchImageLibrary,
    launchCamera,
    CameraOptions
} from "react-native-image-picker"
import ImageResizer from '@bam.tech/react-native-image-resizer';
import RNFS from 'react-native-fs';
import { ProjectStoreModel } from '../../models/global_models'

const strings = homeScreenStrings.getStrings()

const HomeScreen = () => {
    const navigation = useNavigation()
    const theme = usePaperColorScheme()
    const { location, error } = useGeoLocation()
    const [geolocationFetchedAddress, setGeolocationFetchedAddress] = useState(() => "")

    // Memoize loginStore so it doesn't change on every render
    const loginStore = useMemo(() => JSON.parse(loginStorage?.getString("login-data") ?? "{}"), [])

    const [refreshing, setRefreshing] = useState(() => false)
    const [imgData, setImgData] = useState<Asset[]>([])
    const [projectsList, setProjectsList] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    const [fetchedProjectDetails, setFetchedProjectDetails] = useState(() => "")
    // Set projectId to null instead of "" to indicate no selection
    const [formData1, setFormData1] = useState({
        projectId: null as string | null,
        progress: "",
        latitude: "",
        longitude: "",
        locationAddress: "",
    })

    console.log("LOCATION: ", location)

    const handleFormChange = useCallback((field: string, value: any) => {
        setFormData1(prev => ({
            ...prev,
            [field]: value,
        }))
    }, [])

    useEffect(() => {
        if (error) {
            Alert.alert("Turn on Location", "Give access to Location or Turn on GPS from app settings.", [{
                text: "Go to Settings",
                onPress: () => { navigation.dispatch(CommonActions.goBack()); Linking.openSettings() }
            }])
        }
    }, [error])

    const fetchGeoLocaltionAddress = async () => {
        console.log("REVERSE GEO ENCODING API CALLING...")
        await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${location?.latitude},${location?.longitude}&key=AIzaSyAhSuw5-ThQnJTZCGC4e_oBsL1iIUbJxts`).then(res => {
            setGeolocationFetchedAddress(res?.data?.results[0]?.formatted_address)
        })
    }

    // to be enabled later...
    useEffect(() => {
        if (location?.latitude && location.longitude) {
            fetchGeoLocaltionAddress()
        }
    }, [location])

    const fetchProjectsList = useCallback(async () => {
        setLoading(true)
        const formData = new FormData()
        formData.append('', null)

        try {
            const res = await axios.post(`${ADDRESSES.FETCH_PROJECTS_LIST}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    "auth_key": AUTH_KEY
                }
            })
            if (res?.data?.status === 1) {
                console.log("PROJECTS : ", res?.data)
                const newProjectsList = res?.data?.message?.map((item: any) => ({
                    label: `${item?.project_id} / ${item?.approval_no}\n${item?.scheme_name}`,
                    value: item?.approval_no
                }))
                setProjectsList(newProjectsList)
            } else {
                ToastAndroid.show("Projects fetch error.", ToastAndroid.SHORT)
            }
        } catch (err) {
            console.log("ERR PROJ", err)
            ToastAndroid.show("Some error occurred while fetching projects.", ToastAndroid.SHORT)
        }
        setLoading(false)
    }, [])

    useEffect(() => {
        fetchProjectsList()
    }, [fetchProjectsList])

    const fetchProjectDetails = async () => {
        setLoading(true)
        const formData = new FormData()
        formData.append('approval_no', formData1?.projectId)

        try {
            const res = await axios.post(`${ADDRESSES.FETCH_PROJECT_PROCESS}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    "auth_key": AUTH_KEY
                }
            })
            if (res?.data?.status === 1) {
                console.log("PROJECT DTLS : ", res?.data)
                // const newProjectsList = res?.data?.message?.map((item: any) => ({
                //     label: `${item?.project_id} / ${item?.approval_no}\n${item?.scheme_name}`,
                //     value: item?.approval_no
                // }))
                // setProjectsList(newProjectsList)
                setFetchedProjectDetails(JSON.stringify(res?.data))
            } else {
                ToastAndroid.show("Project details fetch error.", ToastAndroid.SHORT)
            }
        } catch (err) {
            console.log("ERR PROJ DTLS", err)
            ToastAndroid.show("Some error occurred while fetching project details.", ToastAndroid.SHORT)
        }
        setLoading(false)
    }

    const openGallery = useCallback(() => {
        const options: ImageLibraryOptions = {
            mediaType: "photo",
            includeBase64: true,
            selectionLimit: 4,
        }

        launchImageLibrary(options, (response: ImagePickerResponse) => {
            if (response.didCancel) {
                console.log("User cancelled image picker")
                fileStorage.clearAll()
            } else if (response.errorCode) {
                console.log("ImagePicker Error: ", response.errorMessage)
                fileStorage.clearAll()
            } else {
                const assets = response?.assets as Asset[]
                if (assets && assets.length > 0) {
                    setImgData(prev => {
                        const currentCount = prev.length
                        const allowedCount = 4 - currentCount
                        if (allowedCount <= 0) {
                            ToastAndroid.show("Maximum 4 images allowed", ToastAndroid.SHORT)
                            return prev
                        }
                        const newAssets = assets.slice(0, allowedCount)
                        return [...prev, ...newAssets]
                    })

                    fileStorage.set("file-data", assets[0].base64?.toString() || "")
                    fileStorage.set("file-uri", assets[0].uri?.toString() || "")
                    console.log("Selected images:", assets.map(a => a.uri))
                }
            }
        })
    }, [])

    const openCamera = useCallback(() => {
        const options: CameraOptions = {
            mediaType: "photo",
            includeBase64: true,
        }
        launchCamera(options, (response: ImagePickerResponse) => {
            if (response.didCancel) {
                console.log("User cancelled camera")
                fileStorage.clearAll()
            } else if (response.errorCode) {
                console.log("Camera Error: ", response.errorMessage)
                fileStorage.clearAll()
            } else {
                const assets = response?.assets as Asset[]
                if (assets && assets.length > 0) {
                    setImgData(prev => {
                        const currentCount = prev.length
                        const allowedCount = 4 - currentCount
                        if (allowedCount <= 0) {
                            ToastAndroid.show("Maximum 4 images allowed", ToastAndroid.SHORT)
                            return prev
                        }
                        const newAssets = assets.slice(0, allowedCount)
                        return [...prev, ...newAssets]
                    })
                    // Optionally store the first captured image's data
                    fileStorage.set("file-data", assets[0].base64?.toString() || "")
                    fileStorage.set("file-uri", assets[0].uri?.toString() || "")
                    console.log("Captured images:", assets.map(a => a.uri))
                }
            }
        })
    }, [])

    const selectLogo = useCallback(() => {
        Alert.alert(
            "Upload Photo",
            "Select an option",
            [
                { text: "Take Photo", onPress: openCamera },
                { text: "Choose from Gallery", onPress: openGallery },
                { text: "Cancel", style: "cancel" }
            ]
        )
    }, [openCamera, openGallery])

    const removeImage = useCallback((index: number) => {
        setImgData(prev => prev.filter((_, i) => i !== index))
    }, [])

    const removeAllImages = useCallback(() => {
        setImgData([])
        fileStorage.delete("file-data")
        fileStorage.delete("file-uri")
    }, [])

    const updateProjectProgressDetails = useCallback(async () => {
        setLoading(true)
        const formData = new FormData()
        formData.append('approval_no', formData1.projectId || '')
        formData.append('progress_percent', formData1.progress)
        formData.append('lat', location?.latitude!)
        formData.append('long', location.longitude!)
        formData.append('address', geolocationFetchedAddress)

        console.log("FORM DATA UPDATE ", formData)

        // Process each image to ensure its size is under 2MB (2 * 1024 * 1024 bytes)
        const processedImages = await Promise.all(
            imgData.map(async (asset, index) => {
                if (asset.fileSize && asset.fileSize > 2 * 1024 * 1024) {
                    // Reduce dimensions by 80% (adjust factor as needed)
                    const targetWidth = asset.width ? Math.round(asset.width * 0.8) : 800
                    const targetHeight = asset.height ? Math.round(asset.height * 0.8) : 600
                    try {
                        const resizedImage = await ImageResizer.createResizedImage(
                            asset.uri!,
                            targetWidth,
                            targetHeight,
                            "JPEG",
                            80,       // quality (0-100)
                            0,        // rotation
                            null,     // outputPath (null uses cache folder)
                            true,    // keepMeta
                            {}        // options
                        )
                        return {
                            ...asset,
                            uri: resizedImage.uri,
                            fileName: resizedImage.name || asset.fileName || `progress_pic_${index}.jpg`,
                            type: "image/jpeg"
                        }
                    } catch (err) {
                        console.log("Image resizing error", err)
                        return asset
                    }
                }
                return asset
            })
        )

        // Append processed images to formData
        processedImages.forEach((asset, index) => {
            formData.append("progress_pic[]", {
                uri: asset.uri!,
                type: asset.type || "image/jpeg",
                name: asset.fileName || `progress_pic_${index}.jpg`,
            } as any)
        })

        formData.append('created_by', loginStore?.user_id)

        await axios.post(`${ADDRESSES.PROJECT_PROGRESS_UPDATE}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                "auth_key": AUTH_KEY
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
                    locationAddress: ""
                })
                setFetchedProjectDetails(() => "")
            } else {
                ToastAndroid.show("Sending details with photo error.", ToastAndroid.SHORT)
            }
        }).catch(err => {
            console.log("Upload error:", err)
        })

        setLoading(false)
    }, [formData1, imgData, loginStore, removeAllImages, handleFormChange])

    const saveLocally = useCallback(async () => {
        if (!formData1.projectId || !formData1.progress || imgData.length === 0) {
            ToastAndroid.show("Please fill all fields and add at least one photo.", ToastAndroid.SHORT)
            return;
        }
        try {
            let permanentUris: string[] = [];
            // Copy each selected image to a permanent location
            for (const asset of imgData) {
                const filename = asset.fileName || `progress_pic_${Date.now()}.jpg`;
                const newPath = `${RNFS.DocumentDirectoryPath}/${filename}`;
                // Copy file from temporary URI to DocumentDirectoryPath (permanent storage)
                await RNFS.copyFile(asset.uri!, newPath);
                // Ensure the URI has a file:// prefix
                const permanentUri = newPath.startsWith("file://") ? newPath : "file://" + newPath;
                permanentUris.push(permanentUri);
            }

            // Retrieve existing projects from projectStorage
            let storedProjects: any[] = [];
            const projectsData = await projectStorage.getString("projects");
            if (projectsData) {
                storedProjects = JSON.parse(projectsData);
            }

            // Create a new project object with permanent image URIs
            const newProject: ProjectStoreModel = {
                projectId: formData1.projectId,
                progress: +formData1.progress,
                "progress_pic[]": permanentUris,
                lat: location?.latitude!,
                lng: location.longitude!,
                locationAddress: geolocationFetchedAddress
            };

            storedProjects.push(newProject);

            // Save the updated projects list to projectStorage
            await projectStorage.set("projects", JSON.stringify(storedProjects));

            ToastAndroid.show("Project saved in device.", ToastAndroid.SHORT);
            removeAllImages();
            setFormData1({
                projectId: "",
                progress: "",
                latitude: "",
                longitude: "",
                locationAddress: ""
            });
            setFetchedProjectDetails(() => "");
        } catch (err) {
            console.log("Error saving locally:", err);
            ToastAndroid.show("Error saving project locally.", ToastAndroid.SHORT);
        }
    }, [formData1, imgData, removeAllImages])

    const onRefresh = () => {
        setRefreshing(true)

        fetchProjectsList()
        setImgData([])
        fileStorage.delete("file-data")
        fileStorage.delete("file-uri")
        setFetchedProjectDetails(() => "")

        setTimeout(() => {
            setRefreshing(false)
            ToastAndroid.show("Home Refreshed.", ToastAndroid.SHORT)
        }, 2000)
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView keyboardShouldPersistTaps='handled' style={{ backgroundColor: theme.colors.background }} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
                <Header />
                <View style={{ padding: 30, gap: 5, flex: 1 }}>
                    <Text variant='titleLarge' style={{ color: theme.colors.secondary }}>
                        {strings.projectDropdownLabel}
                    </Text>
                    <Dropdown
                        style={[styles.dropdown, { width: '100%', borderColor: theme.colors.secondary, backgroundColor: theme.colors.secondaryContainer }]}
                        placeholderStyle={[styles.placeholderStyle, { color: theme.colors.onBackground }]}
                        selectedTextStyle={[styles.selectedTextStyle, { color: theme.colors.primary }]}
                        inputSearchStyle={[styles.inputSearchStyle, { borderRadius: 10 }]}
                        containerStyle={{ alignSelf: "auto", borderRadius: 10 }}
                        iconStyle={styles.iconStyle}
                        data={projectsList}
                        search
                        maxHeight={300}
                        labelField="label"
                        valueField="value"
                        placeholder="Choose Project"
                        searchPlaceholder="Search Project..."
                        value={formData1?.projectId}
                        onChange={item => {
                            console.log("Selected project:", item)
                            handleFormChange("projectId", item?.value)
                        }}
                        renderLeftIcon={() => (
                            <Icon size={25} source={"creation"} />
                        )}
                    />
                    <ButtonPaper
                        icon={"cloud-search-outline"}
                        mode='contained'
                        onPress={async () => await fetchProjectDetails()}
                        style={{ marginTop: 15, paddingVertical: 8 }}
                        disabled={!formData1.projectId || loading}
                        loading={loading}
                    >
                        {strings.fetchProgress}
                    </ButtonPaper>


                    {fetchedProjectDetails &&
                        <View style={{
                            paddingVertical: 5
                        }}>
                            <Text variant='titleLarge'>Project Details</Text>
                            <InputPaper
                                label="District"
                                leftIcon='map-marker-radius-outline'
                                keyboardType="default"
                                value={fetchedProjectDetails && JSON.parse(fetchedProjectDetails)?.message[0]?.dist_name}
                                onChangeText={(txt: any) => handleFormChange("dist_name", txt)}
                                customStyle={{ backgroundColor: theme.colors.background, marginTop: 10 }}
                                disabled
                            />
                            <InputPaper
                                label="Block"
                                leftIcon='map-legend'
                                keyboardType="default"
                                value={fetchedProjectDetails && JSON.parse(fetchedProjectDetails)?.message[0]?.block_name}
                                onChangeText={(txt: any) => handleFormChange("block_name", txt)}
                                customStyle={{ backgroundColor: theme.colors.background, marginTop: 10 }}
                                disabled
                            />
                            <InputPaper
                                label="Scheme"
                                leftIcon='file-document-outline'
                                keyboardType="default"
                                value={fetchedProjectDetails && JSON.parse(fetchedProjectDetails)?.message[0]?.scheme_name}
                                onChangeText={(txt: any) => handleFormChange("scheme_name", txt)}
                                customStyle={{ backgroundColor: theme.colors.background, marginTop: 10 }}
                                disabled
                            />
                            <InputPaper
                                label="Sector"
                                leftIcon='developer-board'
                                keyboardType="default"
                                value={fetchedProjectDetails && JSON.parse(fetchedProjectDetails)?.message[0]?.sector_name}
                                onChangeText={(txt: any) => handleFormChange("sector_name", txt)}
                                customStyle={{ backgroundColor: theme.colors.background, marginTop: 10 }}
                                disabled
                            />

                            {/* {
                                fetchedProjectDetails && JSON.parse(fetchedProjectDetails)?.prog_img?.map((item: any, idx: any) => (
                                    <View key={idx} style={{
                                        padding: 10,
                                        borderWidth: 0.8,
                                        borderRadius: 10,
                                        borderColor: theme.colors.onBackground,
                                        marginTop: 15,
                                        borderStyle: "dashed"
                                    }}>
                                        <Text>Visit No.: {item?.visit_no}</Text>
                                        <Text>Approval No.: {item?.approval_no}</Text>
                                        <Text>Progress Percent: {item?.progress_percent}%</Text>
                                    </View>
                                ))
                            } */}

                            {
                                fetchedProjectDetails && (() => {
                                    const projectData = JSON.parse(fetchedProjectDetails);
                                    const baseURL = "https://pup.opentech4u.co.in/pup/";

                                    return projectData.prog_img.map((item: any, idx: number) => {
                                        // Parse the pic_path string into an array of image filenames.
                                        let images = [];
                                        try {
                                            images = JSON.parse(item.pic_path);
                                        } catch (error) {
                                            console.error("Error parsing pic_path for item:", item, error);
                                        }

                                        return (
                                            <View
                                                key={idx}
                                                style={{
                                                    flexDirection: "row",
                                                    alignItems: "center",
                                                    padding: 10,
                                                    borderWidth: 0.8,
                                                    borderRadius: 10,
                                                    borderColor: theme.colors.onBackground,
                                                    marginTop: 15,
                                                    borderStyle: "dashed",
                                                }}
                                            >
                                                {/* Left Side: Text Details */}
                                                <View style={{ flex: 1 }}>
                                                    <Text>Visit No.: {item?.visit_no}</Text>
                                                    <Text>Approval No.: {item?.approval_no}</Text>
                                                    <Text>Progress Percent: {item?.progress_percent}%</Text>
                                                </View>

                                                {/* Right Side: Horizontal ScrollView for Images */}
                                                {images.length > 0 && (
                                                    <ScrollView horizontal showsHorizontalScrollIndicator={true}>
                                                        {images.map((img: any, index: number) => {
                                                            const imageUrl = `${baseURL}${projectData.folder_name}${img}`;
                                                            console.log("IMAGE URL ====", imageUrl)
                                                            return (
                                                                <Image
                                                                    key={index}
                                                                    source={{ uri: imageUrl }}
                                                                    style={{ width: 15, height: 15, marginLeft: 5 }}
                                                                    resizeMode="cover"
                                                                />
                                                            );
                                                        })}
                                                    </ScrollView>
                                                )}
                                            </View>
                                        );
                                    });
                                })()
                            }

                        </View>}


                    {formData1.projectId && (
                        <InputPaper
                            label="Project Progress..."
                            maxLength={10}
                            leftIcon='progress-clock'
                            keyboardType="number-pad"
                            value={formData1.progress}
                            onChangeText={(txt: any) => handleFormChange("progress", txt)}
                            customStyle={{ backgroundColor: theme.colors.background, marginTop: 10 }}
                        />
                    )}

                    <ButtonPaper
                        icon={"camera"}
                        mode='contained'
                        onPress={selectLogo}
                        style={{ marginTop: 15, paddingVertical: 8 }}
                    >
                        {strings.uploadPhotoBtnLabel}
                    </ButtonPaper>
                    <Text variant='bodySmall' style={{
                        color: theme.colors.onBackground,
                        fontFamily: strings.fontItalic
                    }}>{strings.uploadPhotoBtnSubText}</Text>

                    {imgData.length > 0 && (
                        <ScrollView horizontal style={{ marginTop: 15 }}>
                            {imgData.map((asset, index) => (
                                <View key={asset.uri || index} style={{ marginRight: 10, position: 'relative' }}>
                                    <Image source={{ uri: asset.uri! }} style={styles.image} resizeMode="contain" />
                                    <TouchableOpacity
                                        onPress={() => removeImage(index)}
                                        style={styles.removeIconContainer}
                                    >
                                        <Icon size={20} color={theme.colors.error} source={"trash-can-outline"} />
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </ScrollView>
                    )}

                    <ButtonPaper
                        icon={"progress-clock"}
                        mode='outlined'
                        onPress={() => {
                            Alert.alert("Alert", "Are you sure you want to submit the details?", [
                                { "text": strings.noTxt, onPress: () => null },
                                {
                                    "text": strings.yesTxt, onPress: async () => {
                                        await updateProjectProgressDetails()
                                    }
                                }
                            ])
                        }}
                        style={{ marginTop: 15, paddingVertical: 8 }}
                        loading={loading}
                        disabled={!formData1.progress || !formData1.projectId || loading}
                    >
                        Update Progress
                    </ButtonPaper>

                    <ButtonPaper
                        icon={"content-save-outline"}
                        mode='contained'
                        buttonColor={theme.colors.tertiary}
                        onPress={() => {
                            Alert.alert("Alert", "Are you sure you want to save the details?", [
                                { "text": strings.noTxt, onPress: () => null },
                                { "text": strings.yesTxt, onPress: () => saveLocally() }
                            ])
                        }}
                        style={{ marginTop: 15, paddingVertical: 8 }}
                        disabled={
                            imgData?.length === 0
                            || !formData1.progress
                            || !formData1.projectId
                            || !location.latitude
                            || !location.longitude
                            || !geolocationFetchedAddress
                        }
                    >
                        {strings.saveText}
                    </ButtonPaper>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default HomeScreen

const styles = StyleSheet.create({
    dropdown: {
        minHeight: 70,
        maxHeight: 70,
        alignSelf: "center",
        paddingHorizontal: 30,
        borderRadius: 20,
        borderWidth: 1,
        marginTop: 5
    },
    placeholderStyle: {
        fontSize: 16,
        marginLeft: 16,
        fontFamily: strings.fontName
    },
    selectedTextStyle: {
        fontSize: 16,
        marginLeft: 16,
        fontFamily: strings.fontName
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
        fontFamily: strings.fontName
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
})
