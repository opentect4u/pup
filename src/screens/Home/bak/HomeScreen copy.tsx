import React, { useEffect, useState } from 'react'
import { Alert, Image, ScrollView, StyleSheet, ToastAndroid, View } from 'react-native'
import { Divider, Icon, Text } from 'react-native-paper'
import { SafeAreaView } from 'react-native-safe-area-context'
import { usePaperColorScheme } from '../../theme/theme'
import { homeScreenStrings } from '../../constants/strings'
import useScreenDimensions from '../../hooks/useScreenDimensions'
import useGeoLocation from '../../hooks/useGeoLocation'
import { Dropdown } from 'react-native-element-dropdown'
import ButtonPaper from '../../components/ButtonPaper'
import InputPaper from '../../components/InputPaper'
import Header from '../../components/Header'
import { fileStorage, loginStorage } from '../../storage/appStorage'
// @ts-ignore
import { AUTH_KEY } from "@env"
import { ADDRESSES } from '../../config/api_list'
import axios from 'axios'
import { CommonActions, useNavigation } from '@react-navigation/native'
import navigationRoutes from '../../routes/routes'
import {
    Asset,
    ImageLibraryOptions,
    ImagePickerResponse,
    launchImageLibrary,
} from "react-native-image-picker"

const strings = homeScreenStrings.getStrings()

