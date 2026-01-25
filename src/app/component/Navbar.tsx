"use client"

import { cn } from "@/src/lib/utils";
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function Navbar() {
    const pathName = usePathname();
    return (
        <nav className="flex justify-center gap-4 p-4 bg-blue-400">
            <Link href={"/"}
                className={cn("transition-colors hover:text-primary",
                    pathName === "/" ? "text-primary" : "text-muted-foreground")}>
                Trang chủ
            </Link>
            <Link href={"/contact"}
                className={cn("transition-colors hover:text-primary",
                    pathName === "/contact" ? "text-primary" : "text-muted-foreground")}>
                Liên hệ
            </Link>
        </nav>
    )
}