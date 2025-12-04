import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, useColorScheme, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useGamification } from '@/contexts/GamificationContext'; // Import useGamification


export default function HomeScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const [greeting, setGreeting] = useState('Selamat Datang');

  const { userStats, levelProgress } = useGamification(); // Use gamification context

  // Dynamic greeting based on time
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting('Pagi yang Indah!');
    } else if (hour < 17) {
      setGreeting('Siang, Penjelajah!');
    } else {
      setGreeting('Malam, Penjelajah!');
    }
  }, []);

  const isDark = colorScheme === 'dark';

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: isDark ? '#1D3D47' : '#f8f9fa' }]}
      showsVerticalScrollIndicator={false}
    >
      {/* BANNER BESAR */}
      <View style={[styles.bannerContainer, { backgroundColor: isDark ? '#12202A' : '#1a5f5f' }]}>
        <Image
          source={require('@/assets/images/bandung.png')}
          style={styles.bannerImage}
          contentFit="cover"
        />
        <View style={[styles.bannerOverlay, { backgroundColor: 'rgba(18, 32, 42, 0.35)' }]}>
          <ThemedText style={styles.bannerTitle}>🏛️ Bandung Heritage</ThemedText>
          <ThemedText style={styles.bannerSubtitle}>Jelajahi warisan budaya Kota Bandung</ThemedText>

          <View style={styles.bannerButtons}>
            <TouchableOpacity
              style={[styles.bannerButtonPrimary, { flex: 1 }, {backgroundColor: '#4A7D9D'}]}
              onPress={() => router.push('/(tabs)/gmap')}
            >
              <ThemedText style={styles.bannerButtonText}>📍 Jelajahi Peta</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* GAMIFIKASI OVERVIEW CARD */}
      <View style={styles.padding}>
        <ThemedView style={styles.gamifikasiCard}>
          <View style={styles.gamifikasiHeader}>
            <View style={styles.gamifikasiTitleContainer}>
              <FontAwesome5 name="medal" size={24} color="#4A7D9D" />
              <ThemedText style={styles.gamifikasiTitle}>Progres Gamifikasi Anda</ThemedText>
            </View>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => router.push('/(tabs)/mahasiswa')}
            >
              <ThemedText style={styles.clickHint}>Lihat Detail →</ThemedText>
            </TouchableOpacity>
          </View>

          <View style={styles.gamifikasiContent}>
            {/* Level and Badge */}
            <View style={styles.gamifikasiLevelSection}>
              <View style={[styles.levelBadge, { backgroundColor: '#4A7D9D' }]}>
                <ThemedText style={styles.levelText}>⭐ Level {userStats.level}</ThemedText>
              </View>
              <ThemedText style={styles.badgeTitle}>Heritage Explorer</ThemedText>
            </View>

            {/* Points Overview */}
            <View style={styles.pointsOverview}>
              <View style={styles.pointsOverviewItem}>
                <ThemedText style={styles.pointsOverviewLabel}>Total Poin</ThemedText>
                <ThemedText style={styles.pointsOverviewValue}>{userStats.totalPoints} pts</ThemedText>
              </View>
              <View style={styles.pointsOverviewItem}>
                <ThemedText style={styles.pointsOverviewLabel}>Poin Minggu Ini</ThemedText>
                <ThemedText style={styles.pointsOverviewValue}>{userStats.weeklyPoints} pts</ThemedText>
              </View>
            </View>

            {/* Progress Bar */}
            <View style={styles.progressBarContainer}>
              <ThemedText style={styles.badgeProgressLabel}>Level Up Progress</ThemedText>
              <View style={[styles.progressBar, { backgroundColor: isDark ? '#2C5F7F' : '#E8F4F8' }]}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${levelProgress.progressPercent}%`,
                      backgroundColor: '#4A7D9D',
                    },
                  ]}
                />
              </View>
              <ThemedText style={styles.progressPercentage}>{levelProgress.progressPercent.toFixed(0)}% menuju Level {userStats.level + 1}</ThemedText>
            </View>


          </View>
        </ThemedView>
      </View>

      {/* JELAJAHI BANDUNG SECTION */}
      <View style={styles.padding}>
        <ThemedText style={styles.sectionTitle}>Jelajahi Bandung</ThemedText>
        <ThemedText style={styles.sectionDescription}>
          Temukan berbagai destinasi menarik dan pengalaman unik di Kota Bandung.
          Dari situs bersejarah hingga kuliner lezat, Bandung menanti untuk dijelajuk!
        </ThemedText>
        <TouchableOpacity style={styles.exploreButton} onPress={() => router.push('/lokasi')}>
          <ThemedText style={styles.exploreButtonText}>Mulai Jelajahi</ThemedText>
          <FontAwesome5 name="arrow-right" size={14} color="#fff" style={{ marginLeft: 8 }} />
        </TouchableOpacity>
      </View>

      {/* FITUR UTAMA APLIKASI SECTION */}
      <View style={styles.padding}>
        <ThemedText style={styles.sectionTitle}>Fitur Utama Aplikasi</ThemedText>
        <View style={styles.featureGrid}>
          <TouchableOpacity
            style={[styles.featureCard, { backgroundColor: isDark ? '#2C5F7F' : '#dae1e6ff' }]}
            onPress={() => router.push('/explore')}
            activeOpacity={0.7}
          >
            <FontAwesome5 name="hands-helping" size={30} color={isDark ? '#4A7D9D' : '#4A7D9D'} style={styles.featureCardIcon} />
            <ThemedText style={styles.featureCardTitle}>Promosi Budaya Lokal</ThemedText>
            <ThemedText style={styles.featureCardDescription}>Dukung dan promosikan kegiatan serta produk budaya lokal.</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.featureCard, { backgroundColor: isDark ? '#2C5F7F' : '#dae1e6ff' }]}
            onPress={() => router.push('/favorites')}
            activeOpacity={0.7}
          >
            <FontAwesome5 name="map-marker-alt" size={30} color={isDark ? '#4A7D9D' : '#4A7D9D'} style={styles.featureCardIcon} />
            <ThemedText style={styles.featureCardTitle}>Lokasi Favorite</ThemedText>
            <ThemedText style={styles.featureCardDescription}>Akses cepat ke lokasi favorit Anda di Bandung.</ThemedText>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  padding: {
    padding: 16,
  },
  bannerContainer: {
    height: 280, // Slightly increased height
    position: 'relative',
    overflow: 'hidden',
    borderBottomLeftRadius: 25, // Rounded bottom-left corner
    borderBottomRightRadius: 25, // Rounded bottom-right corner
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  bannerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(18, 32, 42, 0.45)', // Slightly more opaque overlay
  },
  bannerTitle: {
    fontSize: 32, // Larger font size
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10, // Increased margin
    textShadowColor: 'rgba(0, 0, 0, 0.5)', // Subtle text shadow
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  bannerSubtitle: {
    fontSize: 18, // Larger font size
    color: '#fff',
    textAlign: 'center',
    marginBottom: 25, // Increased margin
    opacity: 0.9, // Slightly less opaque
  },
  bannerButtons: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
    maxWidth: 400,
  },
  bannerButtonPrimary: {
    backgroundColor: '#4A7D9D',
    paddingVertical: 14, // Increased padding
    paddingHorizontal: 28, // Increased padding
    borderRadius: 10, // More rounded corners
    alignItems: 'center',
    shadowColor: '#4A7D9D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  bannerButtonText: {
    color: 'white',
    fontSize: 17, // Slightly larger font
    fontWeight: 'bold',
  },
  gamifikasiCard: {
    borderRadius: 15, // Slightly more rounded
    padding: 20, // Increased padding
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 6,
    backgroundColor: '#dae1e6ff',
  },
  gamifikasiHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  gamifikasiTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  gamifikasiTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4A7D9D',
  },
  clickHint: {
    fontSize: 13,
    opacity: 0.8,
    color: '#2C5F7F',
  },
  gamifikasiContent: {
    gap: 18,
  },
  gamifikasiLevelSection: {
    alignItems: 'center',
    gap: 10,
  },
  levelBadge: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  levelText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: 'white',
  },
  badgeTitle: {
    fontSize: 15,
    color: '#4A7D9D',
  },
  pointsOverview: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 15,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(0,0,0,0.15)',
  },
  pointsOverviewItem: {
    alignItems: 'center',
    gap: 5,
  },
  pointsOverviewLabel: {
    fontSize: 13,
    color: '#4A7D9D',
  },
  pointsOverviewValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4A7D9D',
  },
  progressBarContainer: {
    gap: 10,
  },
  badgeProgressLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#4A7D9D',
  },
  progressBar: {
    height: 10,
    borderRadius: 5,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  progressFill: {
    height: '100%',
    borderRadius: 5,
  },
  progressPercentage: {
    fontSize: 13,
    textAlign: 'center',
    color: '#4A7D9D',
  },

  sectionTitle: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 10,
  },
  sectionDescription: {
    fontSize: 17,
    marginBottom: 20,
    lineHeight: 26,
  },
  exploreButton: {
    backgroundColor: '#4A7D9D',
    paddingVertical: 14,
    paddingHorizontal: 25,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
    alignSelf: 'flex-start',
    shadowColor: '#4A7D9D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  exploreButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
  },
  featureGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 15,
    gap: 12,
  },
  featureCard: {
    width: '48%',
    borderRadius: 15,
    padding: 20,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 5,
    elevation: 4,
  },
  featureCardIcon: {
    marginBottom: 15,
  },
  featureCardTitle: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  featureCardDescription: {
    fontSize: 13,
    textAlign: 'center',
    color: '#4A7D9D',
  },
  promoCardDescription: {
    fontSize: 11,
    textAlign: 'center',
    opacity: 0.7,
  },
});