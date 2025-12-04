import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View, useColorScheme } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { QuizGame, MemoryGame, SpinTheWheelGame } from './gamescreen';
import { useGamification } from '@/contexts/GamificationContext'; // Import useGamification

interface Quest {
    id: string;
    title: string;
    description: string;
    reward: number;
    icon: string;
    color: string;
    progress: number;
    completed: boolean;
    gameType?: 'quiz' | 'memory' | 'wheel';
}

interface Leaderboard {
    rank: number;
    name: string;
    points: number;
    level: number;
    badge: string;
}

export default function GamificationScreen() {
    const router = useRouter();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const [activeTab, setActiveTab] = useState<'quests' | 'leaderboard'>('quests');
    const [activeGame, setActiveGame] = useState<'quiz' | 'memory' | 'wheel' | null>(null);
    const [quizLevel, setQuizLevel] = useState(1);

    const { userStats, addPoints, levelProgress } = useGamification(); // Use gamification context

    const quizLevelMap: { [key: string]: number } = { '3': 1, '6': 2, '7': 3 };
    const [quests, setQuests] = useState<Quest[]>([
        {
            id: '3',
            title: '🧠 Quiz Heritage - Level 1',
            description: 'Jawab kuis tentang warisan budaya Bandung (Level Dasar)',
            reward: 200,
            icon: 'brain',
            color: '#FFE66D',
            progress: 0,
            completed: false,
            gameType: 'quiz',
        },
        {
            id: '6',
            title: '🧠 Quiz Heritage - Level 2',
            description: 'Lanjutkan kuis ke level menengah',
            reward: 300,
            icon: 'brain',
            color: '#FFC107',
            progress: 0,
            completed: false,
            gameType: 'quiz',
        },
        {
            id: '7', // New quest for level 3
            title: '🧠 Quiz Heritage - Level 3',
            description: 'Tantang dirimu di level mahir!',
            reward: 400,
            icon: 'brain',
            color: '#FF9800',
            progress: 0,
            completed: false,
            gameType: 'quiz',
        },
        {
            id: '4',
            title: '🎴 Permainan Kartu Memory',
            description: 'Mainkan memory game dan dapatkan poin',
            reward: 150,
            icon: 'list',
            color: '#A8E6CF',
            progress: 0,
            completed: false,
            gameType: 'memory',
        },
        {
            id: '5',
            title: '🎡 Putar Roda Keberuntungan',
            description: 'Putar roda dan menangkan poin bonus',
            reward: 120,
            icon: 'circle-notch',
            color: '#95E1D3',
            progress: 0,
            completed: false,
            gameType: 'wheel',
        },
    ]);


    const initialLeaderboard: Leaderboard[] = [
        { rank: 1, name: 'Ahmad Rahman', points: 5200, level: 8, badge: '🏆' },
        { rank: 2, name: 'Siti Nurhaliza', points: 4800, level: 7, badge: '🥈' },
        { rank: 3, name: 'Budi Santoso', points: 4500, level: 7, badge: '🥉' },
        { rank: 4, name: 'Dewi Lestari', points: 4200, level: 6, badge: '⭐' },
        { rank: 5, name: 'Rudi Hermawan', points: 4000, level: 6, badge: '⭐' },
        // Removed static entry for Mardhiyah Auliya
        { rank: 15, name: 'Rina Wijaya', points: 2200, level: 5, badge: '⭐' },
        { rank: 20, name: 'Hendra Wijaya', points: 1800, level: 4, badge: '✨' },
    ];

    // Dynamically calculate and sort leaderboard including current user
    const currentLeaderboard = React.useMemo(() => {
        const userEntry: Leaderboard = {
            rank: 0, // Placeholder, will be set after sorting
            name: userStats.name,
            points: userStats.totalPoints,
            level: userStats.level,
            badge: '🌟', // Default badge for current user
        };

        const combinedList = [...initialLeaderboard.filter(entry => entry.name !== userStats.name), userEntry];
        combinedList.sort((a, b) => b.points - a.points);

        return combinedList.map((entry, index) => ({
            ...entry,
            rank: index + 1,
        }));
    }, [userStats.totalPoints, userStats.level, userStats.name]);

    // Find the user's current rank
    const currentUserRank = currentLeaderboard.find(entry => entry.name === userStats.name)?.rank || 0;

    const nextLevelPointsThreshold = levelProgress.pointsForCurrentLevel + levelProgress.pointsRequiredForNextLevel;



    const quizPointValues: { [key: number]: number } = {
        1: 20, // Quiz Level 1: 20 points per question
        2: 30, // Quiz Level 2: 30 points per question
        3: 40, // Quiz Level 3: 40 points per question
    };

    const handleQuestPress = (quest: Quest) => {
        if (quest.gameType === 'quiz') {
            const quizLevelMap: { [key: string]: number } = { '3': 1, '6': 2, '7': 3 };
            const levelToPlay = quizLevelMap[quest.id];
            if (levelToPlay) {
                setQuizLevel(levelToPlay);
                setActiveGame('quiz');
            }
        } else if (quest.gameType === 'memory') {
            setActiveGame('memory');
        } else if (quest.gameType === 'wheel') {
            setActiveGame('wheel');
        }
    };

    const handleGameComplete = (questId: string, scoreFromGame: number, gameType: 'quiz' | 'memory' | 'wheel') => {
        console.log('--- handleGameComplete called ---');
        console.log('questId:', questId);
        console.log('scoreFromGame (from game):', scoreFromGame);
        console.log('gameType:', gameType);

        const completedQuest = quests.find((q) => q.id === questId);
        if (completedQuest && !completedQuest.completed) {
            let pointsEarned = 0;
            console.log('completedQuest.reward (for this quest):', completedQuest.reward);

            if (gameType === 'quiz') {
                const currentQuizLevel = quizLevelMap[questId];
                console.log('currentQuizLevel:', currentQuizLevel);
                const pointsPerQuestion = quizPointValues[currentQuizLevel] || 0;
                console.log('pointsPerQuestion (from quizPointValues):', pointsPerQuestion);
                pointsEarned = scoreFromGame * pointsPerQuestion;
            } else {
                pointsEarned = completedQuest.reward;
            }
            console.log('Calculated pointsEarned:', pointsEarned);
            addPoints(pointsEarned); // Use addPoints from context
        } else {
            console.log('Quest not found or already completed:', questId);
        }

        setQuests(
            quests.map((q) =>
                q.id === questId
                    ? {
                        ...q,
                        progress: 100,
                        completed: true,
                    }
                    : q
            )
        );
        setActiveGame(null);
        console.log('--- handleGameComplete finished ---');
    };

    // Render Games
    if (activeGame === 'quiz') {
        return (
            <QuizGame
                level={quizLevel}
                onClose={() => setActiveGame(null)}
                onComplete={(score: number) => {
                    // Find which quiz quest to mark as complete based on the level played
                    const questIdToComplete = Object.keys(quizLevelMap).find(key => quizLevelMap[key] === quizLevel);
                    if (questIdToComplete) {
                        handleGameComplete(questIdToComplete, score, 'quiz');
                    }
                }}
            />
        );
    }

    if (activeGame === 'memory') {
        return (
            <MemoryGame
                onClose={() => setActiveGame(null)}
                onComplete={(points: number) => {
                    handleGameComplete('4', points, 'memory');
                }}
            />
        );
    }

    if (activeGame === 'wheel') {
        return (
            <SpinTheWheelGame
                onClose={() => setActiveGame(null)}
                onComplete={(points: number) => {
                    handleGameComplete('5', points, 'wheel');
                }}
            />
        );
    }

    return (
        <ScrollView
            style={[styles.container, { backgroundColor: isDark ? '#1D3D47' : '#f8f9fa' }]}
            showsVerticalScrollIndicator={false}
        >
            {/* HEADER */}
            <LinearGradient
                colors={isDark ? ['#1D3D47', '#2C5F7F'] : ['#2C5F7F', '#4A7D9D']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.headerContainer}
            >
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <FontAwesome5 name="arrow-left" size={24} color="#fff" />
                </TouchableOpacity>
                <View style={styles.headerTitleContainer}>
                    <ThemedText style={styles.headerTitle}>🎮 Gamifikasi</ThemedText>
                    <ThemedText style={styles.headerSubtitle}>Raih poin, badge, dan naik level!</ThemedText>
                </View>
            </LinearGradient>

            {/* USER STATS CARD */}
            <View style={styles.padding}>
                <ThemedView style={styles.statsCard}>
                    <View style={styles.statsRow}>
                        <View style={styles.statItem}>
                            <ThemedText style={styles.statLabel}>Level</ThemedText>
                            <ThemedText style={[styles.statValue, { color: '#FFD700' }]}>{userStats.level}</ThemedText>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <ThemedText style={styles.statLabel}>Total Poin</ThemedText>
                            <ThemedText style={[styles.statValue, { color: '#4ECDC4' }]}>{userStats.totalPoints}</ThemedText>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <ThemedText style={styles.statLabel}>Peringkat</ThemedText>
                            <ThemedText style={[styles.statValue, { color: '#FF6B6B' }]}>#{currentUserRank}</ThemedText>
                        </View>
                    </View>

                    {/* LEVEL PROGRESS BAR */}
                    <View style={styles.levelProgressSection}>
                        <View style={styles.levelProgressHeader}>
                            <ThemedText style={styles.levelProgressLabel}>Progres Level {userStats.level} → {userStats.level + 1}</ThemedText>
                            <ThemedText style={styles.levelProgressPercent}>{levelProgress.progressPercent.toFixed(0)}%</ThemedText>
                        </View>
                        <View style={[styles.levelProgressBar, { backgroundColor: isDark ? '#2C5F7F' : '#E8F4F8' }]}>
                            <View style={[styles.levelProgressFill, { width: `${levelProgress.progressPercent}%` }]} />
                        </View>
                        <ThemedText style={styles.levelProgressRequired}>{userStats.totalPoints} / {nextLevelPointsThreshold} poin diperlukan</ThemedText>
                    </View>
                </ThemedView>
            </View>

            {/* TAB NAVIGATION */}
            <View style={styles.tabNavigation}>
                <TouchableOpacity
                    style={[styles.tabButton, activeTab === 'quests' && styles.tabButtonActive]}
                    onPress={() => setActiveTab('quests')}
                >
                    <FontAwesome5 name="tasks" size={16} color={activeTab === 'quests' ? '#fff' : '#666'} />
                    <ThemedText style={[styles.tabButtonText, activeTab === 'quests' && styles.tabButtonTextActive]}>
                        Misi
                    </ThemedText>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.tabButton, activeTab === 'leaderboard' && styles.tabButtonActive]}
                    onPress={() => setActiveTab('leaderboard')}
                >
                    <FontAwesome5 name="trophy" size={16} color={activeTab === 'leaderboard' ? '#fff' : '#666'} />
                    <ThemedText style={[styles.tabButtonText, activeTab === 'leaderboard' && styles.tabButtonTextActive]}>
                        Peringkat
                    </ThemedText>
                </TouchableOpacity>
            </View>

            {/* CONTENT AREA */}
            <View style={styles.contentArea}>
                {/* QUESTS TAB */}
                {activeTab === 'quests' && (
                    <View style={styles.padding}>
                        <ThemedText type="subtitle" style={styles.sectionTitle}>Misi Aktif</ThemedText>
                        {quests.map((quest) => (
                            <TouchableOpacity
                                key={quest.id}
                                style={styles.questCard}
                                activeOpacity={0.8}
                                onPress={() => handleQuestPress(quest)}
                            >
                                <View style={[styles.questIconBadge, { backgroundColor: quest.color + '30' }]}>
                                    <FontAwesome5 name={quest.icon} size={24} color="#4A7D9D" />
                                </View>

                                <View style={styles.questContent}>
                                    <View style={styles.questHeader}>
                                        <ThemedText style={styles.questTitle}>{quest.title}</ThemedText>
                                        {quest.completed && (
                                            <FontAwesome5 name="check-circle" size={18} color="#4ECDC4" />
                                        )}
                                    </View>
                                    <ThemedText style={styles.questDescription}>{quest.description}</ThemedText>

                                    <View style={styles.questProgressSection}>
                                        <View style={styles.questProgressBar}>
                                            <View
                                                style={[
                                                    styles.questProgressFill,
                                                    { width: `${quest.progress}%`, backgroundColor: quest.color },
                                                ]}
                                            />
                                        </View>
                                        <ThemedText style={styles.questProgressText}>{quest.progress}%</ThemedText>
                                    </View>

                                    <View style={styles.questRewardSection}>
                                        <FontAwesome5 name="star" size={14} color={quest.color} />
                                        <ThemedText style={styles.questRewardText}>+{quest.reward} poin</ThemedText>
                                    </View>

                                    {quest.gameType && (
                                        <View style={styles.playButtonContainer}>
                                            <TouchableOpacity
                                                style={styles.playButton}
                                                onPress={() => handleQuestPress(quest)}
                                            >
                                                <FontAwesome5 name="play" size={14} color="#fff" />
                                                <ThemedText style={styles.playButtonText}>Mainkan</ThemedText>
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}

                {/* LEADERBOARD TAB */}
                {activeTab === 'leaderboard' && (
                    <View style={styles.padding}>
                        <ThemedText type="subtitle" style={styles.sectionTitle}>Papan Peringkat</ThemedText>
                        {currentLeaderboard.map((entry, index) => (
                            <TouchableOpacity
                                key={entry.name} // Use name as key, assuming names are unique
                                style={[
                                    styles.leaderboardItem,
                                    entry.name === userStats.name && styles.leaderboardItemHighlight,
                                ]}
                                activeOpacity={0.8}
                            >
                                <View style={styles.leaderboardRank}>
                                    <ThemedText style={styles.leaderboardRankText}>{entry.badge}</ThemedText>
                                    <ThemedText style={styles.leaderboardRankNumber}>#{entry.rank}</ThemedText>
                                </View>

                                <View style={styles.leaderboardInfo}>
                                    <ThemedText style={styles.leaderboardName}>{entry.name}</ThemedText>
                                    <ThemedText style={styles.leaderboardLevel}>Level {entry.level}</ThemedText>
                                </View>

                                <View style={styles.leaderboardPoints}>
                                    <FontAwesome5 name="star" size={14} color="#FFD700" />
                                    <ThemedText style={styles.leaderboardPointsValue}>{entry.points}</ThemedText>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    padding: {
        paddingHorizontal: 16,
        marginVertical: 12,
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
      statsCard: {
        borderRadius: 12,
        padding: 16,
        gap: 16,
        backgroundColor: '#dae1e6ff',
      },    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
        gap: 4,
    },
    statDivider: {
        width: 1,
        height: 40,
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        marginHorizontal: 12,
    },
    statLabel: {
        fontSize: 12,
        opacity: 0.7,
        color: '#4A7D9D',
    },
    statValue: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    levelProgressSection: {
        gap: 8,
        marginTop: 8,
    },
    levelProgressHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    levelProgressLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: '#4A7D9D',
    },
    levelProgressPercent: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    levelProgressBar: {
        height: 8,
        borderRadius: 4,
        overflow: 'hidden',
    },
    levelProgressFill: {
        height: '100%',
        backgroundColor: '#FFD700',
    },
    levelProgressRequired: {
        fontSize: 11,
        opacity: 0.6,
        color: '#4A7D9D',
    },
    tabNavigation: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        gap: 8,
        marginVertical: 12,
    },
    tabButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        paddingVertical: 10,
        borderRadius: 8,
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
    },
    tabButtonActive: {
        backgroundColor: '#2C5F7F',
    },
    tabButtonText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#666',
    },
    tabButtonTextActive: {
        color: '#fff',
    },
    contentArea: {
        paddingBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    questCard: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 12,
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: '#dae1e6ff',
        padding: 12,
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    questIconBadge: {
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
    },
    questContent: {
        flex: 1,
        gap: 8,
    },
    questHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    questTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        flex: 1,
        color: '#4A7D9D',
    },
    questDescription: {
        fontSize: 12,
        opacity: 0.7,
        color: '#4A7D9D',
    },
    questProgressSection: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    questProgressBar: {
        flex: 1,
        height: 6,
        borderRadius: 3,
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        overflow: 'hidden',
    },
    questProgressFill: {
        height: '100%',
    },
    questProgressText: {
        fontSize: 11,
        fontWeight: 'bold',
        minWidth: 30,
    },
    questRewardSection: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    questRewardText: {
        fontSize: 12,
        fontWeight: '600',
    },
    playButtonContainer: {
        marginTop: 8,
    },
    playButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        backgroundColor: '#4A7D9D',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 6,
    },
    playButtonText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    badgesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    badgeCard: {
        width: '48%',
        borderRadius: 12,
        padding: 12,
        alignItems: 'center',
        gap: 8,
        backgroundColor: '#fff',
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    badgeCardLocked: {
        opacity: 0.7,
    },
    badgeIcon: {
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
    },
    badgeLockIcon: {
        position: 'absolute',
        top: 8,
        right: 8,
    },
    badgeName: {
        fontSize: 12,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    badgeRequirement: {
        fontSize: 10,
        textAlign: 'center',
    },
    leaderboardItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 10,
        borderRadius: 12,
        padding: 12,
        backgroundColor: '#fff',
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    leaderboardItemHighlight: {
        backgroundColor: 'rgba(44, 95, 127, 0.1)',
        borderLeftWidth: 4,
        borderLeftColor: '#2C5F7F',
    },
    leaderboardRank: {
        width: 50,
        alignItems: 'center',
        gap: 4,
    },
    leaderboardRankText: {
        fontSize: 16,
    },
    leaderboardRankNumber: {
        fontSize: 10,
        fontWeight: 'bold',
    },
    leaderboardInfo: {
        flex: 1,
        gap: 2,
    },
    leaderboardName: {
        fontSize: 13,
        fontWeight: '600',
    },
    leaderboardLevel: {
        fontSize: 11,
        opacity: 0.6,
    },
    leaderboardPoints: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: 'rgba(255, 215, 0, 0.1)',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
    },
    leaderboardPointsValue: {
        fontSize: 13,
        fontWeight: 'bold',
    },
});