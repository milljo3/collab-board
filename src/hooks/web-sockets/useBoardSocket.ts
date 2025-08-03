/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useRef } from 'react';
import { useSocketContext } from '@/app/providers/SocketProvider';

export const useBoardSocket = (boardId?: string) => {
    const { joinBoard, leaveBoard, isConnected } = useSocketContext();
    const lastJoinedRef = useRef<{ boardId: string; } | null>(null);

    useEffect(() => {
        if (!isConnected || !boardId) {
            return;
        }

        const currentJoin = { boardId };
        const lastJoined = lastJoinedRef.current;

        if (!lastJoined || lastJoined.boardId !== boardId) {
            if (lastJoined && lastJoined.boardId !== boardId) {
                leaveBoard(lastJoined.boardId);
            }

            joinBoard(boardId);
            lastJoinedRef.current = currentJoin;
        }
    }, [isConnected, boardId, joinBoard, leaveBoard]);

    useEffect(() => {
        return () => {
            if (lastJoinedRef.current) {
                leaveBoard(lastJoinedRef.current.boardId);
                lastJoinedRef.current = null;
            }
        };
    }, []);
};