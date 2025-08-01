import {useBoardUsersQuery} from "@/hooks/useBoardUsersQuery";
import {Loader2} from "lucide-react";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import RoleSelect from "@/components/board/users/RoleSelect";
import DeleteUserDialog from "@/components/board/users/DeleteUserDialog";
import AddUserDialog from "@/components/board/users/AddUserDialog";

interface UsersProps {
    userId: string;
    boardId: string;
}

const Users = ({userId, boardId}: UsersProps) => {
    const { data, isLoading, error } = useBoardUsersQuery(boardId);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center h-dvh justify-center">
                <p>Fetching users...</p>
                <Loader2 className="animate-spin h-6 w-6" />
            </div>
        )
    }
    if (error || !data) {
        if (!data) {
            return <p>NO DATA</p>
        }
        return <p>Error</p>
    }

    const isOwner = data.some(
        (user) => user.userId === userId && user.role === "OWNER"
    );

    return (
        <div className="flex flex-col items-center h-full py-6">
            <div className="flex justify-end w-full px-2 pr-3">
                {isOwner && (
                    <AddUserDialog boardId={boardId} />
                )}
            </div>
            <div className="md:w-2/3 w-full overflow-y-auto px-2 pb-4">
                <Table>
                    <TableCaption>A list of board members.</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead className="w-[180px]">Role</TableHead>
                            <TableHead className="w-[1%] text-right"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell className="font-medium">{user.user.name}</TableCell>
                                <TableCell>{user.user.email}</TableCell>
                                <TableCell className="w-[180px]">
                                    <RoleSelect
                                        initialRole={user.role}
                                        boardId={boardId}
                                        userId={user.userId}
                                        isOwner={isOwner}
                                    />
                                </TableCell>
                                <TableCell className="text-right">
                                    <DeleteUserDialog
                                        boardId={boardId}
                                        userId={user.userId}
                                        username={user.user.name}
                                        role={user.role}
                                        isOwner={isOwner}
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default Users;