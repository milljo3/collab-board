import {useSocketContext} from "@/app/providers/SocketProvider";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"

export const ConnectionStatus = () => {
    const { isConnected } = useSocketContext();

    if (isConnected) {
        return (
            <Tooltip>
                <TooltipTrigger className="md:flex items-center gap-2 text-sm text-green-600 hidden">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Connected
                </TooltipTrigger>
                <TooltipContent>
                    <p>In sync with server</p>
                </TooltipContent>
            </Tooltip>
        );
    }

    return (
    <Tooltip>
        <TooltipTrigger className="md:flex items-center gap-2 text-sm text-red-600 hidden">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            Connecting...
        </TooltipTrigger>
        <TooltipContent>
            <p>Connecting to server...</p>
        </TooltipContent>
    </Tooltip>
    );
};