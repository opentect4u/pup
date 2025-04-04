import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  ToastAndroid,
  View,
  TouchableOpacity,
} from 'react-native';
import { Icon, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { usePaperColorScheme } from '../../theme/theme';
import { homeScreenStrings } from '../../constants/strings';
import useGeoLocation from '../../hooks/useGeoLocation';
import { Dropdown } from 'react-native-element-dropdown';
import ButtonPaper from '../../components/ButtonPaper';
import InputPaper from '../../components/InputPaper';
import Header from '../../components/Header';
import { fileStorage, loginStorage } from '../../storage/appStorage';
// @ts-ignore
import { AUTH_KEY } from '@env';
import { ADDRESSES } from '../../config/api_list';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import {
  Asset,
  ImageLibraryOptions,
  ImagePickerResponse,
  launchImageLibrary,
} from 'react-native-image-picker';
import ImageResizer from '@bam.tech/react-native-image-resizer';

const strings = homeScreenStrings.getStrings();

const HomeScreen = () => {
  const navigation = useNavigation();
  const theme = usePaperColorScheme();
  const { location } = useGeoLocation();

  // Memoize loginStore so it doesn't change on every render
  const loginStore = useMemo(
    () => JSON.parse(loginStorage?.getString('login-data') ?? '{}'),
    [],
  );

  const [imgData, setImgData] = useState<Asset[]>([]);
  const [projectsList, setProjectsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  // Set projectId to null instead of "" to indicate no selection
  const [formData1, setFormData1] = useState({
    projectId: null as string | null,
    progress: '',
  });

  const handleFormChange = useCallback((field: string, value: any) => {
    setFormData1(prev => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const fetchProjectsList = useCallback(async () => {
    const formData = new FormData();
    formData.append('', null);

    try {
      const res = await axios.post(
        `${ADDRESSES.FETCH_PROJECTS_LIST}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            auth_key: AUTH_KEY,
          },
        },
      );
      if (res?.data?.status === 1) {
        console.log('PROJECTS : ', res?.data);
        const newProjectsList = res?.data?.message?.map((item: any) => ({
          label: `${item?.project_id}\n${item?.scheme_name}`,
          value: item?.approval_no,
        }));
        setProjectsList(newProjectsList);
      } else {
        ToastAndroid.show('Projects fetch error.', ToastAndroid.SHORT);
      }
    } catch (err) {
      console.log('ERR PROJ', err);
      ToastAndroid.show(
        'Some error occurred while fetching projects.',
        ToastAndroid.SHORT,
      );
    }
  }, []);

  useEffect(() => {
    fetchProjectsList();
  }, [fetchProjectsList]);

  const selectLogo = useCallback(() => {
    const options: ImageLibraryOptions = {
      mediaType: 'photo',
      includeBase64: true,
      selectionLimit: 4, // allow multiple selection
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
          setImgData(assets);
          // Optionally store first asset's data in fileStorage
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

  const removeImage = useCallback((index: number) => {
    setImgData(prev => prev.filter((_, i) => i !== index));
  }, []);

  const removeAllImages = useCallback(() => {
    setImgData([]);
    fileStorage.delete('file-data');
    fileStorage.delete('file-uri');
  }, []);

  const updateProjectProgressDetails = useCallback(async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append('approval_no', formData1.projectId || '');
    formData.append('progress_percent', formData1.progress);

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
              asset.uri!, // non-null assertion because we assume uri is available
              targetWidth,
              targetHeight,
              'JPEG',
              80, // quality (0-100)
              0, // rotation
              null, // outputPath (null uses cache folder)
              false, // keepMeta
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

    try {
      const res = await axios.post(
        `${ADDRESSES.PROJECT_PROGRESS_UPDATE}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            auth_key: AUTH_KEY,
          },
        },
      );
      console.log('Response:', res?.data);
      if (res?.data?.status === 1) {
        const newProjectsList = res?.data?.message?.map((item: any) => ({
          label: `${item?.project_id}\n${item?.scheme_name}`,
          value: item?.approval_no,
        }));
        setProjectsList(newProjectsList);
        // Reset the project selection and progress inputs using null for projectId
        handleFormChange('projectId', null);
        handleFormChange('progress', '');
        Alert.alert(
          'Approval Photo',
          'Approval project photo(s) uploaded successfully.',
        );
        removeAllImages();
      } else {
        ToastAndroid.show(
          'Sending details with photo error.',
          ToastAndroid.SHORT,
        );
      }
    } catch (err) {
      console.log('Upload error:', err);
      ToastAndroid.show(
        'Some error occurred while updating progress.',
        ToastAndroid.SHORT,
      );
    }
    setLoading(false);
  }, [formData1, imgData, loginStore, removeAllImages, handleFormChange]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        style={{ backgroundColor: theme.colors.background }}>
        <Header />
        <View style={{ padding: 30, gap: 5, flex: 1 }}>
          <Text variant="titleLarge" style={{ color: theme.colors.secondary }}>
            {strings.projectDropdownLabel}
          </Text>
          <Dropdown
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
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder="Choose Project"
            searchPlaceholder="Search Project..."
            value={formData1?.projectId}
            onChange={item => {
              console.log('Selected project:', item);
              handleFormChange('projectId', item?.value);
            }}
            renderLeftIcon={() => <Icon size={25} source={'creation'} />}
          />
          <ButtonPaper
            icon={'cloud-search-outline'}
            mode="contained"
            onPress={() => null}
            style={{ marginTop: 15, paddingVertical: 8 }}
            disabled={!formData1.projectId}>
            {strings.submitText}
          </ButtonPaper>

          {formData1.projectId && (
            <InputPaper
              label="Project Progress..."
              maxLength={10}
              leftIcon="progress-clock"
              keyboardType="number-pad"
              value={formData1.progress}
              onChangeText={(txt: any) => handleFormChange('progress', txt)}
              customStyle={{
                backgroundColor: theme.colors.background,
                marginTop: 10,
              }}
            />
          )}

          <ButtonPaper
            icon={'camera'}
            mode="contained"
            onPress={selectLogo}
            style={{ marginTop: 15, paddingVertical: 8 }}>
            Upload Photo(s)
          </ButtonPaper>

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
                    style={styles.removeIconContainer}>
                    <Icon
                      size={20}
                      color={theme.colors.error}
                      source={'trash-can-outline'}
                    />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          )}

          <ButtonPaper
            icon={'progress-clock'}
            mode="outlined"
            onPress={updateProjectProgressDetails}
            style={{ marginTop: 15, paddingVertical: 8 }}
            loading={loading}
            disabled={loading}>
            Update Progress
          </ButtonPaper>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  dropdown: {
    minHeight: 70,
    maxHeight: 70,
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
});
