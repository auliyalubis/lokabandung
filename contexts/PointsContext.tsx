import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Point {
  id: string;
  title: string;
  latitude: number;
  longitude: number;
  location: string;
  description: string;
  icon: string;
  color: string;
  // Add other properties if needed
}

interface PointsContextType {
  points: Point[];
  addPoint: (point: Point) => void;
  updatePoint: (point: Point) => void;
  deletePoint: (id: string) => void;
  // Add other functions as needed
}

const PointsContext = createContext<PointsContextType | undefined>(undefined);

interface PointsProviderProps {
  children: ReactNode;
}

export const PointsProvider: React.FC<PointsProviderProps> = ({ children }) => {
  const [points, setPoints] = useState<Point[]>([]); // Initialize with an empty array or fetched data

  const addPoint = (point: Point) => {
    setPoints((prevPoints) => [...prevPoints, point]);
  };

  const updatePoint = (updatedPoint: Point) => {
    setPoints((prevPoints) =>
      prevPoints.map((point) => (point.id === updatedPoint.id ? updatedPoint : point))
    );
  };

  const deletePoint = (id: string) => {
    setPoints((prevPoints) => prevPoints.filter((point) => point.id !== id));
  };

  const value = {
    points,
    addPoint,
    updatePoint,
    deletePoint,
  };

  return <PointsContext.Provider value={value}>{children}</PointsContext.Provider>;
};

export const usePoints = () => {
  const context = useContext(PointsContext);
  if (context === undefined) {
    throw new Error('usePoints must be used within a PointsProvider');
  }
  return context;
};
