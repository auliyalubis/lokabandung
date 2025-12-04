import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, View, TouchableOpacity, TextInput, Modal, StyleSheet, Share, Alert, Linking, Animated } from 'react-native';


import { LinearGradient } from 'expo-linear-gradient';

import { useFavorites, FavoriteItem } from '@/contexts/FavoritesContext';



import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
    faArrowLeft, faPaintBrush, faMusic, faUtensils, faHammer, faQuestionCircle,
    faTimesCircle, faRedo, faCalendarAlt, faHeart, faShareAlt, faTicketAlt,
    faSearch, faStar, faCheckCircle, faPalette, faBuilding, faChild, faFilm,
    faMask, faCamera, faGuitar, faGopuram, faTshirt, faBicycle, faMicrophoneAlt,
    faUsers, faStore, faLandmark, faMortarPestle, faTheaterMasks, faSun,
    faHandsHelping, faLightbulb, faCompactDisc, faPepperHot, faTree, faVideo,
    faLeaf, faDragon, faPenNib, faCarrot, faSitemap, faGamepad,
    faPortrait, faCameraRetro, faDrum, faChessBoard, faEgg
} from '@fortawesome/free-solid-svg-icons';

import { promotions } from '@/app/(tabs)/promoData';

const iconMap = {
    "arrow-left": faArrowLeft,
    "paint-brush": faPaintBrush,
    "music": faMusic,
    "utensils": faUtensils,
    "hammer": faHammer,
    "question-circle": faQuestionCircle,
    "times-circle": faTimesCircle,
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

const FontAwesome5 = (props: {
    name: string;
    size: number;
    color: string;
}) => {
    const iconDefinition = iconMap[props.name as keyof typeof iconMap] || faQuestionCircle;
    return <FontAwesomeIcon icon={iconDefinition as any} size={props.size} color={props.color} />;
};

// Define CulturePromo interface
export interface CulturePromo {
    id: string;
    title: string;
    description?: string;
    fullDescription?: string;
    category?: 'seni' | 'musik' | 'kuliner' | 'kerajinan' | 'all';
    icon: string;
    color: string;
    discount?: string;
    date?: string;
    location?: string;
    time?: string;
    price?: string;
    contact?: string;
    activities?: string[];
    points?: number; // Add points property
    completed?: boolean; // Add completed property
}





export default function ExploreScreen() {
    const router = useRouter();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const [activeCategory, setActiveCategory] = useState('all');
    const [selectedPromo, setSelectedPromo] = useState<CulturePromo | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [promoScales, setPromoScales] = useState<{ [key: string]: Animated.Value }>({});
    const { isFavorite, addFavorite } = useFavorites();

    React.useEffect(() => {
        const initialScales: { [key: string]: Animated.Value } = {};
        promotions.forEach(promo => { // Use 'promotions' directly or filter it first if it's a large array
            initialScales[promo.id] = new Animated.Value(1);
        });
        setPromoScales(initialScales);
    }, [promotions]);

    const animatePromoPressIn = (promoId: string) => {
        Animated.spring(promoScales[promoId], {
            toValue: 0.98,
            useNativeDriver: true,
            speed: 50,
            bounciness: 10,
        }).start();
    };

    const animatePromoPressOut = (promoId: string) => {
        Animated.spring(promoScales[promoId], {
            toValue: 1,
            useNativeDriver: true,
            speed: 50,
            bounciness: 10,
        }).start();
    };

    const categories = [
        { id: 'all', name: 'Semua', icon: 'star', color: '#f7d794' },
        { id: 'seni', name: 'Seni', icon: 'paint-brush', color: '#f7a6a6' },
        { id: 'musik', name: 'Musik', icon: 'music', color: '#77d8d2' },
        { id: 'kuliner', name: 'Kuliner', icon: 'utensils', color: '#f8e9a1' },
        { id: 'kerajinan', name: 'Kerajinan', icon: 'hammer', color: '#b2d8d8' },
    ];

    const [searchQuery, setSearchQuery] = useState('');
    const [dateFilter, setDateFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 8;

    const filteredPromos = promotions.filter((promo) => {
        if (activeCategory !== 'all' && promo.category !== activeCategory) return false;
        if (dateFilter && promo.date && !promo.date.toLowerCase().includes(dateFilter.toLowerCase())) return false;
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            const inTitle = promo.title.toLowerCase().includes(q);
            const inDesc = (promo.description || '').toLowerCase().includes(q);
            return inTitle || inDesc;
        }
        return true;
    });

    const totalPages = Math.max(1, Math.ceil(filteredPromos.length / pageSize));
    const displayPromos = filteredPromos.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    const openDetail = (promo: CulturePromo) => {
        setSelectedPromo(promo);
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
        setSelectedPromo(null);
    };

    const onShare = async () => {
        if (selectedPromo) {
            try {
                const result = await Share.share({
                    message: `${selectedPromo.title}: ${selectedPromo.fullDescription || selectedPromo.description}\nLokasi: ${selectedPromo.location}\nTanggal: ${selectedPromo.date}\nKontak: ${selectedPromo.contact || 'Tidak tersedia'}`,
                    title: selectedPromo.title,
                });
                if (result.action === Share.sharedAction) {
                    if (result.activityType) {
                        // shared with activity type of result.activityType
                    } else {
                        // shared
                    }
                } else if (result.action === Share.dismissedAction) {
                    // dismissed
                }
            } catch (error: any) {
                Alert.alert('Gagal Berbagi', error.message);
            }
        }
    };

    const onRegister = () => {
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

    const onSave = async () => {
        if (!selectedPromo) {
            Alert.alert('Gagal Menyimpan', 'Tidak ada promosi yang dipilih.');
            return;
        }

        const newFavorite: FavoriteItem = {
            id: selectedPromo.id,
            name: selectedPromo.title,
            type: 'promotion', // Set type as 'promotion'
            imageUrl: undefined, // You might want to add an image to CulturePromo or handle it differently
            description: selectedPromo.description,
            story: undefined, // No story for promo initially, can be added during edit
        };

        if (isFavorite(newFavorite.id)) {
            Alert.alert('Sudah Tersimpan', `${newFavorite.name} sudah ada di daftar favorit Anda.`);
            return;
        }

        try {
            await addFavorite(newFavorite);
            Alert.alert('Berhasil Disimpan', `${newFavorite.name} telah ditambahkan ke daftar favorit!`);
        } catch (e: any) {
            console.error('Failed to save promo to favorites:', e);
            Alert.alert('Gagal Menyimpan', `Terjadi kesalahan saat menyimpan promosi: ${e.message}`);
        }
    };

    const [categoryScales, setCategoryScales] = useState<{ [key: string]: Animated.Value }>({});

    // Initialize Animated.Value for each category on mount
    React.useEffect(() => {
        const initialScales: { [key: string]: Animated.Value } = {};
        categories.forEach(category => {
            initialScales[category.id] = new Animated.Value(1);
        });
        setCategoryScales(initialScales);
    }, []);

    const animatePressIn = (categoryId: string) => {
        Animated.spring(categoryScales[categoryId], {
            toValue: 0.95,
            useNativeDriver: true,
            speed: 50, // Adjust speed for desired feel
            bounciness: 10, // Adjust bounciness for desired feel
        }).start();
    };

    const animatePressOut = (categoryId: string) => {
        Animated.spring(categoryScales[categoryId], {
            toValue: 1,
            useNativeDriver: true,
            speed: 50,
            bounciness: 10,
        }).start();
    };

    return (
        <>
            <ScrollView
                style={[styles.container, { backgroundColor: isDark ? '#1D3D47' : '#f8f9fa' }]}
                showsVerticalScrollIndicator={false}
            >
                {/* HEADER */}
                <LinearGradient
                    colors={isDark ? ['#1D3D47', '#2C5F7F'] : ['#2C5F7F', '#4A7D9D']} // Darker gradient for dark mode, lighter for light mode
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.headerContainer}
                >
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <FontAwesome5 name="arrow-left" size={24} color="#fff" />
                    </TouchableOpacity>
                    <View style={styles.headerTitleContainer}>
                        <ThemedText style={styles.headerTitle}>🎭 Promosi Budaya</ThemedText>
                        <ThemedText style={styles.headerSubtitle}>Jelajahi dan nikmati promosi budaya lokal Bandung</ThemedText>
                    </View>
                </LinearGradient>

                {/* SEARCH & FILTER */}
                <View style={styles.searchRow}>
                    <View style={styles.inputContainer}>
                        <TextInput
                            value={searchQuery}
                            onChangeText={(t) => { setSearchQuery(t); setCurrentPage(1); }}
                            placeholder="Cari promosi atau kata kunci..."
                            style={[
                                styles.searchInput,
                                {
                                    backgroundColor: isDark ? '#2C5F7F' : '#fff',
                                    color: isDark ? '#fff' : '#000'
                                }
                            ]}
                            placeholderTextColor={isDark ? '#ccc' : '#666'}
                        />
                        {searchQuery.length > 0 && (
                            <TouchableOpacity onPress={() => { setSearchQuery(''); setCurrentPage(1); }} style={styles.clearButton}>
                                <FontAwesome5 name="times-circle" size={18} color={isDark ? '#ccc' : '#666'} />
                            </TouchableOpacity>
                        )}
                    </View>

                    <View style={styles.inputContainer}>
                        <TextInput
                            value={dateFilter}
                            onChangeText={(t) => { setDateFilter(t); setCurrentPage(1); }}
                            placeholder="Filter tanggal (YYYY-MM-DD)"
                            style={[
                                styles.dateInput,
                                {
                                    backgroundColor: isDark ? '#2C5F7F' : '#fff',
                                    color: isDark ? '#fff' : '#000'
                                }
                            ]}
                            placeholderTextColor={isDark ? '#ccc' : '#666'}
                        />
                        {dateFilter.length > 0 && (
                            <TouchableOpacity onPress={() => { setDateFilter(''); setCurrentPage(1); }} style={styles.clearButton}>
                                <FontAwesome5 name="times-circle" size={18} color={isDark ? '#ccc' : '#666'} />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>

                {/* RESET FILTERS BUTTON */}
                {(searchQuery.length > 0 || dateFilter.length > 0 || activeCategory !== 'all') && (
                    <View style={styles.resetButtonContainer}>
                        <TouchableOpacity
                            onPress={() => {
                                setSearchQuery('');
                                setDateFilter('');
                                setActiveCategory('all');
                                setCurrentPage(1);
                            }}
                            style={styles.resetButton}
                        >
                            <FontAwesome5 name="redo" size={14} color="#fff" />
                            <ThemedText style={styles.resetButtonText}>Reset Filters</ThemedText>
                        </TouchableOpacity>
                    </View>
                )}

                {/* CATEGORIES FILTER */}
                <View style={styles.categoriesContainer}>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.categoriesContent}
                    >
                        {categories.map((category) => (
                            <Animated.View
                                key={category.id}
                                style={[
                                    { transform: [{ scale: categoryScales[category.id] || new Animated.Value(1) }] }
                                ]}
                            >
                                <TouchableOpacity
                                    style={[ 
                                        styles.categoryButton,
                                        activeCategory === category.id && styles.categoryButtonActive,
                                        {
                                            backgroundColor:
                                                activeCategory === category.id
                                                    ? category.color
                                                    : isDark
                                                        ? '#2C5F7F'
                                                        : '#E8F4F8',
                                        },
                                    ]}
                                    onPressIn={() => animatePressIn(category.id)}
                                    onPressOut={() => animatePressOut(category.id)}
                                    onPress={() => {
                                        setActiveCategory(category.id);
                                        setCurrentPage(1);
                                    }}
                                >
                                    <FontAwesome5
                                        name={category.icon || 'question-circle'}
                                        size={14}
                                        color={activeCategory === category.id ? '#fff' : category.color}
                                    />
                                    <ThemedText
                                        style={[ 
                                            styles.categoryButtonText,
                                            activeCategory === category.id && styles.categoryButtonTextActive,
                                        ]}
                                    >
                                        {category.name}
                                    </ThemedText>
                                </TouchableOpacity>
                            </Animated.View>
                        ))}
                    </ScrollView>
                </View>

                {/* PROMOTIONS GRID */}
                <View style={styles.promotionsContainer}>
                    {displayPromos.map((promo) => (
                        <TouchableOpacity
                            key={promo.id}
                            onPress={() => openDetail(promo)}
                            onPressIn={() => animatePromoPressIn(promo.id)}
                            onPressOut={() => animatePromoPressOut(promo.id)}
                            activeOpacity={1} // To prevent default opacity change
                        >
                            <Animated.View
                                style={[ 
                                    { transform: [{ scale: promoScales[promo.id] || new Animated.Value(1) }] }
                                ]}
                            >
                                <ThemedView style={styles.promoCardContent}>
                                    {/* Promo Badge */}
                                    <View style={[styles.promoBadge, { backgroundColor: promo.color }]}>
                                        <FontAwesome5 name={promo.icon || 'question-circle'} size={20} color="#fff" />
                                    </View>

                                    {/* Discount Tag */}
                                    {promo.discount && (
                                        <View style={styles.discountTag}>
                                            <ThemedText style={styles.discountText}>{promo.discount}</ThemedText>
                                        </View>
                                    )}

                                    {/* Content */}
                                    <View style={styles.promoContent}>
                                        <ThemedText style={styles.promoTitle}>{promo.title}</ThemedText>
                                        <ThemedText lightColor="#666" darkColor="#ccc" style={styles.promoDescription}>{promo.description}</ThemedText>

                                        {/* Footer Info */}
                                        <View style={styles.promoFooter}>
                                            {promo.date && (
                                                <View style={styles.dateInfo}>
                                                    <FontAwesome5 name="calendar-alt" size={12} color="#666" />
                                                    <ThemedText lightColor="#666" darkColor="#ccc" style={styles.dateText}>{promo.date}</ThemedText>
                                                </View>
                                            )}
                                        </View>

                                        {/* CTA Button */}
                                        <TouchableOpacity
                                            style={[styles.promoButton, { backgroundColor: promo.color }]}
                                            onPress={() => openDetail(promo)}
                                        >
                                            <ThemedText style={styles.promoButtonText}>Lihat Detail →</ThemedText>
                                        </TouchableOpacity>
                                    </View>
                                </ThemedView>
                            </Animated.View>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* EMPTY STATE */}
                {filteredPromos.length === 0 && (
                    <View style={styles.emptyState}>
                        <FontAwesome5 name="search" size={48} color="#ccc" />
                        <ThemedText lightColor="#666" darkColor="#ccc" style={styles.emptyStateText}>Tidak ada promosi di kategori ini</ThemedText>
                    </View>
                )}

                {/* PAGINATION CONTROLS */}
                {filteredPromos.length > pageSize && (
                    <View style={styles.paginationRow}>
                        <TouchableOpacity
                            style={[ 
                                styles.pageButton,
                                currentPage === 1 && { opacity: 0.5 }
                            ]}
                            onPress={() => setCurrentPage(Math.max(1, currentPage - 1))}
                            disabled={currentPage === 1}
                        >
                            <ThemedText style={styles.pageButtonText}>Prev</ThemedText>
                        </TouchableOpacity>

                        <ThemedText style={styles.pageInfo}>{`${currentPage} / ${totalPages}`}</ThemedText>

                        <TouchableOpacity
                            style={[ 
                                styles.pageButton,
                                currentPage === totalPages && { opacity: 0.5 }
                            ]}
                            onPress={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                            disabled={currentPage === totalPages}
                        >
                            <ThemedText style={styles.pageButtonText}>Next</ThemedText>
                        </TouchableOpacity>
                    </View>
                )}



                {/* BOTTOM SPACING */}
                <View style={{ height: 30 }} />
            </ScrollView>

            {/* DETAIL MODAL */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={closeModal}
            >
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { backgroundColor: isDark ? '#1D3D47' : '#fff' }]}>
                        {/* Modal Header */}
                        <View style={[styles.modalHeader, { backgroundColor: selectedPromo?.color || '#2C5F7F' }]}>
                            <TouchableOpacity onPress={closeModal}>
                                <FontAwesome5 name="arrow-left" size={24} color="#fff" />
                            </TouchableOpacity>
                            <ThemedText style={styles.modalTitle}>{selectedPromo?.title || ''}</ThemedText>
                            <View style={{ width: 24 }} />
                        </View>

                        {/* Modal Body */}
                        <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
                            {/* Icon Badge */}
                            <View
                                style={[ 
                                    styles.modalIconBadge,
                                    { backgroundColor: selectedPromo?.color || '#2C5F7F' },
                                ]}
                            >
                                <FontAwesome5 name={selectedPromo?.icon || 'question-circle'} size={48} color="#fff" />
                            </View>

                            {/* Diskon */}
                            {selectedPromo?.discount && (
                                <View style={styles.modalDiscountSection}>
                                    <ThemedText style={styles.modalDiscountLabel}>Penawaran Spesial</ThemedText>
                                    <ThemedText style={[styles.modalDiscountValue, { color: selectedPromo.color }]}>
                                        {selectedPromo.discount}
                                    </ThemedText>
                                </View>
                            )}

                            {/* Deskripsi Lengkap */}
                            <View style={styles.modalSection}>
                                <ThemedText style={styles.modalSectionTitle}>Deskripsi</ThemedText>
                                <ThemedText style={styles.modalSectionContent}>
                                    {selectedPromo?.fullDescription || selectedPromo?.description}
                                </ThemedText>
                            </View>

                            {/* Informasi Detail */}
                            {selectedPromo?.location && (
                                <View style={styles.modalSection}>
                                    <ThemedText style={styles.modalSectionTitle}>📍 Lokasi</ThemedText>
                                    <ThemedText style={styles.modalSectionContent}>{selectedPromo.location}</ThemedText>
                                </View>
                            )}

                            {selectedPromo?.time && (
                                <View style={styles.modalSection}>
                                    <ThemedText style={styles.modalSectionTitle}>⏰ Waktu</ThemedText>
                                    <ThemedText style={styles.modalSectionContent}>{selectedPromo.time}</ThemedText>
                                </View>
                            )}

                            {selectedPromo?.price && (
                                <View style={styles.modalSection}>
                                    <ThemedText style={styles.modalSectionTitle}>💰 Harga</ThemedText>
                                    <ThemedText style={[styles.modalSectionContent, { fontWeight: 'bold' }]}>
                                        {selectedPromo.price}
                                    </ThemedText>
                                </View>
                            )}

                            {selectedPromo?.contact && (
                                <View style={styles.modalSection}>
                                    <ThemedText style={styles.modalSectionTitle}>📞 Kontak</ThemedText>
                                    <ThemedText style={styles.modalSectionContent}>{selectedPromo.contact}</ThemedText>
                                </View>
                            )}

                            {/* Aktivitas */}
                            {selectedPromo?.activities && selectedPromo.activities.length > 0 && (
                                <View style={styles.modalSection}>
                                    <ThemedText style={styles.modalSectionTitle}>🎯 Aktivitas</ThemedText>
                                    {selectedPromo.activities.map((activity, index) => (
                                        <View key={index} style={styles.activityItem}>
                                            <FontAwesome5 name="check-circle" size={14} color={selectedPromo.color} />
                                            <ThemedText style={styles.activityText}>{activity}</ThemedText>
                                        </View>
                                    ))}
                                </View>
                            )}

                            {/* CTA Buttons */}
                            <View style={styles.modalActions}>


                                <TouchableOpacity
                                    style={[ 
                                        styles.actionButton,
                                        { backgroundColor: selectedPromo?.color || '#2C5F7F' },
                                    ]}
                                    onPress={onShare}
                                >
                                    <FontAwesome5 name="share-alt" size={16} color="#fff" />
                                    <ThemedText style={styles.actionButtonText}>Bagikan</ThemedText>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[ 
                                        styles.actionButton,
                                        { backgroundColor: selectedPromo?.color || '#2C5F7F' },
                                    ]}
                                    onPress={onRegister}
                                >
                                    <FontAwesome5 name="ticket-alt" size={16} color="#fff" />
                                    <ThemedText style={styles.actionButtonText}>Daftar</ThemedText>
                                </TouchableOpacity>
                            </View>

                            <View style={{ height: 20 }} />
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerContainer: {
        paddingHorizontal: 20,
        paddingVertical: 30, // Increased vertical padding
        paddingTop: 40, // Increased top padding
        justifyContent: 'center', // Center content vertically
        alignItems: 'center', // Center content horizontally
        borderBottomLeftRadius: 25, // Rounded bottom-left corner
        borderBottomRightRadius: 25, // Rounded bottom-right corner
    },
    headerTitle: {
        fontSize: 32, // Larger font size
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 8, // Increased margin
        textAlign: 'center', // Center text
    },
    headerSubtitle: {
        fontSize: 16, // Larger font size
        color: '#e0e0e0',
        textAlign: 'center', // Center text
    },
    backButton: {
        position: 'absolute',
        top: 45, // Adjusted to align with new header padding
        left: 20,
        zIndex: 1,
        padding: 5,
    },
    headerTitleContainer: {
        marginLeft: 40, // To make space for the back button
    },
    categoriesContainer: {
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0, 0, 0, 0.1)',
    },
    categoriesContent: {
        paddingHorizontal: 16,
        gap: 10,
    },
    categoryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
    },
    categoryButtonActive: {
        borderWidth: 2, // Add border
        borderColor: '#fff', // White border with contrast
        elevation: 6, // Increased elevation
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 }, // More pronounced shadow
        shadowOpacity: 0.35, // Increased shadow opacity
        shadowRadius: 4, // Increased shadow radius
    },
    categoryButtonText: {
        fontSize: 12,
        fontWeight: '600',
    },
    categoryButtonTextActive: {
        color: '#fff',
    },
    promotionsContainer: {
        paddingHorizontal: 16,
        paddingTop: 16,
        gap: 12,
    },
    promoCardContent: {
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: '#dae1e6ff',
    },
    promoBadge: {
        width: 44, // Slightly larger size
        height: 44, // Slightly larger size
        borderRadius: 22, // Half of width/height for perfect circle
        position: 'absolute',
        top: 16, // Adjusted position
        left: 16, // Adjusted position
        zIndex: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2, // Subtle border
        borderColor: 'rgba(255,255,255,0.8)', // White border with transparency
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3,
        elevation: 5,
    },
    discountTag: {
        position: 'absolute',
        top: 12,
        right: 12,
        zIndex: 10,
        backgroundColor: '#fff',
        paddingHorizontal: 12, // Increased padding
        paddingVertical: 8, // Increased padding
        borderRadius: 10, // More rounded
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    discountText: {
        fontSize: 11,
        fontWeight: 'bold',
        color: '#FF6B6B',
    },
    promoContent: {
        paddingTop: 60, // Adjusted to ensure icon does not cover title with smaller badge
        paddingHorizontal: 16,
        paddingBottom: 16,
        gap: 10,
    },
    promoTitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    promoDescription: {
        fontSize: 13,
        lineHeight: 19,
        opacity: 0.7,
    },
    promoFooter: {
        gap: 8,
    },
    dateInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    dateText: {
        fontSize: 12,
        color: '#666',
        fontWeight: '500',
    },
    promoButton: {
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 4,
    },
    promoButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 13,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
        gap: 12,
    },
    emptyStateText: {
        fontSize: 16,
        opacity: 0.6,
    },
    infoSection: {
        paddingHorizontal: 16,
        paddingVertical: 24,
    },
    infoCard: {
        borderRadius: 12,
        padding: 16,
        gap: 12,
    },
    infoHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    infoTitle: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    infoText: {
        fontSize: 12,
        lineHeight: 18,
        opacity: 0.7,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        maxHeight: '90%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        flex: 1,
        textAlign: 'center',
    },
    modalBody: {
        paddingHorizontal: 16,
    },
    modalIconBadge: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        marginTop: 16,
        marginBottom: 16,
    },
    modalDiscountSection: {
        backgroundColor: 'rgba(255, 215, 0, 0.1)',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 8,
        marginBottom: 16,
    },
    modalDiscountLabel: {
        fontSize: 12,
        opacity: 0.7,
    },
    modalDiscountValue: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    modalSection: {
        marginBottom: 16,
    },
    modalSectionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    modalSectionContent: {
        fontSize: 13,
        lineHeight: 19,
        opacity: 0.8,
    },
    activityItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 10,
    },
    activityText: {
        fontSize: 13,
        flex: 1,
    },
    modalActions: {
        flexDirection: 'row',
        gap: 10,
        marginTop: 20,
        marginBottom: 10,
    },
    actionButton: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
        paddingVertical: 12,
        borderRadius: 8,
    },
    actionButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 12,
    },
    searchRow: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        gap: 8,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'relative',
    },
    searchInput: {
        flex: 1, // Allow input to take available space
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.08)',
        fontSize: 14,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
    },
    dateInput: {
        flex: 1, // Allow input to take available space
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.08)',
        fontSize: 14,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
    },
    clearButton: {
        position: 'absolute',
        right: 12,
        padding: 5,
    },
    resetButtonContainer: {
        paddingHorizontal: 16,
        paddingBottom: 12, // Add some padding below the button
        alignItems: 'flex-end', // Align button to the right
    },
    resetButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: '#FF6B6B', // Example color for reset
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 8,
    },
    resetButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 13,
    },
    paginationRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 12,
        paddingVertical: 12,
    },
    pageButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        backgroundColor: '#2C5F7F',
    },
    pageButtonText: {
        color: '#fff',
        fontWeight: '600',
    },
    pageInfo: {
        fontSize: 14,
        fontWeight: '600',
    },
});