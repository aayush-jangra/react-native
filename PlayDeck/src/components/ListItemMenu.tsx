import React, {useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import IconEntypo from 'react-native-vector-icons/Entypo';
import {CustomModalMenu} from './CustomModalMenu';

const styles = StyleSheet.create({
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

export interface ListMenuItem {
  icon: React.ReactNode;
  text: string;
  onPress: () => void;
}

export const ListItemMenu = ({menuItems}: {menuItems: ListMenuItem[]}) => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <>
      <TouchableOpacity onPress={() => setShowMenu(true)}>
        <IconEntypo name="dots-three-vertical" size={18} color={'white'} />
      </TouchableOpacity>
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
    </>
  );
};
