import React, {useState} from 'react';
import IconMaterialCommunity from 'react-native-vector-icons/MaterialCommunityIcons';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {CustomModalMenu} from '../../components/CustomModalMenu';
import {ListMenuItem} from '../../components/ListItemMenu';
import {SortOptions} from './sortOptions';

const styles = StyleSheet.create({
  sorting: {
    display: 'flex',
    alignItems: 'flex-end',
  },
  container: {
    backgroundColor: '#222625',
    padding: 12,
    borderRadius: 12,
    display: 'flex',
    gap: 16,
  },
  option: {
    display: 'flex',
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
  },
  optionText: {
    fontSize: 16,
    color: 'white',
  },
});

export const SortButton = ({
  sortPreference,
  onSortingChange,
}: {
  sortPreference: SortOptions;
  onSortingChange: (sortPref: SortOptions) => void;
}) => {
  const [showMenu, setShowMenu] = useState(false);

  const menuItems: ListMenuItem[] = [
    {
      icon: (
        <IconMaterialCommunity
          name="sort-alphabetical-ascending"
          color={'white'}
          size={32}
        />
      ),
      text: 'A to Z',
      onPress: () => onSortingChange('a2z'),
    },
    {
      icon: (
        <IconMaterialCommunity
          name="sort-alphabetical-descending"
          color={'white'}
          size={32}
        />
      ),
      text: 'Z to A',
      onPress: () => onSortingChange('z2a'),
    },
    {
      icon: (
        <IconMaterialCommunity
          name="sort-calendar-descending"
          color={'white'}
          size={32}
        />
      ),
      text: 'Recently Added',
      onPress: () => onSortingChange('recentlyAdded'),
    },
    {
      icon: (
        <IconMaterialCommunity
          name="sort-calendar-ascending"
          color={'white'}
          size={32}
        />
      ),
      text: 'Oldest Added',
      onPress: () => onSortingChange('oldestAdded'),
    },
  ];

  const getIconName = () => {
    switch (sortPreference) {
      case 'a2z':
        return 'sort-alphabetical-ascending';
      case 'z2a':
        return 'sort-alphabetical-descending';
      case 'recentlyAdded':
        return 'sort-calendar-descending';
      case 'oldestAdded':
        return 'sort-calendar-ascending';
      default:
        return 'sort-alphabetical-ascending';
    }
  };

  return (
    <>
      <TouchableOpacity
        style={styles.sorting}
        onPress={() => setShowMenu(true)}>
        <IconMaterialCommunity name={getIconName()} size={36} color="#F2FEFF" />
      </TouchableOpacity>
      {showMenu && (
        <CustomModalMenu
          visible={showMenu}
          onRequestClose={() => setShowMenu(false)}>
          <View style={styles.container}>
            {menuItems.map(({icon, text, onPress}, index) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    setShowMenu(false);
                    onPress();
                  }}
                  key={index}
                  style={styles.option}>
                  {icon}
                  <Text style={styles.optionText}>{text}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </CustomModalMenu>
      )}
    </>
  );
};
