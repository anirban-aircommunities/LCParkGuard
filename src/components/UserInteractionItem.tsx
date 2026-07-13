import React, { Fragment, useState } from "react";
import { Dimensions, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Colors, PANTONE7546, PANTONE7546_RGBA_DEEP, PANTONE7546_RGBA_LIGHT } from "../constants/Colors";
import { SvgXml } from "react-native-svg";
import { downArrowIcon, upArrowIcon } from "./Icons";
import { scanTypes } from "../constants/Constants";
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
}
const renderInteractingFeature = (interactionType: string, value: any, onChange: () => void, placeholder: any, dropdownItems: any, setSelectedItem: (item: any) => void, selectedItem: any, selectedTab: any, setSelectedTab: (item: any, index: number) => void, all: number | undefined, unauthorized: number | undefined, valid: number | undefined) => {
    const [isPropertyDropdownOpen, setIsPropertyDropdownOpen] = useState(false);
    let dropdownItemsList = dropdownItems;
    switch (interactionType) {
        case "textbox":
            return <TextInput
                value={value}
                onChange={onChange}
                style={styles.textFieldStyle}
                placeholder={placeholder}
                placeholderTextColor={Colors.grey2}
                autoFocus={false}
            />
        case "dropdown":
            return (
                <View style={styles.dropdownContainer}>
                    <TouchableOpacity
                        style={styles.dropdownButton}
                        onPress={() => setIsPropertyDropdownOpen(!isPropertyDropdownOpen)}
                        activeOpacity={0.7}>
                        <Text style={styles.dropdownButtonText}>
                            {(selectedItem as any)?.name}
                        </Text>
                        <SvgXml
                            xml={!isPropertyDropdownOpen ? downArrowIcon.grey : upArrowIcon.white}
                        />
                    </TouchableOpacity>

                    {isPropertyDropdownOpen && (
                        <View style={styles.dropdownList}>
                            {dropdownItemsList.map((element: any) => (
                                <TouchableOpacity
                                    key={(element as any)?.id}
                                    style={[
                                        styles.dropdownItem,
                                        (selectedItem as any)?.id == (element as any)?.id && styles.dropdownItemSelected,
                                    ]}
                                    onPress={() => {
                                        setSelectedItem(element);
                                        setIsPropertyDropdownOpen(false);
                                    }}
                                >
                                    <Text
                                        style={[
                                            styles.dropdownItemText,
                                            (selectedItem as any)?.id != (element as any)?.id && styles.dropdownItemTextSelected,
                                        ]}>
                                        {(element as any)?.name}
                                    </Text>
                                    {(selectedItem as any)?.id == (element as any)?.id && (
                                        <Text style={styles.checkmark}>✓</Text>
                                    )}
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}
                </View>
            )
        case "tabs":
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
                                    backgroundColor: (item as any)?.id == (selectedTab as any)?.id ? Colors.white : Colors.grey4,
                                    width: Dimensions.get('window').width * (index == 0 ? 0.29 : index == 1 ? 0.32 : 0.31),
                                },
                            ]}
                            disabled={false}
                            onPress={() => {
                                setSelectedTab && setSelectedTab(item, index); // Called on Tab Press
                            }}
                        >
                            <Text style={styles.tabText}>{`${(item as any)?.name} (${index == 0 ? all : index == 1 ? unauthorized : valid})`}</Text>
                        </TouchableOpacity>
                    )}
                />
            )
        default:
            return null;
    }
}

const UserInteractionItem: React.FC<UserInteractionItemProps> = ({ haveItemHeader, haveItemDescription, haveButton, descText, iconName, iconSize, labelIconAdditionalStyle, labelText, labelSize, labelTextAdditionalStyle, labelContainerAdditionalStyle, interactionType, value, onChange, placeholder, dropdownItems, setSelectedItem, selectedItem, selectedTab, setSelectedTab, all, unauthorized, valid, numberOfLines, item, isDesc } : any) => (
    <View style={styles.container}>
        {/* Label Text Row */}
        {
            haveItemHeader &&
            <View style={haveButton && [styles.edgeToEdge]}>
                <View style={[styles.itemContainer, labelContainerAdditionalStyle]}>
                    {iconName && <View style={[styles.iconContainer, labelIconAdditionalStyle]}>
                        <SvgXml xml={iconName} height={iconSize} width={iconSize}/>
                    </View>}
                    <ReadMore 
                        numberOfLines={numberOfLines}
                        seeLessStyle={styles.seeMore}
                        seeLessText="Less"
                        seeMoreText="More"
                        seeMoreStyle={styles.seeMore}
                        style={[styles.labelText, {fontSize: labelSize}, labelTextAdditionalStyle]}
                    >
                        {labelText}{isDesc && <Text style={styles.descScannedAt}> ({(item as any)?.scannedAt})</Text>}
                    </ReadMore>
                </View>
                {haveButton && 
                <TouchableOpacity activeOpacity={0.7}   >
                    <Text style={styles.labelButtonText}>Select All</Text>
                </TouchableOpacity>}
            </View>
        }
        {/* Subheading Row */}
        {haveItemDescription && <Text style={styles.descText} numberOfLines={numberOfLines}>{descText}</Text>}
        {/* Text Field / Dropdown / Tabs - Interaction with user */}
        {interactionType && renderInteractingFeature(interactionType, value, onChange, placeholder, dropdownItems, setSelectedItem, selectedItem, selectedTab, setSelectedTab, all, unauthorized, valid)}
    </View>
)

export default UserInteractionItem;

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.white,
    },
    itemContainer: {
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
        padding: 2
    },
    labelText: {
        paddingLeft: 10,
        color: Colors.textPrimary,
        fontWeight: 'bold',
        fontSize: 15
    },
    textFieldStyle: {
        backgroundColor: PANTONE7546_RGBA_LIGHT,
        padding: 10,
        borderWidth: 2,
        color: PANTONE7546_RGBA_DEEP,
        borderColor: PANTONE7546_RGBA_LIGHT,
        marginBottom: 10,
        borderRadius: 10
    },
    edgeToEdge: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'    
    },
    labelButtonText: {
        color: PANTONE7546_RGBA_DEEP,
        fontSize: 14
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
        padding: 10
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
        fontSize: 13
    },
    seeMore: {
        color: '#0000ff',
        textDecorationLine: 'underline'
    }
})