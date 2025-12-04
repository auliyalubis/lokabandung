import { ThemedText } from '@/components/themed-text';
import { FontAwesome5 } from '@expo/vector-icons';
import {
    faArrowLeft,
    faBicycle,
    faBuilding,
    faCalendarAlt,
    faCamera,
    faCameraRetro,
    faCarrot,
    faCheckCircle,
    faChessBoard,
    faChild,
    faCompactDisc,
    faDragon,
    faDrum,
    faEgg,
    faFilm,
    faGamepad,
    faGopuram,
    faGuitar,
    faHammer,
    faHandsHelping,
    faHeart,
    faLandmark,
    faLeaf,
    faLightbulb,
    faMask,
    faMicrophoneAlt,
    faMortarPestle,
    faMusic,
    faPaintBrush,
    faPalette,
    faPenNib,
    faPepperHot,
    faPortrait,
    faQuestionCircle,
    faRedo,
    faSearch,
    faShareAlt,
    faSitemap,
    faStar,
    faStore,
    faSun,
    faTheaterMasks,
    faTicketAlt,
    faTree,
    faTshirt,
    faUsers,
    faUtensils,
    faVideo
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { initializeApp } from 'firebase/app';
import { getDatabase, onValue, ref } from 'firebase/database';
import React from 'react';
import { ActivityIndicator, Alert, Linking, Modal, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View, useColorScheme } from 'react-native';
import MapView, { Callout, Marker } from 'react-native-maps';
import { CulturePromo, promotions as promoList } from './promoData';
import { SeedPoint, seedPoints } from './seedPoints';

const iconMap = {
    "arrow-left": faArrowLeft,
    "paint-brush": faPaintBrush,
    "music": faMusic,
    "utensils": faUtensils,
    "hammer": faHammer,
    "question-circle": faQuestionCircle,
    "times-circle": faRedo,
    "redo": faRedo,
    "calendar-alt": faCalendarAlt,
    "heart": faHeart,
    "share-alt": faShareAlt,
    "ticket-alt": faTicketAlt,
    "search": faSearch,
    "star": faStar,
    "check-circle": faCheckCircle,
    "palette": faPalette,
    "building": faBuilding,
    "child": faChild,
    "film": faFilm,
    "mask": faMask,
    "camera": faCamera,
    "guitar": faGuitar,
    "gopuram": faGopuram,
    "tshirt": faTshirt,
    "bicycle": faBicycle,
    "microphone-alt": faMicrophoneAlt,
    "users": faUsers,
    "store": faStore,
    "landmark": faLandmark,
    "mortar-pestle": faMortarPestle,
    "theater-masks": faTheaterMasks,
    "sun": faSun,
    "hands-helping": faHandsHelping,
    "lightbulb": faLightbulb,
    "compact-disc": faCompactDisc,
    "pepper-hot": faPepperHot,
    "tree": faTree,
    "video": faVideo,
    "leaf": faLeaf,
    "dragon": faDragon,
    "pen-nib": faPenNib,
    "carrot": faCarrot,
    "sitemap": faSitemap,
    "gamepad": faGamepad,
    "portrait": faPortrait,
    "camera-retro": faCameraRetro,
    "drum": faDrum,
    "chess-board": faChessBoard,
    "egg": faEgg,
};

const FaIcon = (props: {
    name: string;
    size: number;
    color: string;
}) => {
    const iconDefinition = iconMap[props.name as keyof typeof iconMap] || faQuestionCircle;
    return <FontAwesomeIcon icon={iconDefinition as any} size={props.size} color={props.color} />;
};

interface PromoMarkerProps {
    promo: CulturePromo;
    onPress: (promo: CulturePromo) => void;
    markerRef: React.MutableRefObject<{ [key: string]: React.ElementRef<typeof Marker> | null }>;
}

const PromoMarker: React.FC<PromoMarkerProps> = ({ promo, onPress, markerRef }) => {
    if (promo.latitude === undefined || promo.longitude === undefined) {
        return null;
    }

    const iconName = promo.icon as string; // Ensure icon is treated as string for FaIcon

    return (
        <Marker
            key={`promo-${promo.id}`}
            ref={(el) => { markerRef.current[`promo-${promo.id}`] = el; }}
            coordinate={{ latitude: promo.latitude, longitude: promo.longitude }}
            onPress={() => onPress(promo)}
        >
            <View style={[styles.customMarkerContainer, { backgroundColor: promo.color }]}>
                <FaIcon name={iconName} size={16} color="#fff" />
            </View>
            <Callout tooltip>
                <View style={styles.calloutContainer}>
                    <ThemedText style={styles.calloutTitle}>{promo.title}</ThemedText>
                    {promo.location && <ThemedText style={styles.calloutDescription}>{promo.location}</ThemedText>}
                </View>
            </Callout>
        </Marker>
    );
};

const firebaseConfig = {
    apiKey: "AIzaSyD--9xkUpx4i9OXB1VCCXjSeGaYAb7c8Y4",
    authDomain: "lokabandung.firebaseapp.com",
    databaseURL: "https://lokabandung-default-rtdb.firebaseio.com",
    projectId: "lokabandung",
    storageBucket: "lokabandung.firebasestorage.app",
    messagingSenderId: "266962242036",
    appId: "1:266962242036:web:91f897ebbc3f588f7011a1"
};

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

interface MarkerData {
    id: string;
    name: string;
    latitude: number;
    longitude: number;
}

export default function MapScreen() {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const [selectedMapStyle, setSelectedMapStyle] = React.useState<'standard' | 'satellite' | 'hybrid' | 'terrain'>('standard');
    const [markers, setMarkers] = React.useState<MarkerData[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [selectedPromo, setSelectedPromo] = React.useState<CulturePromo | null>(null);
    const [promoModalVisible, setPromoModalVisible] = React.useState(false);
    
    const mapRef = React.useRef<MapView>(null);
    const markerRefs = React.useRef<{ [key: string]: React.ElementRef<typeof Marker> | null }>({});
    
    const params = useLocalSearchParams<{ id?: string, lat?: string, lng?: string, label?: string }>();
    const router = useRouter();

    React.useEffect(() => {
        const pointsRef = ref(db, 'points/');
        const unsubscribe = onValue(pointsRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const parsedMarkers = Object.keys(data)
                    .map(key => {
                        const point = data[key];
                        if (typeof point.coordinates !== 'string' || point.coordinates.trim() === '') return null;
                        const coords = point.coordinates.split(',');
                        if (coords.length !== 2) return null;
                        const latitude = parseFloat(coords[0].trim());
                        const longitude = parseFloat(coords[1].trim());
                        if (isNaN(latitude) || isNaN(longitude)) return null;
                        return { id: key, name: point.name || 'Unnamed', latitude, longitude };
                    })
                    .filter((marker): marker is MarkerData => marker !== null);
                setMarkers(parsedMarkers);
            } else {
                setMarkers([]);
            }
            setLoading(false);
        }, (error) => {
            console.error('Firebase error:', error);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    React.useEffect(() => {
        if (params.lat && params.lng && params.id) {
            const latitude = parseFloat(params.lat);
            const longitude = parseFloat(params.lng);

            if (!isNaN(latitude) && !isNaN(longitude) && mapRef.current) {
                const region = {
                    latitude,
                    longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                };
                mapRef.current.animateToRegion(region, 1000);

                setTimeout(() => {
                    const marker = markerRefs.current[params.id!];
                    marker?.showCallout();
                }, 1200); // Delay to allow map to pan

                // Clear params after use to prevent re-triggering
                router.setParams({ id: undefined, lat: undefined, lng: undefined, label: undefined });
            }
        }
    }, [params]);

    const getInitialRegion = () => {
        if (markers.length > 0) {
            return { latitude: markers[0].latitude, longitude: markers[0].longitude, latitudeDelta: 0.05, longitudeDelta: 0.05 };
        }
        return { latitude: -6.9175, longitude: 107.6191, latitudeDelta: 0.0922, longitudeDelta: 0.0421 }; // Default to Bandung
    };
    
    const handlePromoPress = (promo: CulturePromo) => {
        setSelectedPromo(promo);
        setPromoModalVisible(true);
    };

    const closePromoModal = () => {
        setPromoModalVisible(false);
        setSelectedPromo(null);
    };

    const onContactPress = () => {
        if (selectedPromo?.contact) {
            // Check if contact is an email, phone, or URL
            if (selectedPromo.contact.includes('@')) {
                Linking.openURL(`mailto:${selectedPromo.contact}`);
            } else if (selectedPromo.contact.match(/^\+?[0-9\s-]{7,15}$/)) { // Simple phone number regex
                Linking.openURL(`tel:${selectedPromo.contact.replace(/\s/g, '')}`);
            } else if (selectedPromo.contact.startsWith('http')) {
                Linking.openURL(selectedPromo.contact);
            } else {
                Alert.alert('Daftar', `Silakan hubungi ${selectedPromo.contact} untuk mendaftar.`);
            }
        } else {
            Alert.alert('Daftar', 'Informasi kontak untuk pendaftaran tidak tersedia.');
        }
    };

    const openRouteInMaps = () => {
        if (selectedPromo && selectedPromo.latitude && selectedPromo.longitude) {
            const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
            const latLng = `${selectedPromo.latitude},${selectedPromo.longitude}`;
            const label = selectedPromo.title;
            const url = Platform.select({
                ios: `${scheme}${label}@${latLng}`,
                android: `${scheme}${latLng}(${label})`
            });
            Linking.openURL(url!);
        } else {
            Alert.alert('Error', 'Koordinat lokasi tidak tersedia untuk rute ini.');
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0275d8" />
                <Text style={styles.loadingText}>Loading map data...</Text>
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: isDark ? '#1D3D47' : '#fff' }]}>
            <LinearGradient
                colors={isDark ? ['#1D3D47', '#2C5F7F'] : ['#2C5F7F', '#4A7D9D']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.headerContainer}
            >
                <View style={styles.headerTitleContainer}>
                    <ThemedText style={styles.headerTitle}>🗺️ Peta Lokasi</ThemedText>
                    <ThemedText style={styles.headerSubtitle}>Temukan lokasi menarik di Bandung</ThemedText>
                </View>
                <View style={styles.basemapSelector}>
                    <TouchableOpacity
                        style={[styles.basemapButton, selectedMapStyle === 'standard' && styles.basemapButtonActive]}
                        onPress={() => setSelectedMapStyle('standard')}
                    >
                        <ThemedText style={[styles.basemapText, selectedMapStyle === 'standard' && styles.basemapTextActive]}>Standard</ThemedText>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.basemapButton, selectedMapStyle === 'satellite' && styles.basemapButtonActive]}
                        onPress={() => setSelectedMapStyle('satellite')}
                    >
                        <ThemedText style={[styles.basemapText, selectedMapStyle === 'satellite' && styles.basemapTextActive]}>Satellite</ThemedText>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.basemapButton, selectedMapStyle === 'hybrid' && styles.basemapButtonActive]}
                        onPress={() => setSelectedMapStyle('hybrid')}
                    >
                        <ThemedText style={[styles.basemapText, selectedMapStyle === 'hybrid' && styles.basemapTextActive]}>Hybrid</ThemedText>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.basemapButton, selectedMapStyle === 'terrain' && styles.basemapButtonActive]}
                        onPress={() => setSelectedMapStyle('terrain')}
                    >
                        <ThemedText style={[styles.basemapText, selectedMapStyle === 'terrain' && styles.basemapTextActive]}>Terrain</ThemedText>
                    </TouchableOpacity>
                </View>
            </LinearGradient>

            <View style={styles.mapContainer}>
                <MapView
                    ref={mapRef}
                    style={styles.map}
                    initialRegion={getInitialRegion()}
                    showsUserLocation={true}
                    showsMyLocationButton={true}
                    zoomControlEnabled={true}
                    mapType={selectedMapStyle}
                >
                    {markers.map((marker: MarkerData) => (
                        <Marker
                            key={marker.id}
                            ref={(el) => { markerRefs.current[marker.id] = el; }}
                            coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
                            title={marker.name}
                            description={`Coords: ${marker.latitude.toFixed(6)}, ${marker.longitude.toFixed(6)}`}
                        />
                    ))}
                    
                    {promoList.map((promo: CulturePromo) => (
                        <PromoMarker
                            key={`promo-${promo.id}`}
                            promo={promo}
                            onPress={handlePromoPress}
                            markerRef={markerRefs}
                        />
                    ))}
                    
                    {seedPoints.map((pt: SeedPoint) => (
                        <Marker
                            key={`seed-${pt.id}`}
                            ref={(el) => { markerRefs.current[pt.id] = el; }}
                            coordinate={{ latitude: pt.latitude, longitude: pt.longitude }}
                            title={pt.title}
                            description={pt.location || ''}
                        />
                    ))}
                </MapView>
            </View>

            {selectedPromo && (
                <Modal
                    visible={promoModalVisible}
                    animationType="slide"
                    transparent={true}
                    onRequestClose={closePromoModal}
                >
                    <View style={[styles.modalOverlay, { backgroundColor: isDark ? 'rgba(0,0,0,0.8)' : 'rgba(0,0,0,0.5)' }]}>
                        <View style={[styles.modalContainer, { backgroundColor: isDark ? '#2C5F7F' : '#fff' }]}>
                            <View style={[styles.modalHeader, { backgroundColor: selectedPromo.color }]}>
                                <View style={styles.modalHeaderContent}>
                                    <FontAwesome5 name={selectedPromo.icon as any} size={32} color="#fff" />
                                    <ThemedText style={styles.modalTitle}>{selectedPromo.title}</ThemedText>
                                </View>
                                <TouchableOpacity onPress={closePromoModal}>
                                    <FontAwesome5 name="times" size={24} color="#fff" />
                                </TouchableOpacity>
                            </View>
                            <ScrollView style={styles.modalContent}>
                                <View style={styles.modalSection}>
                                    <View style={styles.sectionLabel}>
                                        <FontAwesome5 name="map-marker-alt" size={14} color={selectedPromo.color} />
                                        <ThemedText style={styles.sectionTitle}>Lokasi</ThemedText>
                                    </View>
                                    <ThemedText style={styles.sectionValue}>{selectedPromo.location}</ThemedText>
                                </View>
                                {selectedPromo.time && (
                                    <View style={styles.modalSection}>
                                        <View style={styles.sectionLabel}>
                                            <FontAwesome5 name="clock" size={14} color={selectedPromo.color} />
                                            <ThemedText style={styles.sectionTitle}>Jam Operasional</ThemedText>
                                        </View>
                                        <ThemedText style={styles.sectionValue}>{selectedPromo.time}</ThemedText>
                                    </View>
                                )}
                                {selectedPromo.price && (
                                    <View style={styles.modalSection}>
                                        <View style={styles.sectionLabel}>
                                            <FontAwesome5 name="tag" size={14} color={selectedPromo.color} />
                                            <ThemedText style={styles.sectionTitle}>Harga</ThemedText>
                                        </View>
                                        <ThemedText style={styles.sectionValue}>{selectedPromo.price}</ThemedText>
                                    </View>
                                )}
                                {selectedPromo.contact && (
                                    <View style={styles.modalSection}>
                                        <View style={styles.sectionLabel}>
                                            <FontAwesome5 name="phone" size={14} color={selectedPromo.color} />
                                            <ThemedText style={styles.sectionTitle}>Kontak</ThemedText>
                                        </View>
                                        <ThemedText style={styles.sectionValue}>{selectedPromo.contact}</ThemedText>
                                    </View>
                                )}
                                {selectedPromo.fullDescription && (
                                    <View style={styles.modalSection}>
                                        <ThemedText style={styles.sectionTitle}>Deskripsi</ThemedText>
                                        <ThemedText style={styles.sectionValue}>{selectedPromo.fullDescription}</ThemedText>
                                    </View>
                                )}
                            </ScrollView>
                            <View style={styles.modalFooter}>
                                {selectedPromo?.latitude && selectedPromo?.longitude && (
                                    <TouchableOpacity
                                        style={[styles.registerButton, { backgroundColor: selectedPromo.color }]}
                                        onPress={openRouteInMaps}
                                    >
                                        <FaIcon name="ticket-alt" size={16} color="#fff" />
                                        <ThemedText style={styles.registerButtonText}>Rute</ThemedText>
                                    </TouchableOpacity>
                                )}
                                <TouchableOpacity
                                    style={[styles.closeButton, { backgroundColor: selectedPromo.color }]}
                                    onPress={closePromoModal}
                                >
                                    <ThemedText style={styles.closeButtonText}>Tutup</ThemedText>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#666',
    },
    headerContainer: {
        paddingHorizontal: 20,
        paddingVertical: 15,
        paddingTop: 40,
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25,
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row', // To place basemap selector next to title
        flexWrap: 'wrap', // Allow basemap selector to wrap if too long
    },
    headerTitleContainer: {
        flex: 1, // Take available space
        marginRight: 10, // Space between title and basemap selector
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 5,
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#e0e0e0',
    },
    basemapSelector: {
        flexDirection: 'row',
        gap: 8,
        paddingVertical: 5, // Reduce vertical padding
        paddingHorizontal: 5, // Reduce horizontal padding
        backgroundColor: 'rgba(255,255,255,0.2)', // Semi-transparent background
        borderRadius: 10,
    },
    basemapButton: {
        paddingVertical: 6, // Adjusted for smaller buttons
        paddingHorizontal: 10, // Adjusted for smaller buttons
        borderRadius: 8,
        backgroundColor: 'transparent', // Transparent background by default
    },
    basemapButtonActive: {
        backgroundColor: '#fff', // Active button has white background
    },
    basemapText: {
        fontSize: 10, // Smaller font size
        fontWeight: '600',
        color: '#fff', // White text by default
    },
    basemapTextActive: {
        color: '#2C5F7F', // Active text color darker
    },
    mapContainer: {
        flex: 1,
    },
    map: {
        width: '100%',
        height: '100%',
    },
    // Modal styles from previous context
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    modalContainer: {
        height: '75%',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        overflow: 'hidden',
    },
    modalHeader: {
        padding: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    modalHeaderContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        flex: 1,
    },
    modalTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        flex: 1,
    },
    modalContent: {
        flex: 1,
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    modalSection: {
        marginBottom: 16,
    },
    sectionLabel: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 6,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    sectionValue: {
        fontSize: 13,
        lineHeight: 19,
    },
    modalFooter: {
        paddingHorizontal: 16,
        paddingBottom: 20,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,0.1)',
        flexDirection: 'row', // Arrange buttons in a row
        gap: 10, // Space between buttons
    },
    closeButton: {
        flex: 1, // Allow button to grow
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        flexDirection: 'row', // For icon and text
        justifyContent: 'center',
        gap: 8,
    },
    closeButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
    },
    registerButton: {
        flex: 1, // Allow button to grow
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        flexDirection: 'row', // For icon and text
        justifyContent: 'center',
        gap: 8,
    },
    registerButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
    },
    customMarkerContainer: {
        width: 30,
        height: 30,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 4,
    },
    calloutContainer: {
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 10,
        width: 180, // Fixed width for better readability
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 3,
    },
    calloutTitle: {
        fontWeight: 'bold',
        fontSize: 14,
        marginBottom: 4,
        color: '#333', // Darker color for title
    },
    calloutDescription: {
        fontSize: 12,
        color: '#666',
    },
});
