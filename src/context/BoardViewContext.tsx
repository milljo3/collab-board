"use client";

import {usePathname, useRouter, useSearchParams} from "next/navigation";
import {createContext, useCallback, useContext, useMemo} from "react";

type BoardView = "board" | "users";
const DEFAULT_VIEW: BoardView = "board";

const BoardViewContext = createContext<{
    view: BoardView;
    setView: (view: BoardView) => void;
} | null>(null);

export const BoardViewProvider = ({children}: {children: React.ReactNode}) => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const view = (searchParams.get("view") as BoardView) || DEFAULT_VIEW;

    const setView = useCallback(
        (newView: BoardView) => {
            const params = new URLSearchParams(searchParams.toString());
            params.set("view", newView);
            router.replace(`${pathname}?${params.toString()}`, { scroll: false });
        },
        [searchParams, router, pathname]
    );

    const value = useMemo(() => ({ view, setView }), [setView, view]);

    return (
        <BoardViewContext.Provider value={value}>
            {children}
        </BoardViewContext.Provider>
    );
};

export const useBoardView = () => {
    const context = useContext(BoardViewContext);
    if (!context) throw new Error("useBoardView must be used within BoardViewProvider");
    return context;
}