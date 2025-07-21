import {Button} from "@/components/ui/button";
import Link from "next/link";
import {ArrowLeftIcon} from "lucide-react";

interface ReturnButtonProps {
    href: string;
    className?: string;
}

const ReturnButton = ({ href, className }: ReturnButtonProps) => {
    return (
        <Button size="lg" className={className}>
            <Link href={href} className="flex items-center justify-center w-full">
                <ArrowLeftIcon/> Back
            </Link>
        </Button>
    );
};

export default ReturnButton;