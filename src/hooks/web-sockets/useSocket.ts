"use client";

import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useQueryClient } from '@tanstack/react-query';
import {useSession} from "@/lib/auth-client";

interface PresenceUser {
    userId: string;
    name: string;
    avatar?: string;
    lastSeen: Date;
}

interface InvalidateQueryEvent {
    queryKey: string[];
    type: 'board-update' | 'board-users-update' | 'all-boards-update';
}

interface PresenceUpdateEvent {
    users: PresenceUser[];
}

export const useSocket = () => {
    const socketRef = useRef<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [presentUsers, setPresentUsers] = useState<PresenceUser[]>([]);
    const queryClient = useQueryClient();
    const heartbeatIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const { data: session } = useSession();

    useEffect(() => {
        if (!session) return;

        const token = session?.session.token;

        const socket = io(process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'http://localhost:3001', {
            transports: ['websocket', 'polling'],
            auth: { token }
        });

        socketRef.current = socket;

        socket.on('connect', () => {
            console.log('Connected to socket server');
            setIsConnected(true);

            heartbeatIntervalRef.current = setInterval(() => {
                socket.emit('heartbeat');
            }, 30000);
        });

        socket.on('disconnect', () => {
            console.log('Disconnected from socket server');
            setIsConnected(false);
            setPresentUsers([]);

            if (heartbeatIntervalRef.current) {
                clearInterval(heartbeatIntervalRef.current);
                heartbeatIntervalRef.current = null;
            }
        });

        socket.on('connect_error', (error) => {
            console.error('Socket connection error:', error);
            setIsConnected(false);
        });

        socket.on('invalidate-query', (data: InvalidateQueryEvent) => {
            console.log('Invalidating query:', data);
            queryClient.invalidateQueries({ queryKey: data.queryKey });
        });

        socket.on('presence-update', (data: PresenceUpdateEvent) => {
            console.log('Presence update:', data);
            setPresentUsers(data.users);
        });

        socket.on('error', (error) => {
            console.error('Socket error:', error);
        });

        return () => {
            if (heartbeatIntervalRef.current) {
                clearInterval(heartbeatIntervalRef.current);
            }
            socket.disconnect();
        };
    }, [queryClient, session]);

    const joinDashboard = () => {
        if (socketRef.current && isConnected) {
            socketRef.current.emit('join-dashboard');
            console.log('Joined dashboard room');
        }
    };

    const joinBoard = (boardId: string) => {
        if (socketRef.current && isConnected) {
            socketRef.current.emit('join-board', { boardId });
            console.log('Joined board room:', boardId);
        }
    };

    const leaveBoard = (boardId: string) => {
        if (socketRef.current && isConnected) {
            socketRef.current.emit('leave-board', { boardId });
            console.log('Left board room:', boardId);
        }
    };

    return {
        socket: socketRef.current,
        isConnected,
        presentUsers,
        joinDashboard,
        joinBoard,
        leaveBoard,
    };
};