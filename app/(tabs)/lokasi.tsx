import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useRouter } from 'expo-router';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, push, get, DataSnapshot } from 'firebase/database'; // Import 'push' and 'get'
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Linking, Platform, RefreshControl, SectionList, StyleSheet, TouchableOpacity, View, Alert } from 'react-native'; // Import Alert
import firebaseConfig from '../../config/firebaseConfig';
import { SeedPoint, seedPoints } from './seedPoints';
import * as Haptics from 'expo-haptics'; // Import Haptics
import { useFavorites, FavoriteItem as ContextFavoriteItem } from '../../contexts/FavoritesContext'; // Import useFavorites and FavoriteItem

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
    faMapMarkerAlt, faMountain, faFire, faLeaf, faTractor, faShip, faTree,
    faGlobeAsia, faWater, faAnchor, faCampground, faHippo, // Replaced faDeer
    faSwimmer, faTrain, faPaw, faShoppingBag, faWalking, faStore, // Replaced faRollerCoaster
    faCity, faShoppingCart, faTshirt, faCameraRetro, faUniversity, faBuilding, faLandmark, faStar, faMapMarkedAlt
} from '@fortawesome/free-solid-svg-icons';

// Custom FontAwesome5 component for consistency with explore.tsx
const iconMap = {
    "map-marker-alt": faMapMarkerAlt,
    "mountain": faMountain,
    "fire": faFire,
    "leaf": faLeaf,
    "tractor": faTractor,
    "ship": faShip,
    "tree": faTree,
    "globe-asia": faGlobeAsia,
    "pagelines": faLeaf, // Replaced faPagelines with faLeaf
    "water": faWater,
    "anchor": faAnchor,
    "campground": faCampground,
    "deer": faHippo, // Replaced faDeer
    "swimmer": faSwimmer,
    "roller-coaster": faTrain, // Replaced faRollerCoaster
    "paw": faPaw,
    "shopping-bag": faShoppingBag,
    "walking": faWalking,
    "store": faStore,
    "city": faCity,
    "shopping-cart": faShoppingCart,
    "tshirt": faTshirt,
    "camera-retro": faCameraRetro,
    "university": faUniversity,
    "building": faBuilding,
    "landmark": faLandmark,
    "star": faStar,
    "map-marked-alt": faMapMarkedAlt,
};

const FontAwesome5 = (props: {
    name: string;
    size: number;
    color: string;
}) => {
    const iconDefinition = iconMap[props.name as keyof typeof iconMap] || faMapMarkerAlt; // Default to map-marker-alt
    return <FontAwesomeIcon icon={iconDefinition as any} size={props.size} color={props.color} />;
};

interface PointItem {
    id: string;
    name: string;
    coordinates: string;
    accuration?: string;
    description?: string;
    icon?: string;
    color?: string;
    latitude?: number; // Added
    longitude?: number; // Added
}

interface SectionData {
    title: string;
    data: PointItem[];
}

