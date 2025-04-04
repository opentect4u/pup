import { StyleSheet, View } from 'react-native';
import React from 'react';
import { usePaperColorScheme } from '../theme/theme';
import { Icon, Text } from 'react-native-paper';

type ListCardProps = {
  backgroundColor?: string;
  position: 1 | 0 | -1;
  icon?: string;
  iconColor?: string;
  iconViewColor: string;
  iconViewBorderColor: string;
  title: string;
  subtitle: string;
  subtitleColor?: string;
  direction?: 'rtl' | 'ltr';
  rightIcon?: string;
  righticonViewColor?: string;
  righticonViewBorderColor?: string;
  righticonColor?: string;
};

const ListCard = ({
  backgroundColor,
  position,
  icon,
  iconColor,
  iconViewColor,
  iconViewBorderColor,
  title,
  subtitle,
  subtitleColor,
  direction = 'ltr',
  rightIcon,
  righticonViewColor,
  righticonViewBorderColor,
  righticonColor,
}: ListCardProps) => {
  const theme = usePaperColorScheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: backgroundColor || theme.colors.surface,
          flexDirection: direction === 'ltr' ? 'row' : 'row-reverse',
          borderColor: theme.colors.onSurface,
        },
        positionStyles[position],
      ]}>
      <View
        style={{
          backgroundColor: iconViewColor,
          width: 60,
          height: 60,
          borderWidth: 5,
          borderColor: iconViewBorderColor,
          borderRadius: 150,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Icon
          source={icon || 'cash'}
          size={25}
          color={iconColor || theme.colors.surface}
        />
      </View>
      <View style={styles.textContainer}>
        <Text variant="titleMedium" style={{ color: iconViewColor }}>
          {title}
        </Text>
        <Text
          variant="titleSmall"
          style={{ color: subtitleColor || theme.colors.secondary }}>
          {subtitle}
        </Text>
      </View>
      {rightIcon && (
        <View
          style={[
            styles.rightIcon,
            {
              backgroundColor: righticonViewColor,
              borderColor: righticonViewBorderColor,
              justifyContent: 'center',
            },
          ]}>
          <Icon
            source={rightIcon || 'cash'}
            size={25}
            color={righticonColor || theme.colors.surface}
          />
        </View>
      )}
    </View>
  );
};

const positionStyles = StyleSheet.create({
  '0': {
    height: 100,
    width: '100%',
    borderRadius: 0,
    alignItems: 'center',
    paddingHorizontal: 15,
    gap: 15,
  },
  '1': {
    height: 100,
    width: '100%',
    borderRadius: 20,
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 0,
    alignItems: 'center',
    paddingHorizontal: 15,
    gap: 15,
  },
  '-1': {
    height: 100,
    width: '100%',
    borderRadius: 20,
    borderTopRightRadius: 0,
    borderTopLeftRadius: 0,
    alignItems: 'center',
    paddingHorizontal: 15,
    gap: 15,
  },
});

const styles = StyleSheet.create({
  container: {
    height: 80,
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 15,
    borderBottomWidth: 0.5,
  },
  textContainer: {
    flex: 1,
  },
  rightIcon: {
    position: 'absolute',
    right: 15,
    width: 60,
    height: 60,
    borderWidth: 5,
    borderRadius: 150,
    alignItems: 'center',
  },
});

export default ListCard;
