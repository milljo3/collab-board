import React, {useEffect} from 'react';
import {useBoardQuery} from "@/hooks/useBoardQuery";
import {redirect, useParams} from "next/navigation";
import {toast} from "sonner";
import {Loader2} from "lucide-react";

const Board = () => {
    const params = useParams();
    const id = params.id as string;

    const {data, isLoading, error} = useBoardQuery(id);

    useEffect(() => {
        if (error) {
            toast.error("Error fetching board or board does not exist.");
            redirect("/dashboard");
        }
    }, [error]);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center h-dvh justify-center">
                <p>Fetching meeting...</p>
                <Loader2 className="animate-spin h-6 w-6" />
            </div>
        )
    }

    if (!data) {
        redirect("/dashboard");
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">{data.title}</h1>

            <div className="space-y-6">
                <p className="text-gray-600">Board content goes here...</p>
            </div>
        </div>
    );
};

export default Board;