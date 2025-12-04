import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useState } from 'react'; // Import useState
import { ScrollView, StyleSheet, TouchableOpacity, useColorScheme, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useFavorites, FavoriteItem } from '@/contexts/FavoritesContext';
import { EditFavoriteOverlay } from './edit-favorite-modal'; // Corrected import path

export default function FavoritesScreen() {
    const router = useRouter();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const { favorites, removeFavorite, updateFavorite } = useFavorites(); // Get updateFavorite from context

    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [editingItem, setEditingItem] = useState<FavoriteItem | null>(null);

    const handleRemoveFavorite = (id: string) => {
        removeFavorite(id);
    };

    const handleEditFavorite = (id: string) => {
        const item = favorites.find(fav => fav.id === id);
        if (item) {
            setEditingItem(item);
            setIsEditModalVisible(true);
        }
    };

    const handleCloseEditModal = () => {
        setIsEditModalVisible(false);
        setEditingItem(null); // Clear the editing item
    };

    const handleSaveEditedFavorite = async (updatedItem: FavoriteItem) => {
        await updateFavorite(updatedItem.id, updatedItem);
        handleCloseEditModal(); // Close after saving
    };

    const renderFavoriteItem = (item: FavoriteItem) => {
        return (
            <ThemedView key={item.id} style={styles.favoriteCard}>
                <View style={styles.favoriteCardContent}>
                    {item.imageUrl && (
                        <Image source={{ uri: item.imageUrl }} style={styles.favoriteImage} contentFit="cover" />
                    )}
                    <View style={styles.favoriteDetails}>
                        <ThemedText style={styles.favoriteTitle}>{item.name}</ThemedText>
                        {item.description && (
                            <ThemedText style={styles.favoriteDescription}>{item.description}</ThemedText>
                        )}
                        {item.story && ( // Display story if available
                            <ThemedText style={styles.favoriteDescription}>"{item.story}"</ThemedText>
                        )}
                        <ThemedText style={styles.favoriteType}>{item.type === 'location' ? 'Lokasi' : 'Promosi'}</ThemedText>
                    </View>
                </View>
                <View style={styles.actionsContainer}>
                  <TouchableOpacity onPress={() => handleEditFavorite(item.id)} style={styles.editButton}>
                      <FontAwesome5 name="edit" size={20} color="#007bff" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleRemoveFavorite(item.id)} style={styles.removeButton}>
                      <FontAwesome5 name="trash" size={20} color="#FF6B6B" />
                  </TouchableOpacity>
                </View>
            </ThemedView>
        );
    };

    return (
        <ThemedView style={[styles.container, { backgroundColor: isDark ? '#1D3D47' : '#f8f9fa' }]}>
            {/* Header */}
            <View style={[styles.header, { backgroundColor: isDark ? '#12202A' : '#2C5F7F' }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <FontAwesome5 name="arrow-left" size={24} color="#fff" />
                </TouchableOpacity>
                <ThemedText style={styles.headerTitle}>Lokasi & Promosi Favorit</ThemedText>
            </View>

            <ScrollView style={styles.content}>
                {favorites.length > 0 ? (
                    favorites.map(renderFavoriteItem)
                ) : (
                    <View style={styles.placeholderContainer}>
                        <FontAwesome5 name="heart" size={50} color={isDark ? '#aaa' : '#ccc'} />
                        <ThemedText type="subtitle" style={styles.placeholderText}>
                            Belum ada item favorit.
                        </ThemedText>
                        <ThemedText style={styles.placeholderSubtitle}>
                            Tambahkan lokasi atau promosi yang Anda sukai untuk melihatnya di sini.
                        </ThemedText>
                    </View>
                )}
            </ScrollView>

            {editingItem && ( // Only render if an item is being edited
                <EditFavoriteOverlay
                    isVisible={isEditModalVisible}
                    itemToEdit={editingItem}
                    onClose={handleCloseEditModal}
                    onSave={handleSaveEditedFavorite}
                />
            )}
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 50,
        paddingBottom: 20,
        paddingHorizontal: 16,
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,
        marginBottom: 10,
    },
    backButton: {
        marginRight: 15,
        padding: 5,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
    },
    content: {
        flex: 1,
        paddingHorizontal: 16,
    },
    placeholderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50,
        padding: 20,
        borderRadius: 10,
        backgroundColor: 'rgba(0,0,0,0.05)',
    },
    placeholderText: {
        marginTop: 20,
        fontSize: 18,
        color: '#666',
        textAlign: 'center',
    },
    placeholderSubtitle: {
        marginTop: 5,
        fontSize: 14,
        color: '#888',
        textAlign: 'center',
    },
    favoriteCard: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 10,
        marginBottom: 10,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    favoriteCardContent: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    favoriteImage: {
        width: 60,
        height: 60,
        borderRadius: 8,
        marginRight: 10,
    },
    favoriteDetails: {
        flex: 1,
    },
    favoriteTitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    favoriteDescription: {
        fontSize: 12,
        color: '#666',
    },
    favoriteType: {
        fontSize: 10,
        color: '#999',
        marginTop: 5,
    },
    removeButton: {
        padding: 8,
    },
    actionsContainer: {
        flexDirection: 'row',
        gap: 10,
        marginLeft: 10,
    },
    editButton: {
        padding: 8,
    },
});