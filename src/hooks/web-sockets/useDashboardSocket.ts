'use client';

import { useEffect } from 'react';
import { useSocketContext } from '@/app/providers/SocketProvider';

export const useDashboardSocket = () => {
    const { joinDashboard, isConnected } = useSocketContext();

    useEffect(() => {
        if (isConnected) {
            joinDashboard();
        }
    }, [isConnected, joinDashboard]);
};