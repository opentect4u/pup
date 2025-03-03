import { Alert, Linking, Platform, StyleSheet, View, TouchableOpacity, Image } from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import { Camera, CameraDevice, useCameraDevice, useCameraPermission } from 'react-native-vision-camera';
import { CommonActions, useNavigation } from '@react-navigation/native';
import navigationRoutes from '../../routes/routes';
import { usePaperColorScheme } from '../../theme/theme';
import RNFS from 'react-native-fs';

function CameraScreen() {
  const device = useCameraDevice('back') as CameraDevice;
  const { hasPermission, requestPermission } = useCameraPermission();
  const navigation = useNavigation();
  const theme = usePaperColorScheme();
  const cameraRef = useRef<Camera>(null);
  const [photoPath, setPhotoPath] = useState<string | null>(null);

  useEffect(() => {
    const cameraPermissionRequest = () => {
      if (!hasPermission) {
        requestPermission().then(res => {
          if (res) {
            console.log("REQUEST GRANTED...", res);
          } else {
            console.log("REQUEST REJECTED...", res);
            Alert.alert(
              "Allow Permissions",
              "Click Open Settings: Go to Permissions -> Allow Camera access.",
              [
                { text: "Open Settings", onPress: () => Linking.openSettings() },
                { text: "Later", onPress: () => null },
              ],
            );
          }
        }).catch(err =>
          console.log("SOME PROBLEM DETECTED WHILE PERMISSION OF CAMERA GIVING...", err)
        );
      }
    };
    if (Platform.OS === "android") {
      cameraPermissionRequest();
    }
  }, []);

  const takePhoto = async () => {
    console.log("Capture btn clicked...")
    if (cameraRef.current && device) {
      const photo = await cameraRef.current.takeSnapshot();
      const filePath = `${RNFS.DocumentDirectoryPath}/photo.jpg`;
      await RNFS.moveFile(photo.path, filePath);
      setPhotoPath(`file://${filePath}`);
    }
  };

  const handleExit = () => {
    console.log("PHOTO PATH: ", photoPath)
    if (photoPath) {
      navigation.dispatch(CommonActions.navigate({
        name: navigationRoutes.homeScreen,
        params: {
          photo: photoPath
        }
      }));
    }
  };

  return (
    <View style={[StyleSheet.absoluteFill, { backgroundColor: theme.colors.secondaryContainer }]}>
      {device && (
        <Camera
          ref={cameraRef}
          isActive={true}
          device={device}
          style={[StyleSheet.absoluteFill]}
          focusable
          enableZoomGesture
          collapsable
        />
      )}
      <TouchableOpacity style={styles.captureButton} onPress={takePhoto}>
        <View style={styles.innerCircle} />
      </TouchableOpacity>
      {photoPath && (
        <>
          <Image source={{ uri: photoPath }} style={[StyleSheet.absoluteFill]} />
          <TouchableOpacity style={styles.exitButton} onPress={handleExit}>
            <View style={styles.innerCircleExit} />
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  captureButton: {
    position: 'absolute',
    bottom: 50,
    alignSelf: 'center',
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'red',
  },
  exitButton: {
    position: 'absolute',
    bottom: 120,
    alignSelf: 'center',
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerCircleExit: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'black',
  },
  preview: {
    // position: 'absolute',
    // bottom: 200,
    // alignSelf: 'center',
    // width: 100,
    // height: 100,
    // borderRadius: 10,
  }
});

export default CameraScreen;
