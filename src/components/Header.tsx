import React from 'react';
import {OptionsDropDownMenu} from "@/components/auth/OptionsDropDownMenu";
import Link from "next/link";
import {ThemeToggle} from "@/components/ThemeToggle";

const Header = () => {
    return (
        <header className="flex justify-between items-center w-full p-4 border-b shrink-0">
            <Link href="/" className="text-lg font-semibold">
                Collab Board
            </Link>
            <div className="flex gap-2 justify-between">
                <ThemeToggle />
                <OptionsDropDownMenu />
            </div>
        </header>
    );
};

export default Header;