import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the shape of the user profile data
interface UserProfile {
  id: string;
  name: string;
  email: string;
  // Add other user-related fields as needed
}

// Define the shape of the context value
interface UserProfileContextType {
  userProfile: UserProfile | null;
  setUserProfile: (profile: UserProfile | null) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

// Create the context with a default undefined value
const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined);

// Define the props for the UserProfileProvider
interface UserProfileProviderProps {
  children: ReactNode;
}

export const UserProfileProvider: React.FC<UserProfileProviderProps> = ({ children }) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Example: initial loading state

  // You would typically fetch user data here
  // useEffect(() => {
  //   const fetchUserProfile = async () => {
  //     try {
  //       // Simulate API call
  //       setIsLoading(true);
  //       const data: UserProfile = { id: '1', name: 'John Doe', email: 'john.doe@example.com' };
  //       setUserProfile(data);
  //     } catch (error) {
  //       console.error("Failed to fetch user profile", error);
  //       setUserProfile(null);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };
  //   fetchUserProfile();
  // }, []);

  const value = {
    userProfile,
    setUserProfile,
    isLoading,
    setIsLoading,
  };

  return (
    <UserProfileContext.Provider value={value}>
      {children}
    </UserProfileContext.Provider>
  );
};

// Custom hook to use the UserProfileContext
export const useUserProfile = () => {
  const context = useContext(UserProfileContext);
  if (context === undefined) {
    throw new Error('useUserProfile must be used within a UserProfileProvider');
  }
  return context;
};