export default function LokasiScreen() {
    const [sections, setSections] = useState<SectionData[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const router = useRouter();
    const { addFavorite, removeFavorite, isFavorite } = useFavorites(); // Use useFavorites hook

    // Initialize Firebase (keeping for now, but not directly used for favorites anymore)
    let app;
    try {
        app = initializeApp(firebaseConfig);
    } catch (error: any) {
        if (error.code === 'app/duplicate-app') {
            const { getApps } = require('firebase/app');
            app = getApps()[0];
        } else {
            throw error;
        }
    }
    const db = getDatabase(app);

    const handlePress = (item: PointItem) => {
        if (!item.latitude || !item.longitude) {
            Alert.alert('Lokasi Tidak Valid', 'Koordinat untuk lokasi ini tidak tersedia.');
            return;
        }
        router.push({
            pathname: '/(tabs)/gmap',
            params: {
                id: item.id,
                lat: item.latitude,
                lng: item.longitude,
                label: item.name
            }
        });
    };

    const handleToggleFavorite = async (item: PointItem) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        const favoriteData: ContextFavoriteItem = {
            id: item.id,
            name: item.name,
            type: 'location',
            imageUrl: undefined, // Assuming locations don't have images here, can be added if needed
            description: item.description,
        };

        if (isFavorite(item.id)) {
            await removeFavorite(item.id);
            Alert.alert('Dihapus dari Favorit', `${item.name} telah dihapus dari daftar favorit.`);
        } else {
            await addFavorite(favoriteData);
            Alert.alert('Ditambahkan ke Favorit', `${item.name} telah ditambahkan ke daftar favorit!`);
        }
    };

    useEffect(() => {
        const heritageSection: SectionData = {
            title: 'Heritage Spots',
            data: seedPoints.map((sp: SeedPoint) => ({
                id: sp.id,
                name: sp.title,
                coordinates: `${sp.latitude}, ${sp.longitude}`,
                latitude: sp.latitude,
                longitude: sp.longitude,
                description: sp.description,
                icon: sp.icon,
                color: sp.color,
            }))
        };
        setSections([heritageSection]);
        setLoading(false);
    }, []);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setTimeout(() => setRefreshing(false), 1000);
    }, []);

    return (
        <View style={styles.container}>
            {loading ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" />
                </View>
            ) : sections.length > 0 ? (
                <SectionList
                    sections={sections}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.card}
                            onPress={() => {
                                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                handlePress(item);
                            }}
                            activeOpacity={0.85}
                        >
                            <View style={[styles.thumb, { backgroundColor: item.color || '#E8F4F8' }]}>
                                <View style={[styles.pinCircle, { backgroundColor: item.color || '#2C5F7F' }]}>
                                    <FontAwesome5 name={item.icon || "map-marker-alt"} size={18} color="#fff" />
                                </View>
                            </View>

                            <View style={styles.cardBody}>
                                <ThemedText style={styles.cardTitle}>{item.name}</ThemedText>
                                {item.description && <ThemedText style={styles.cardDescription}>{item.description}</ThemedText>}
                                <ThemedText style={styles.cardSubtitle}>{item.coordinates}</ThemedText>
                            </View>

                            <View style={styles.cardActions}>
                                <TouchableOpacity
                                    style={styles.actionButton}
                                    onPress={(e) => {
                                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                        if (Platform.OS === 'web') e.stopPropagation();
                                        handlePress(item);
                                    }}
                                >
                                    <FontAwesome5 name="map-marked-alt" size={16} color={item.color || "#2C5F7F"} />
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[styles.actionButton, { marginTop: 8 }]}
                                    onPress={(e) => {
                                        if (Platform.OS === 'web') e.stopPropagation();
                                        handleToggleFavorite(item);
                                    }}
                                >
                                    <FontAwesome5
                                        name="star"
                                        size={16}
                                        color={isFavorite(item.id) ? '#FFD700' : '#ccc'} // Change color if favorited
                                    />
                                </TouchableOpacity>
                            </View>
                        </TouchableOpacity>
                    )}
                    renderSectionHeader={({ section: { title } }) => (
                        <ThemedText style={styles.header}>{title}</ThemedText>
                    )}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                    contentContainerStyle={{ paddingBottom: 80 }}
                />
            ) : (
                <ThemedView style={styles.emptyContainer}>
                    <ThemedText>Tidak ada data lokasi tersimpan.</ThemedText>
                </ThemedView>
            )}
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    listContent: {
        paddingBottom: 100,
    },
    item: {
        backgroundColor: '#B3E5FC',
        marginVertical: 4,
        marginHorizontal: 12,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 14,
        paddingLeft: 16,
        paddingRight: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    leftContent: {
        flex: 1,
        marginRight: 12,
    },
    itemName: {
        fontSize: 15,
        fontWeight: '600',
        color: '#000',
        marginBottom: 3,
    },
    coordinates: {
        fontSize: 12,
        color: '#333',
        fontWeight: '400',
    },
    iconContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    iconButton: {
        padding: 4,
    },
    header: {
        fontSize: 18,
        fontWeight: 'bold',
        backgroundColor: '#000000',
        color: '#FFFFFF',
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#dae1e6ff',
        marginVertical: 8,
        marginHorizontal: 12,
        padding: 12,
        borderRadius: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
    },
    thumb: {
        width: 56,
        height: 56,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    pinCircle: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardBody: {
        flex: 1,
    },
    cardTitle: {
        fontSize: 15,
        fontWeight: '600',
    },
    cardSubtitle: {
        fontSize: 12,
        color: '#666',
        marginTop: 4,
    },
    cardDescription: { // New style for description
        fontSize: 12,
        color: '#888',
        marginTop: 4,
        marginBottom: 4,
    },
    cardActions: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    actionButton: {
        padding: 8,
        borderRadius: 8,
        backgroundColor: '#fff',
        borderWidth: 0.5,
        borderColor: '#eee',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