const HomeScreen = () => {
    const navigation = useNavigation()
    const theme = usePaperColorScheme()
    const { screenHeight, screenWidth } = useScreenDimensions()
    const { location, error } = useGeoLocation()
    const loginStore = JSON.parse(loginStorage?.getString("login-data") ?? "{}")

    console.log("LOCATION === ", location)

    const [imgData, setImgData] = useState<Asset | null>(null)
    const [imgSrcUri, setImgSrcUri] = useState<string>()
    const [projectsList, setProjectsList] = useState(() => [])
    const [loading, setLoading] = useState(() => false)

    const [formData1, setFormData1] = useState({
        projectId: "",
        progress: "",
    })

    const handleFormChange = (field: string, value: any) => {
        setFormData1((prev) => ({
            ...prev,
            [field]: value,
        }))
    }

    const fetchProjectsList = async () => {
        const formData = new FormData()
        formData.append('', null)

        await axios.post(`${ADDRESSES.FETCH_PROJECTS_LIST}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                "auth_key": AUTH_KEY
            }
        }).then(res => {
            if (res?.data?.status === 1) {
                console.log("PROJECTS : ", res?.data)
                setProjectsList(res?.data?.message?.map((item: any, _: any) => ({
                    label: `${item?.project_id}\n${item?.scheme_name}`,
                    value: item?.approval_no
                })))
            } else {
                ToastAndroid.show("Projects fetch error.", ToastAndroid.SHORT)
            }
        }).catch(err => {
            console.log("ERR PROJ", err)
            ToastAndroid.show("Some error occurred while fetching projects.", ToastAndroid.SHORT)
        })
    }

    useEffect(() => {
        fetchProjectsList()
    }, [])

    // const selectLogo = () => {
    //     const options: ImageLibraryOptions = {
    //         mediaType: "photo",
    //         includeBase64: true,
    //     }

    //     launchImageLibrary(options, (response: ImagePickerResponse) => {
    //         if (response.didCancel) {
    //             console.log("User cancelled image picker")
    //             fileStorage.clearAll()
    //         } else if (response.errorCode) {
    //             console.log("ImagePicker Error: ", response.errorMessage)
    //             fileStorage.clearAll()
    //         } else {
    //             const fileStore = fileStorage.getString("file-data")
    //             const fileStoreUri = fileStorage.getString("file-uri")

    //             if (fileStore?.length || (fileStoreUri as string)?.length > 0) {
    //                 fileStorage.clearAll()
    //             }

    //             const asset = (response?.assets as Asset[])[0]
    //             if (!asset) return
    //             setImgData(asset)

    //             const source = (response?.assets as Asset[])[0]?.base64
    //             const srcUri = (response?.assets as Asset[])[0]?.uri
    //             // const file = (response?.assets as Asset[])[0]

    //             setImgSrcUri(srcUri)

    //             fileStorage.set("file-data", (source as string)?.toString())
    //             fileStorage.set("file-uri", (srcUri as string)?.toString())

    //             console.log(
    //                 "================",
    //                 source?.toString(),
    //             )
    //         }
    //     })
    // }

    const selectLogo = () => {
        const options: ImageLibraryOptions = {
            mediaType: "photo",
            includeBase64: true,
        };

        launchImageLibrary(options, (response: ImagePickerResponse) => {
            if (response.didCancel) {
                console.log("User cancelled image picker");
                fileStorage.clearAll();
            } else if (response.errorCode) {
                console.log("ImagePicker Error: ", response.errorMessage);
                fileStorage.clearAll();
            } else {
                // Get the first asset from the response
                const asset = (response?.assets as Asset[])[0];
                if (!asset) return;

                // Store asset in state if you need more info later
                setImgData(asset);
                setImgSrcUri(asset.uri || "");

                // Optionally store base64 data
                fileStorage.set("file-data", asset.base64?.toString() || "");
                fileStorage.set("file-uri", asset.uri?.toString() || "");
                console.log("Selected image base64:", asset.base64);
            }
        });
    };


    const removeLogo = () => {
        setImgData(null);
        setImgSrcUri("");
        fileStorage.delete("file-data");
        fileStorage.delete("file-uri");
    };

    const updateProjectProgressDetails = async () => {
        setLoading(true)
        console.log("Image URI::::::::::", imgData?.uri)
        console.log("Image TYPE::::::::::", imgData?.type)
        console.log("Image FILE NAME::::::::::", imgData?.fileName)
        const formData = new FormData()

        formData.append('approval_no', formData1.projectId)
        formData.append('progress_percent', formData1.progress)
        if (imgData && imgData.uri) {
            formData.append("progress_pic", {
                uri: imgData.uri,
                type: imgData.type || "image/jpeg",
                name: imgData.fileName || "progress_pic.jpg",
            } as any);
        }
        formData.append('created_by', loginStore?.user_id)

        await axios.post(`${ADDRESSES.PROJECT_PROGRESS_UPDATE}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                "auth_key": AUTH_KEY
            }
        }).then(res => {
            console.log("RES DATA === updateProjectProgressDetails: ", res?.data)
            if (res?.data?.status === 1) {
                console.log("PROJECTS : ", res?.data)
                setProjectsList(res?.data?.message?.map((item: any, _: any) => ({
                    label: `${item?.project_id}\n${item?.scheme_name}`,
                    value: item?.approval_no
                })))

                Alert.alert("Approval Photo", "Approval project photo uploaded successfully.")
            } else {
                ToastAndroid.show("Sending details with photo error.", ToastAndroid.SHORT)
            }
        }).catch(err => {
            console.log("ERR PROJ WITH FILE", err)
            ToastAndroid.show("Some error occurred while fetching projects.", ToastAndroid.SHORT)
        })
        setLoading(false)
    }

    return (
        <SafeAreaView>
            <ScrollView keyboardShouldPersistTaps='handled' scrollEnabled style={{
                backgroundColor: theme.colors.background,
            }}>
                <Header />
                <View style={{
                    padding: 30,
                    gap: 5,
                    height: screenHeight,
                }}>
                    <Text variant='titleLarge' style={{
                        color: theme.colors.secondary
                    }}>{strings.projectDropdownLabel}</Text>
                    <Dropdown
                        style={[styles.dropdown, { width: '100%', borderColor: theme.colors.secondary, backgroundColor: theme.colors.secondaryContainer }]}
                        placeholderStyle={[styles.placeholderStyle, { color: theme.colors.onBackground }]}
                        selectedTextStyle={[styles.selectedTextStyle, { color: theme.colors.primary }]}
                        inputSearchStyle={[styles.inputSearchStyle, { borderRadius: 10 }]}
                        containerStyle={{
                            alignSelf: "auto",
                            borderRadius: 10,
                        }}
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
                            console.log("??????????????????????", item)
                            handleFormChange("projectId", item?.value);
                        }}
                        renderLeftIcon={() => (
                            <Icon size={25} source={"creation"} />
                        )}
                    />
                    <ButtonPaper icon={"cloud-search-outline"} mode='contained' onPress={() => null} style={{
                        marginTop: 15,
                        paddingVertical: 8,
                    }} disabled={!formData1.projectId}>{strings.submitText}</ButtonPaper>

                    {formData1.projectId &&
                        <>
                            <InputPaper label="Project Progress..." maxLength={10} leftIcon='progress-clock' keyboardType="number-pad" value={formData1.progress} onChangeText={(txt: any) => handleFormChange("progress", txt)} customStyle={{
                                backgroundColor: theme.colors.background,
                                marginTop: 10,
                            }} />
                        </>
                    }

                    {/* <ButtonPaper icon={"camera"} mode='contained' onPress={() => navigation.dispatch(CommonActions.navigate(
                        navigationRoutes.cameraScreen,
                    ))} style={{
                        marginTop: 15,
                        paddingVertical: 8,
                    }}>Open Camera</ButtonPaper> */}

                    <ButtonPaper icon={"camera"} mode='contained' onPress={selectLogo} style={{
                        marginTop: 15,
                        paddingVertical: 8,
                    }}>Upload Photo</ButtonPaper>

                    <View
                        style={{
                            marginTop: 15,
                            borderWidth: 2,
                            borderStyle: "dashed",
                            borderRadius: 20,
                            width: "100%",
                            borderColor: theme.colors.secondary,
                            padding: 15
                        }}>
                        <Image
                            style={styles.image}
                            // source={{ uri: imgSrcUri }}
                            source={{
                                uri:
                                    fileStorage?.getString("file-uri") === undefined
                                        ? imgSrcUri
                                        : fileStorage?.getString("file-uri"),
                            }}
                            resizeMode="contain"
                        />
                        <ButtonPaper buttonColor={theme.colors.error} icon={"trash-can-outline"} mode='contained' onPress={() => Alert.alert("Remove", "Do you want to remove the photo?", [
                            { text: "NO", onPress: () => null },
                            { text: "YES", onPress: () => removeLogo() }
                        ])} style={{
                            marginTop: 15,
                            paddingVertical: 8,
                        }}>Remove Photo</ButtonPaper>
                    </View>

                    <ButtonPaper icon={"progress-clock"} mode='outlined' onPress={async () => { await updateProjectProgressDetails(); removeLogo(); }} style={{
                        marginTop: 15,
                        paddingVertical: 8,
                    }} loading={loading} disabled={loading}>Update Progress</ButtonPaper>
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
        // minHeight: 150,
        height: 100,
        // marginVertical: 10,
        borderWidth: 1,
    },
})