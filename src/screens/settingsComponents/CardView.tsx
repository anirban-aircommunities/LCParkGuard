import { useTheme } from '@react-navigation/native';
import React, { JSX } from 'react';
import { Switch, Text, TouchableOpacity, View } from 'react-native';
import { StyleSheet } from 'react-native';
import { PANTONE5487, PANTONE5487_RGBA_LIGHT, PANTONE7546_RGBA_DEEP, PANTONE7546_RGBA_LIGHT } from '../../constants/Colors';
import { settingsTexts } from '../../constants/Constants';
import { SvgXml } from 'react-native-svg';
import { rightArrowIcon } from '../../components/Icons';

type CardViewProps = {
  icon?: string;
  iconSize?: number;
  iconColor?: string;
  cardTitle?: string;
  cardSubtitle?: string | JSX.Element;
  cardType?: 'arrow' | 'switch';
  isEnabled?: boolean;
  setIsEnabled?: () => void;
  handleClick?: () => void;
};

const CardView: React.FC<CardViewProps> = ({
  icon,
  iconSize,
  iconColor,
  cardTitle,
  cardSubtitle,
  cardType,
  isEnabled,
  setIsEnabled,
  handleClick,
}: any) => {
  const { colors } = useTheme();
  // YET TO BE REPLACED BY IMAGE PROVIDED BY CUSTOMER
  return cardType == 'switch' ? (
    // RENDER CARD INVOLVING SWITCH
    <View style={[styles.cardContainer, styles.iosShadow]}>
      <View style={styles.rowCenter}>
        {/* Card Icon */}
        <SvgXml xml={icon} height={iconSize} width={iconSize} color={iconColor} />
        <View
          style={[
            styles.textContainer,
            !cardSubtitle && styles.textContainerCentered,
          ]}
        >
          {/* Card Title */}
          <Text style={styles.cardTitle}>{cardTitle}</Text>
          {/* Card Subtitle */}
          {cardSubtitle && (
            <Text style={styles.cardSubtitle}>{cardSubtitle}</Text>
          )}
        </View>
      </View>
      <Switch
        trackColor={{
          false: PANTONE7546_RGBA_LIGHT,
          true: PANTONE7546_RGBA_DEEP,
        }}
        value={isEnabled}
        ios_backgroundColor={PANTONE7546_RGBA_LIGHT}
        onValueChange={setIsEnabled}
        style={{ alignSelf: 'center' }}
      />
    </View>
  ) : (
    // RENDER CARD NOT INVOLVING SWITCH
    <TouchableOpacity
      activeOpacity={0.7}
      style={[
        styles.cardContainer,
        styles.iosShadow,
        !cardSubtitle && {paddingVertical: 0}
        // cardTitle == settingsTexts.logoutCardTitle &&
        //   ((colors as any)?.dark
        //     ? darkModeStyles.visibleBackground
        //     : styles.notSwitchBackground),
      ]}
      onPress={handleClick}
    >
      <View style={styles.rowCenter}>
        {/* Card Icon */}
        <SvgXml xml={icon} height={iconSize} width={iconSize} color={iconColor} />
        <View
          style={[
            styles.textContainer,
            !cardSubtitle && styles.textContainerCentered,
          ]}
        >
          {/* Card Title */}
          <Text style={styles.cardTitle}>{cardTitle}</Text>
          {/* Card Subtitle */}
          {cardSubtitle && (
            <Text style={styles.cardSubtitle}>{cardSubtitle}</Text>
          )}
        </View>
      </View>
      <SvgXml xml={rightArrowIcon} height={50} width={50} />
    </TouchableOpacity>
  );
};

export default CardView;

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 10,
    borderWidth: 1,
    borderRadius: 10,
  },
  iconContainer: {
    height: 40,
    width: 40,
    borderRadius: 40 / 2,
    padding: 10,
    backgroundColor: PANTONE5487_RGBA_LIGHT,
    borderColor: PANTONE5487_RGBA_LIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginLeft: 10,
    minHeight: 40,
  },
  textContainerCentered: {
    justifyContent: 'center',
  },
  rowCenter: {
    flex: 0.8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: PANTONE5487
  },
  cardSubtitle: {
    fontSize: 14,
    marginTop: 5,
    color: PANTONE5487
  },
  notSwitchBackground: { backgroundColor: PANTONE5487_RGBA_LIGHT },
  iosShadow: {
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
});
