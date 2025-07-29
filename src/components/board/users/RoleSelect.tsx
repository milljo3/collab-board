import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {Role} from "@prisma/client";
import {useUpdateBoardUser} from "@/hooks/board-users/useUpdateBoardUser";

interface RoleSelectProps {
    boardId: string;
    userId: string;
    initialRole: Role
    isOwner: boolean;
}

const RoleSelect = ({boardId, userId, initialRole, isOwner}: RoleSelectProps) => {
    const updateUser = useUpdateBoardUser(boardId, userId)

    const disabled = updateUser.isPending || !isOwner || initialRole === Role.OWNER;

    return (
        <Select
            defaultValue={initialRole}
            onValueChange={(newRole: Role) => {
                updateUser.mutate({ role: newRole });
            }}
            disabled={disabled}
        >
            <SelectTrigger className="w-[180px] text-black">
                <SelectValue/>
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>Roles</SelectLabel>
                    <SelectItem value="OWNER">{Role.OWNER}</SelectItem>
                    <SelectItem value="EDITOR">{Role.EDITOR}</SelectItem>
                    <SelectItem value="VIEWER">{Role.VIEWER}</SelectItem>
                </SelectGroup>
            </SelectContent>
        </Select>
    );
};

export default RoleSelect;