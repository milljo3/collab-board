import {useSocketContext} from "@/app/providers/SocketProvider";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";

interface PresenceProps {
    maxVisible: number;
}

const Presence = ({ maxVisible }: PresenceProps) => {
    const { presentUsers } = useSocketContext();

    const sizeClasses = {
        sm: 'h-8 w-8 text-xs',
        md: 'h-10 w-10 text-sm',
        lg: 'h-12 w-12 text-base'
    };

    const getBackgroundColor = (name: string) => {
        const colors = [
            'bg-red-500',
            'bg-blue-500',
            'bg-green-500',
            'bg-yellow-500',
            'bg-purple-500',
            'bg-pink-500',
            'bg-indigo-500',
            'bg-teal-500',
            'bg-orange-500',
            'bg-cyan-500'
        ];

        const hash = name.split('').reduce((acc, char) => {
            return char.charCodeAt(0) + ((acc << 5) - acc);
        }, 0);

        return colors[Math.abs(hash) % colors.length];
    };

    if (presentUsers.length === 0) {
        return null;
    }

    const visibleUsers = presentUsers.slice(0, maxVisible);
    const remainingUsers = presentUsers.slice(maxVisible);
    const remainingCount = Math.max(0, presentUsers.length - maxVisible);

    const remainingUserNames = remainingUsers.map(user => user.name).join(', ');

    return (
        <div className="gap-2 items-center hidden md:flex">
            <div className="flex gap-1">
                {visibleUsers.map((user, index) => (
                    <Avatar
                        key={index}
                        name={user.name}
                        className={`${getBackgroundColor(user.name)} ${sizeClasses.sm}`}
                    />
                ))}
            </div>
            {remainingCount > 0 && (
                <Tooltip>
                    <TooltipTrigger
                        className="h-8 w-8 text-xs flex items-center justify-center rounded-full font-medium shadow-md border-2"
                    >
                        +{remainingCount}
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>{remainingUserNames}</p>
                    </TooltipContent>
                </Tooltip>
            )}
        </div>
    );
};

const Avatar = ({name, className}: {name: string, className: string}) => {
    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(word => word.charAt(0))
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <Tooltip>
            <TooltipTrigger className={`${className} flex items-center justify-center rounded-full text-white font-medium shadow-md border-2 border-white`}>
                {getInitials(name)}
            </TooltipTrigger>
            <TooltipContent>
                <p>{name}</p>
            </TooltipContent>
        </Tooltip>
    );
}

export default Presence;