import React from 'react';
import { StyleSheet } from 'react-native';
import ListCard from './ListCard';
import { globalStrings } from '../constants/strings';
import { usePaperColorScheme } from '../theme/theme';
import { loginStorage } from '../storage/appStorage';

const strings = globalStrings.getStrings();

const Header = () => {
  const theme = usePaperColorScheme();
  const loginStore = JSON.parse(loginStorage?.getString('login-data') ?? '{}');

  return (
    <ListCard
      title={`${strings.welcome} ${loginStore?.name}!`}
      subtitle={`${strings.welcomeSubText} ${loginStore?.user_id}`}
      position={0}
      icon="account-outline"
      iconViewColor={theme.colors.primary}
      iconViewBorderColor={theme.colors.primaryContainer}
      direction="ltr"
      rightIcon="bell-outline"
      righticonColor={theme.colors.secondary}
      righticonViewColor={theme.colors.background}
      righticonViewBorderColor={theme.colors.background}
    />
  );
};

export default Header;

const styles = StyleSheet.create({});
