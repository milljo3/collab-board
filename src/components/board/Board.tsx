import React, {useEffect} from 'react';
import {useBoardQuery} from "@/hooks/useBoardQuery";
import {redirect, useParams} from "next/navigation";
import {toast} from "sonner";
import {Loader2} from "lucide-react";
import Category from "@/components/board/category/Category";
import AddCategoryButton from "@/components/board/category/AddCategoryButton";

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
                <p>Fetching board...</p>
                <Loader2 className="animate-spin h-6 w-6" />
            </div>
        )
    }

    if (!data) {
        redirect("/dashboard");
    }

    return (
        <div className="flex flex-col gap-4 pt-4 pb-4 pl-4 w-full h-full min-w-0">
            <h1 className="text-2xl font-bold mb-6 flex-shrink-0">{data.title}</h1>

            <div className="flex gap-4 w-full h-full overflow-x-auto min-w-0 pr-4">
                {data.categories.map((category) => (
                    <Category key={category.id} category={category} />
                ))}
                <AddCategoryButton boardId={id} />
            </div>
        </div>
    );
};

export default Board;