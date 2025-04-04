import React, { useContext } from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { settingsScreenStrings } from '../../constants/strings';
import { usePaperColorScheme } from '../../theme/theme';
import useScreenDimensions from '../../hooks/useScreenDimensions';
import ButtonPaper from '../../components/ButtonPaper';
import { AppStore } from '../../context/AppContext';
import Header from '../../components/Header';
import { projectStorage } from '../../storage/appStorage';
import { CommonActions, useNavigation } from '@react-navigation/native';
import navigationRoutes from '../../routes/routes';

const strings = settingsScreenStrings.getStrings();

console.log('Project STORE : ', projectStorage?.getString('projects'));
console.log('Project STORE : helloooo=== ');

const SettingsScreen = () => {
  const theme = usePaperColorScheme();
  const { screenHeight, screenWidth } = useScreenDimensions();
  const { handleLogout } = useContext(AppStore);
  const navigation = useNavigation();
  return (
    <SafeAreaView>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        scrollEnabled
        style={{
          backgroundColor: theme.colors.background,
        }}>
        <Header />
        <View
          style={{
            padding: 30,
            gap: 5,
            height: screenHeight,
          }}>
          <ButtonPaper
            icon={'logout'}
            mode="contained"
            onPress={() =>
              Alert.alert(strings.logOutText, strings.logOutAlertText, [
                { text: strings.noTxt, onPress: () => null },
                { text: strings.yesTxt, onPress: () => handleLogout() },
              ])
            }
            style={{
              paddingVertical: 8,
            }}>
            {strings.logOutText}
          </ButtonPaper>
          <ButtonPaper
            icon={'content-save-move-outline'}
            buttonColor={theme.colors.secondary}
            mode="contained"
            onPress={() =>
              navigation.dispatch(
                CommonActions.navigate({
                  name: navigationRoutes.savedProjectsScreen,
                }),
              )
            }
            style={{
              marginTop: 15,
              paddingVertical: 8,
            }}>
            Saved Projects
          </ButtonPaper>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({});
