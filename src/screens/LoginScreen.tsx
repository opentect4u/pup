import React, { useContext, useEffect, useState } from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { Text } from 'react-native-paper';
import { loginImg } from '../assets/images';
import { loginScreenStrings } from '../constants/strings';
import InputPaper from '../components/InputPaper';
import ButtonPaper from '../components/ButtonPaper';
import { usePaperColorScheme } from '../theme/theme';
import useScreenDimensions from '../hooks/useScreenDimensions';
import { AppStore } from '../context/AppContext';
import { AppStoreContext } from '../models/context_types';
import { version } from '../../package.json';

const strings = loginScreenStrings.getStrings();

const LoginScreen = () => {
  const theme = usePaperColorScheme();
  const { screenHeight } = useScreenDimensions();
  const [visiblePassword, setVisiblePassword] = useState(() => true);
  const { handleLogin, isLoading } = useContext<AppStoreContext>(AppStore);
  const [appVersion, setAppVersion] = useState('');

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    loginType: 'M',
  });

  const handleFormChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };



  return (
    <SafeAreaView>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        scrollEnabled
        style={{
          backgroundColor: theme.colors.background,
        }}>
        <View
          style={{
            padding: 30,
            gap: 5,
            height: screenHeight,
          }}>
          <Image
            source={loginImg}
            style={{
              height: 380,
              width: 380,
              alignSelf: 'center',
            }}
          />

          <Text
            variant="displaySmall"
            style={{
              color: theme.colors.primary,
            }}>
            {strings.login}
          </Text>
          <Text
            variant="bodyLarge"
            style={{
              color: theme.colors.secondary,
            }}>
            {strings.loginSubText}
          </Text>

          <View>
            <InputPaper
              label="Username"
              maxLength={50}
              leftIcon="account-circle-outline"
              keyboardType="default"
              value={formData.username}
              onChangeText={(txt: any) => handleFormChange('username', txt)}
              customStyle={{
                backgroundColor: theme.colors.background,
              }}
              underlineColor={theme.colors.background}
            />

            <InputPaper
              label="Password"
              maxLength={50}
              leftIcon="lock-outline"
              keyboardType="default"
              secureTextEntry={visiblePassword}
              value={formData.password}
              onChangeText={(txt: any) => handleFormChange('password', txt)}
              customStyle={{
                backgroundColor: theme.colors.background,
              }}
              onPressRight={() => setVisiblePassword(!visiblePassword)}
              underlineColor={theme.colors.background}
              password
            />
          </View>

          <ButtonPaper
            disabled={!formData.username || !formData.password || isLoading}
            loading={isLoading}
            mode="contained"
            onPress={() => handleLogin(formData.username, formData.password, formData.loginType)}
            style={{
              marginTop: 15,
              paddingVertical: 8,
            }}>
            {strings.buttonText}
          </ButtonPaper>

          <Text style={{ marginTop: 20, fontSize: 12, color: '#888', textAlign:'center' }}>
        App Version: {version}
      </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({});
