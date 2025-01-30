import React from 'react';
import {
  Modal,
  ModalProps,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface ConfirmationModalProps extends ModalProps {
  confirmationText: string;
  onConfirm: () => void;
  onClose: () => void;
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#00000080',
    height: '100%',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
  },
  modal: {
    backgroundColor: '#FAFCFC',
    padding: 16,
    margin: 32,
    borderRadius: 24,
  },
  confirmationText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    marginVertical: 16,
    paddingLeft: 8,
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cancelButton: {
    padding: 16,
    borderRadius: 100,
    backgroundColor: '#FAFCFC',
    flexShrink: 1,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#222625',
  },
  cancelText: {
    color: '#222625',
    fontSize: 16,
    fontWeight: 500,
  },
  deleteButton: {
    padding: 16,
    borderRadius: 100,
    backgroundColor: '#ED2647',
    flexShrink: 1,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#58001E',
    elevation: 10,
  },
  deleteText: {
    color: '#FAFCFC',
    fontSize: 16,
    fontWeight: 500,
  },
});

export const ConfirmationModal = ({
  visible,
  onClose,
  onConfirm,
  confirmationText,
  ...props
}: ConfirmationModalProps) => {
  return (
    <Modal transparent visible={visible} {...props}>
      <Pressable style={styles.container} onPress={onClose}>
        <Pressable style={styles.modal}>
          <Text style={styles.confirmationText}>{confirmationText}</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                onConfirm();
                onClose();
              }}
              style={styles.deleteButton}>
              <Text style={styles.deleteText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};
