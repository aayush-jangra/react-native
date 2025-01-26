import React from 'react';
import {Modal, ModalProps, Pressable, StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  menuContainer: {
    backgroundColor: '#00000080',
    height: '100%',
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-end',
  },
  menu: {
    padding: 16,
  },
});

export const CustomModalMenu = ({
  visible,
  onRequestClose,
  children,
  ...props
}: ModalProps) => {
  return (
    <Modal
      transparent
      visible={visible}
      onRequestClose={onRequestClose}
      {...props}>
      <Pressable style={styles.menuContainer} onPress={onRequestClose}>
        <Pressable style={styles.menu}>{children}</Pressable>
      </Pressable>
    </Modal>
  );
};
