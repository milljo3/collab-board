/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {authClient} from "@/lib/auth-client";

interface WebSocketContextType {
    socket: WebSocket | null;
    isConnected: boolean;
    subscribe: (channel: string) => void;
    unsubscribe: (channel: string) => void;
    subscriptions: Set<string>;
}

type WebSocketMessage = {
    type: 'message';
    channel: string;
    payload: unknown;
};

const WebSocketContext = createContext<WebSocketContextType | null>(null);

export const useWebSocket = () => {
    const context = useContext(WebSocketContext);
    if (!context) {
        throw new Error('useWebSocket must be used within a WebSocketProvider');
    }
    return context;
};

interface WebSocketProviderProps {
    children: React.ReactNode;
    wsUrl?: string;
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({children, wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8080'}) => {
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const subscriptions = useRef(new Set<string>());
    const queryClient = useQueryClient();
    const reconnectTimeoutRef = useRef<NodeJS.Timeout>(undefined);
    const reconnectAttempts = useRef(0);
    const maxReconnectAttempts = 5;
    const { data: session } = authClient.useSession();

    const connect = () => {
        if (socket?.readyState === WebSocket.OPEN) return;

        try {
            const sessionToken = session?.session.token;
            const wsUrlWithToken = `${wsUrl}?token=${sessionToken}`;

            const ws = new WebSocket(wsUrlWithToken);

            ws.onopen = () => {
                console.log('WebSocket connected');
                setIsConnected(true);
                reconnectAttempts.current = 0;

                subscriptions.current.forEach(channel => {
                    ws.send(JSON.stringify({ type: 'subscribe', channel }));
                });
            };

            ws.onclose = (event) => {
                console.log('WebSocket disconnected', event.code, event.reason);
                setIsConnected(false);

                if (reconnectAttempts.current < maxReconnectAttempts) {
                    const delay = Math.pow(2, reconnectAttempts.current) * 1000;
                    reconnectTimeoutRef.current = setTimeout(() => {
                        reconnectAttempts.current++;
                        connect();
                    }, delay);
                }
            };

            ws.onerror = (error) => {
                console.error('WebSocket error:', error);
            };

            ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    handleMessage(data);
                }
                catch (error) {
                    console.error('Failed to parse WebSocket message:', error);
                }
            };

            setSocket(ws);
        }
        catch (error) {
            console.error('Failed to create WebSocket connection:', error);
        }
    };

    const handleMessage = (data: WebSocketMessage) => {
        const { type, channel, payload } = data;

        if (type !== 'message') return;

        console.log('Received WebSocket message:', { channel, payload });

        if (channel.startsWith('boards:update:')) {
            queryClient.invalidateQueries({ queryKey: ['all-boards'] });
        }
        else if (channel.startsWith('board:update:')) {
            const boardId = channel.split(':')[2];
            queryClient.invalidateQueries({ queryKey: ['board', boardId] });
        }
        else if (channel.startsWith('users:update:')) {
            const boardId = channel.split(':')[2];
            queryClient.invalidateQueries({ queryKey: ['board-users', boardId] });
        }
    };

    const subscribe = (channel: string) => {
        if (subscriptions.current.has(channel)) return;

        subscriptions.current.add(channel);

        if (socket?.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({ type: 'subscribe', channel }));
            console.log(`Subscribed to channel: ${channel}`);
        }
    };

    const unsubscribe = (channel: string) => {
        if (!subscriptions.current.has(channel)) return;

        subscriptions.current.delete(channel);

        if (socket?.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({ type: 'unsubscribe', channel }));
            console.log(`Unsubscribed from channel: ${channel}`);
        }
    };

    useEffect(() => {
        if (session?.user) {
            connect();
        }

        return () => {
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
            }
            socket?.close();
        };
    }, [session?.user]);

    useEffect(() => {
        return () => {
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
            }
            socket?.close();
        };
    }, []);

    const value: WebSocketContextType = {
        socket,
        isConnected,
        subscribe,
        unsubscribe,
        subscriptions: subscriptions.current,
    };

    return (
        <WebSocketContext.Provider value={value}>
            {children}
        </WebSocketContext.Provider>
    );
};