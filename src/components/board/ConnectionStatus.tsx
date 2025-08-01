import { useWebSocketStatus } from "@/hooks/web-sockets/subscriptions";

export const ConnectionStatus = () => {
    const { isConnected } = useWebSocketStatus();

    if (isConnected) {
        return (
            <div className="flex items-center gap-2 text-sm text-green-600">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Connected
            </div>
        );
    }

    return (
        <div className="flex items-center gap-2 text-sm text-red-600">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            Connecting...
        </div>
    );
};