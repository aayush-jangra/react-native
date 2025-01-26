import React, {useState} from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    backgroundColor: '#00000080',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modal: {
    width: '90%',
    backgroundColor: '#FAFCFC',
    padding: 16,
    borderRadius: 16,
    gap: 16,
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
  createButton: {
    padding: 16,
    borderRadius: 100,
    backgroundColor: '#222625',
    flexShrink: 1,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#222625',
    elevation: 10,
  },
  disabledCreateButton: {
    backgroundColor: '#C7D0CF',
  },
  createText: {
    color: '#FAFCFC',
    fontSize: 16,
    fontWeight: 500,
  },
  input: {
    backgroundColor: '#464D4B',
    borderWidth: 4,
    borderColor: '#222625',
    paddingHorizontal: 16,
    color: '#FAFCFC',
    borderRadius: 8,
    fontSize: 20,
  },
  errorText: {
    color: 'red',
  },
});

export const CreatePlaylistModal = ({
  visible,
  existingPlaylistNames,
  onClose,
  onCreate,
}: {
  visible: boolean;
  existingPlaylistNames: string[];
  onClose: () => void;
  onCreate: (name: string) => void;
}) => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleChange = (text: string) => {
    const filteredName = text.replace(/[^a-zA-Z0-9\s]/g, '');
    setName(filteredName);

    if (existingPlaylistNames.some(value => value === filteredName)) {
      setError('Playlist already exists with this name');
    } else {
      setError('');
    }
  };

  const createDisabled = name === '' || error !== '';

  return (
    <Modal
      animationType="fade"
      transparent
      onRequestClose={onClose}
      visible={visible}>
      <View style={styles.container}>
        <View style={styles.modal}>
          <View>
            <TextInput
              maxLength={30}
              style={styles.input}
              placeholder="Name"
              placeholderTextColor={'#D7DFDF'}
              value={name}
              onChangeText={handleChange}
            />
            {error && <Text style={styles.errorText}>{error}</Text>}
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              disabled={createDisabled}
              onPress={() => onCreate(name)}
              style={[
                styles.createButton,
                createDisabled ? styles.disabledCreateButton : {},
              ]}>
              <Text style={styles.createText}>Create</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
