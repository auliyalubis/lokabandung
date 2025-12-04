import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, ScrollView, Platform, Alert, Modal } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { useColorScheme } from 'react-native';

import { useFavorites, FavoriteItem } from '@/contexts/FavoritesContext';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';

interface EditFavoriteOverlayProps {
  isVisible: boolean;
  itemToEdit: FavoriteItem | null;
  onClose: () => void;
  onSave: (updatedItem: FavoriteItem) => void;
}

export function EditFavoriteOverlay({ isVisible, itemToEdit, onClose, onSave }: EditFavoriteOverlayProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);
  const [story, setStory] = useState(''); // New state for story

  useEffect(() => {
    if (itemToEdit) {
      setName(itemToEdit.name);
      setDescription(itemToEdit.description || '');
      setImageUrl(itemToEdit.imageUrl);
      setStory(itemToEdit.story || ''); // Initialize story state
    } else {
      // Reset form if no item is being edited (e.g., when modal closes)
      setName('');
      setDescription('');
      setImageUrl(undefined);
      setStory('');
    }
  }, [itemToEdit]);

  const pickImage = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Sorry, we need camera roll permissions to make this work!');
        return;
      }
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImageUrl(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Sorry, we need camera permissions to make this work!');
        return;
      }
    }

    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImageUrl(result.assets[0].uri);
    }
  };

  const handleSave = () => {
    if (itemToEdit) {
      const updatedItem: FavoriteItem = {
        ...itemToEdit,
        name,
        description,
        imageUrl,
        story, // Include story in the updated item
      };
      onSave(updatedItem);
      onClose();
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <ThemedView style={styles.centeredView}>
        <ThemedView style={[styles.modalView, { backgroundColor: isDark ? '#1D3D47' : '#f8f9fa' }]}>
          {/* Header */}
          <View style={[styles.header, { backgroundColor: isDark ? '#12202A' : '#2C5F7F' }]}>
            <TouchableOpacity onPress={onClose} style={styles.backButton}>
              <FontAwesome5 name="times" size={24} color="#fff" />
            </TouchableOpacity>
            <ThemedText style={styles.headerTitle}>Edit Item Favorit</ThemedText>
            <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
              <FontAwesome5 name="save" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content}>
            <ThemedText style={styles.label}>Nama:</ThemedText>
            <TextInput
              style={[styles.input, { color: isDark ? '#fff' : '#000', borderColor: isDark ? '#555' : '#ccc' }]}
              value={name}
              onChangeText={setName}
              placeholder="Nama Item"
              placeholderTextColor={isDark ? '#aaa' : '#666'}
            />

            <ThemedText style={styles.label}>Deskripsi:</ThemedText>
            <TextInput
              style={[styles.input, styles.textArea, { color: isDark ? '#fff' : '#000', borderColor: isDark ? '#555' : '#ccc' }]}
              value={description}
              onChangeText={setDescription}
              placeholder="Deskripsi Item (Opsional)"
              placeholderTextColor={isDark ? '#aaa' : '#666'}
              multiline
            />

            {/* New Story Input */}
            <ThemedText style={styles.label}>Cerita Pengalaman:</ThemedText>
            <TextInput
              style={[styles.input, styles.textArea, { color: isDark ? '#fff' : '#000', borderColor: isDark ? '#555' : '#ccc' }]}
              value={story}
              onChangeText={setStory}
              placeholder="Bagikan cerita pengalaman Anda (Opsional)"
              placeholderTextColor={isDark ? '#aaa' : '#666'}
              multiline
            />

            <ThemedText style={styles.label}>Gambar:</ThemedText>
            {imageUrl && <Image source={{ uri: imageUrl }} style={styles.imagePreview} />}

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
                <FontAwesome5 name="image" size={20} color="#fff" />
                <Text style={styles.imageButtonText}>Pilih dari Galeri</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.imageButton} onPress={takePhoto}>
                <FontAwesome5 name="camera" size={20} color="#fff" />
                <Text style={styles.imageButtonText}>Ambil Foto</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </ThemedView>
      </ThemedView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)', // Dim background
  },
  modalView: {
    margin: 20,
    borderRadius: 20,
    width: '90%',
    maxHeight: '80%',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 15, // Adjusted for modal, not full screen
    paddingBottom: 15,
    paddingHorizontal: 16,
    borderTopLeftRadius: 20, // Apply to modal corners
    borderTopRightRadius: 20,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  saveButton: {
    padding: 5,
  },
  content: {
    padding: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    marginTop: 10,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    fontSize: 16,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 15,
    backgroundColor: '#e0e0e0',
    resizeMode: 'cover',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 15,
    marginBottom: 20,
  },
  imageButton: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  imageButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});