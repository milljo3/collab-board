"use client"

import React from 'react';
import {useAllBoardsQuery} from "@/hooks/useAllBoardsQuery";
import {Loader2} from "lucide-react";
import BoardCard from "@/components/dashboard/BoardCard";
import {Separator} from "@/components/ui/separator";
import BoardDialog from "@/components/dashboard/CreateBoardDialog";
import {useAllBoardsSync} from "@/hooks/web-sockets/subscriptions";

interface DashboardProps {
    username: string;
}

const Dashboard = ({username}: DashboardProps) => {
    const {data, isLoading, error} = useAllBoardsQuery();

    useAllBoardsSync();

    return (
        <div className="flex-1 flex flex-col px-2 py-6">
            <div className="flex flex-col items-center justify-center p-5 gap-4">
                <div className="flex flex-col items-center justify-center p-5">
                    <h1 className="text-lg text-center">Welcome {username}!</h1>
                    <p className="text-center">Get started with your boards below!</p>
                </div>
                <div className="w-1/2 flex items-center justify-center">
                    <Separator className="max-w-sm w-full bg-black" />
                </div>
                {data?.length !== 0 && (
                    <div className="flex flex-col md:flex-row justify-around items-center p-5 gap-6 md:w-[600px] w-full">
                        <BoardDialog />
                    </div>
                )}
            </div>

            {isLoading && (
                <div className="flex flex-col items-center justify-center flex-1">
                    <Loader2 className="animate-spin h-6 w-6" />
                </div>
            )}

            {error && (
                <div className="flex flex-col items-center justify-center flex-1">
                    <p className="text-danger">
                        Error fetching boards...
                    </p>
                </div>
            )}

            {!isLoading && !error && (
                <div className="flex flex-wrap justify-center gap-8 md:gap-4 pb-6">
                    {data?.length === 0 ? (
                        <div className="text-center flex flex-col gap-6 items-center">
                            <p>No boards yet? Create one now!</p>
                            <BoardDialog />
                        </div>
                    ) : (
                        <>
                            {data?.map((board) => (
                                <BoardCard allBoard={board} key={board.id} />
                            ))}
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default Dashboard;