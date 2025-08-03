"use client";

import React, { createContext, useContext, ReactNode } from 'react';
import { useSocket } from '@/hooks/web-sockets/useSocket';

interface PresenceUser {
    userId: string;
    name: string;
    avatar?: string;
    lastSeen: Date;
}

interface SocketContextType {
    isConnected: boolean;
    presentUsers: PresenceUser[];
    joinDashboard: () => void;
    joinBoard: (boardId: string) => void;
    leaveBoard: (boardId: string) => void;
}

const SocketContext = createContext<SocketContextType | null>(null);

interface SocketProviderProps {
    children: ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
    const socket = useSocket();

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocketContext = () => {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error('useSocketContext must be used within a SocketProvider');
    }
    return context;
};