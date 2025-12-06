"use client"
import {ComponentProps} from "react"
import Link from "next/link";
import {usePathname} from 'next/navigation'
import {cn} from "@/lib/utils";

export function Navlink({className , ...props} : ComponentProps<typeof Link> ) {

    const router = usePathname()
    const isActive = router === props.href ? "text-foreground" : "text-muted-foreground hover:text-foreground";

    return (
        <Link {...props} className={cn(
            "transition-colors ",
            isActive,
            className
        )}>

        </Link>
    );
}

