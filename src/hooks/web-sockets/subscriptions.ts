import { useEffect } from 'react';
import { useWebSocket } from "@/context/WebSocketContext"
import {authClient} from "@/lib/auth-client";

export const useAllBoardsSync = () => {
    const { subscribe, unsubscribe } = useWebSocket();
    const { data: session } = authClient.useSession();

    useEffect(() => {
        if (!session?.user?.id) return;

        const channel = `boards:update:${session.user.id}`;
        subscribe(channel);

        return () => {
            unsubscribe(channel);
        };
    }, [session?.user?.id, subscribe, unsubscribe]);
};

export const useBoardPageSync = (boardId?: string) => {
    const { subscribe, unsubscribe } = useWebSocket();

    useEffect(() => {
        if (!boardId) return;

        const boardChannel = `board:update:${boardId}`;
        const usersChannel = `users:update:${boardId}`;

        subscribe(boardChannel);
        subscribe(usersChannel);

        return () => {
            unsubscribe(boardChannel);
            unsubscribe(usersChannel);
        };
    }, [boardId, subscribe, unsubscribe]);
};

export const useWebSocketStatus = () => {
    const { isConnected } = useWebSocket();
    return { isConnected };
};