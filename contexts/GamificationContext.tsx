import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

// Define the shape of a single quest (copied from mahasiswa.tsx for context, though not stored in this context)
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

// Define the shape of user game statistics
interface UserGameStats {
    name: string;
    level: number;
    totalPoints: number;
    weeklyPoints: number;
    // Add other relevant stats like badges, achievements etc.
}

// Define the shape of level progress
interface LevelProgress {
    level: number;
    progressInLevel: number;
    pointsToNextLevel: number;
    progressPercent: number;
    pointsRequiredForNextLevel: number;
    pointsForCurrentLevel: number;
}

// Level thresholds (copied from mahasiswa.tsx)
const levelThresholds = [
    0,    // Level 1 starts at 0 points
    1000, // Level 2 starts at 1000 points
    2500, // Level 3 starts at 2500 points
    4500, // Level 4 starts at 4500 points
    7000, // Level 5 starts at 7000 points
    10000, // Level 6 starts at 10000 points
    14000, // Level 7 starts at 14000 points
    19000, // Level 8 starts at 19000 points
    25000, // Level 9 starts at 25000 points
    32000, // Level 10 starts at 32000 points
];

// Function to calculate level and progress (copied from mahasiswa.tsx)
const calculateLevelAndProgress = (totalPoints: number): LevelProgress => {
    let level = 1;
    let pointsForCurrentLevel = 0;
    let pointsForNextLevel = levelThresholds[1];

    for (let i = 0; i < levelThresholds.length; i++) {
        if (totalPoints >= levelThresholds[i]) {
            level = i + 1;
            pointsForCurrentLevel = levelThresholds[i];
            pointsForNextLevel = levelThresholds[i + 1] || Infinity; // Max level
        } else {
            break;
        }
    }

    const progressInLevel = totalPoints - pointsForCurrentLevel;
    const pointsToNextLevel = pointsForNextLevel - pointsForCurrentLevel;
    const progressPercent = pointsToNextLevel === 0 ? 100 : (progressInLevel / pointsToNextLevel) * 100;

    return {
        level,
        progressInLevel,
        pointsToNextLevel,
        progressPercent: Math.min(100, progressPercent), // Cap at 100%
        pointsRequiredForNextLevel: pointsToNextLevel,
        pointsForCurrentLevel,
    };
};

// Define the shape of the context value
interface GamificationContextType {
    userStats: UserGameStats;
    addPoints: (points: number) => void;
    levelProgress: LevelProgress;
    // Potentially add functions to complete quests or update badges
}

// Create the context
const GamificationContext = createContext<GamificationContextType | undefined>(undefined);

// Define the props for the GamificationProvider
interface GamificationProviderProps {
    children: ReactNode;
}

export const GamificationProvider: React.FC<GamificationProviderProps> = ({ children }) => {
    const [userStats, setUserStats] = useState<UserGameStats>(() => {
        const initialTotalPoints = 0; // Starting points for a new user
        const { level } = calculateLevelAndProgress(initialTotalPoints);
        return {
            name: 'Mardhiyah Auliya Rahman Lubis', // Default name, could come from UserProfileContext
            level: level,
            totalPoints: initialTotalPoints,
            weeklyPoints: 0, // Reset weekly points
        };
    });

    const [levelProgress, setLevelProgress] = useState<LevelProgress>(() =>
        calculateLevelAndProgress(userStats.totalPoints)
    );

    // Update levelProgress whenever userStats.totalPoints changes
    useEffect(() => {
        setLevelProgress(calculateLevelAndProgress(userStats.totalPoints));
    }, [userStats.totalPoints]);


    const addPoints = (points: number) => {
        setUserStats(prevStats => {
            const newTotalPoints = prevStats.totalPoints + points;
            const { level: newLevel } = calculateLevelAndProgress(newTotalPoints);
            return {
                ...prevStats,
                totalPoints: newTotalPoints,
                weeklyPoints: prevStats.weeklyPoints + points,
                level: newLevel,
            };
        });
    };

    const value = {
        userStats,
        addPoints,
        levelProgress,
    };

    return (
        <GamificationContext.Provider value={value}>
            {children}
        </GamificationContext.Provider>
    );
};

// Custom hook to use the GamificationContext
export const useGamification = () => {
    const context = useContext(GamificationContext);
    if (context === undefined) {
        throw new Error('useGamification must be used within a GamificationProvider');
    }
    return context;
};
