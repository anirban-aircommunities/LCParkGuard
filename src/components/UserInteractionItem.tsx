import React, { Fragment, useState } from 'react';
import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  Colors,
  PANTONE428,
  PANTONE7546,
  PANTONE7546_RGBA_DEEP,
  PANTONE7546_RGBA_LIGHT,
} from '../constants/Colors';
import { SvgXml } from 'react-native-svg';
import { downArrowIcon, upArrowIcon } from './Icons';
import { scanTypes } from '../constants/Constants';
import ReadMore from '@fawazahmed/react-native-read-more';

type UserInteractionItemProps = {
  haveItemHeader?: boolean;
  haveItemDescription?: boolean;
  haveButton?: boolean;
  descText?: string;
  iconName?: string;
  iconSize?: number;
  labelText?: string;
  labelSize?: number;
  labelTextAdditionalStyle?: any;
  labelIconAdditionalStyle?: any;
  labelContainerAdditionalStyle?: any;
  interactionType?: string;
  value?: string;
  onChange?: (text: any) => void;
  placeholder?: string;
  dropdownItems?: any;
  selectedItem?: any;
  setSelectedItem?: (item: any, index: number) => void;
  selectedTab?: any;
  setSelectedTab?: (item: any, index: number) => void;
  all: number | undefined;
  unauthorized: number | undefined;
  valid: number | undefined;
  numberOfLines?: number | undefined;
  item?: any;
  isDesc?: boolean;
  autoCapitalize?: string;
  returnKeyType?: string;
  whiteBackground?: boolean;
  keyboardType?: string;
  multiline?: boolean;
};
const renderInteractingFeature = (props: any) => {
  const [isPropertyDropdownOpen, setIsPropertyDropdownOpen] = useState(false);
  let dropdownItemsList = props?.dropdownItems;
  switch (props?.interactionType) {
    case 'textbox':
      // Text Field
      return (
        <TextInput
          value={props?.value}
          onChangeText={props?.onChange}
          style={[styles.textFieldStyle, props?.whiteBackground && styles.whiteBackground]}
          placeholder={props?.placeholder}
          placeholderTextColor={Colors.grey2}
          autoFocus={false}
          autoCapitalize={props?.autoCapitalize}
          returnKeyType={props?.returnKeyType}
          keyboardType={props?.keyboardType}
          multiline={props?.multiline}
        />
      );
    case 'dropdown':
      // Dropdown
      return (
        <View style={styles.dropdownContainer}>
          <TouchableOpacity
            style={styles.dropdownButton}
            onPress={() => setIsPropertyDropdownOpen(!isPropertyDropdownOpen)}
            activeOpacity={0.7}
          >
            <Text style={styles.dropdownButtonText}>
              {(props?.selectedItem as any)?.name}
            </Text>
            <SvgXml
              xml={
                !isPropertyDropdownOpen ? downArrowIcon.grey : upArrowIcon.white
              }
            />
          </TouchableOpacity>

          {isPropertyDropdownOpen && (
            <View style={styles.dropdownList}>
              {dropdownItemsList.map((element: any) => (
                <TouchableOpacity
                  key={(element as any)?.id}
                  style={[
                    styles.dropdownItem,
                    (props?.selectedItem as any)?.id == (element as any)?.id &&
                      styles.dropdownItemSelected,
                  ]}
                  onPress={() => {
                    props?.setSelectedItem(element);
                    setIsPropertyDropdownOpen(false);
                  }}
                >
                  <Text
                    style={[
                      styles.dropdownItemText,
                      (props?.selectedItem as any)?.id != (element as any)?.id &&
                        styles.dropdownItemTextSelected,
                    ]}
                  >
                    {(element as any)?.name}
                  </Text>
                  {(props?.selectedItem as any)?.id == (element as any)?.id && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      );
    case 'tabs':
      // Horizontal Tabs
      return (
        <FlatList
          style={styles.flatlistContainer}
          data={scanTypes}
          horizontal
          contentContainerStyle={{ alignItems: 'center' }}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              activeOpacity={0.7}
              style={[
                styles.innerContainer,
                {
                  backgroundColor:
                    (item as any)?.id == (props?.selectedTab as any)?.id
                      ? Colors.white
                      : Colors.grey4,
                  width:
                    Dimensions.get('window').width *
                    (index == 0 ? 0.29 : index == 1 ? 0.32 : 0.31),
                },
              ]}
              disabled={false}
              onPress={() => {
                props?.setSelectedTab && props?.setSelectedTab(item, index); // Called on Tab Press
              }}
            >
              <Text style={styles.tabText}>{`${(item as any)?.name} (${
                index == 0 ? props?.all : index == 1 ? props?.unauthorized : props?.valid
              })`}</Text>
            </TouchableOpacity>
          )}
        />
      );
    default:
      return null;
  }
};

const UserInteractionItem: React.FC<UserInteractionItemProps> = (props: any) => (
  <View style={styles.container}>
    {/* Label Text Row */}
    {props?.haveItemHeader && (
      <View style={props?.haveButton && [styles.edgeToEdge]}>
        <View style={[styles.itemContainer, props?.labelContainerAdditionalStyle]}>
          {/* Label Icon Container */}
          {props?.iconName && (
            <View style={[styles.iconContainer, props?.labelIconAdditionalStyle]}>
              {/* Label Icon */}
              <SvgXml xml={props?.iconName} height={props?.iconSize} width={props?.iconSize} />
            </View>
          )}
          {/* Label Text, with "Read More" feature */}
          <ReadMore
            numberOfLines={props?.numberOfLines}
            seeLessStyle={styles.seeMore}
            seeLessText="Less"
            seeMoreText="More"
            seeMoreStyle={styles.seeMore}
            wrapperStyle={styles.readMoreWrapper}
            style={[
              styles.labelText,
              { fontSize: props?.labelSize },
              props?.labelTextAdditionalStyle,
              !props?.iconName && {paddingLeft: 0}
            ]}
          >
            {props?.labelText}{' '}
            {props?.isDesc && (
              <Text style={styles.descScannedAt}>
                ({(props?.item as any)?.scannedAt})
              </Text>
            )}
          </ReadMore>
        </View>
        {/* "Select All" option */}
        {props?.haveButton && (
          <TouchableOpacity activeOpacity={0.7}>
            <Text style={styles.labelButtonText}>Select All</Text>
          </TouchableOpacity>
        )}
      </View>
    )}
    {/* Subheading Row */}
    {props?.haveItemDescription && (
      <Text style={styles.descText} numberOfLines={props?.numberOfLines}>
        {props?.descText}
      </Text>
    )}
    {/* Text Field / Dropdown / Tabs - Interaction with user */}
    {props?.interactionType && renderInteractingFeature(props)}
  </View>
);

export default UserInteractionItem;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
  },
  itemContainer: {
    // flex: 0.85,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    height: 30,
    width: 30,
    borderRadius: 30 / 2,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 2,
  },
  labelText: {
    paddingLeft: 10,
    color: Colors.textPrimary,
    fontWeight: 'bold',
    fontSize: 15,
  },
  textFieldStyle: {
    backgroundColor: PANTONE7546_RGBA_LIGHT,
    padding: 10,
    borderWidth: 2,
    color: PANTONE7546_RGBA_DEEP,
    borderColor: PANTONE7546_RGBA_LIGHT,
    marginVertical: 10,
    borderRadius: 10,
  },
  edgeToEdge: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  labelButtonText: {
    color: PANTONE7546_RGBA_DEEP,
    fontSize: 14,
  },
  descText: {
    fontStyle: 'italic',
    color: PANTONE7546_RGBA_DEEP,
    fontSize: 13,
  },
  // Dropdown Styles
  dropdownContainer: {
    position: 'relative',
    marginBottom: 16,
    marginTop: 10,
    zIndex: 1000,
  },
  dropdownButton: {
    backgroundColor: PANTONE7546_RGBA_LIGHT,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: PANTONE7546_RGBA_LIGHT,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 50,
  },
  dropdownButtonText: {
    fontSize: 16,
    color: PANTONE7546_RGBA_DEEP,
    flex: 1,
    textAlign: 'left',
  },
  dropdownIcon: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginLeft: 8,
  },
  dropdownList: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: Colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    marginTop: 4,
    maxHeight: 200,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 1001,
  },
  dropdownItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  dropdownItemSelected: {
    backgroundColor: Colors.grey,
    padding: 10,
  },
  dropdownItemText: {
    fontSize: 16,
    color: Colors.textPrimary,
    flex: 1,
    textAlign: 'left',
  },
  dropdownItemTextSelected: {
    color: Colors.primary,
    fontWeight: '600',
  },
  checkmark: {
    fontSize: 16,
    color: Colors.primary,
    marginLeft: 8,
  },
  // Tab styles
  flatlistContainer: {
    flexDirection: 'row',
    borderRadius: 30,
    backgroundColor: Colors.grey4,
    padding: 5,
  },
  innerContainer: {
    borderRadius: 30,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 5,
    paddingVertical: 10,
    width: Dimensions.get('window').width * 0.29,
  },
  tabText: {
    color: Colors.shadow,
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 14,
  },
  descScannedAt: {
    color: '#808080',
    fontSize: 13,
  },
  seeMore: {
    color: '#0000ff',
    textDecorationLine: 'underline',
  },
  readMoreWrapper: { flex: 0.8 },
  whiteBackground: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: PANTONE428
  }
});
