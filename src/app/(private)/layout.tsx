import {ReactNode} from "react";
import {  CalendarRange } from "lucide-react"
import {UserButton} from "@clerk/nextjs";
import "../globals.css"
import {Navlink} from "@/components/Navlink";

export default function PrivateLayout({children} : {children: ReactNode}) {
    return (
        <>
            <header className="bg-card flex py-2 border-b shadow-sm">
                <nav className="gap-6 container  flex items-center font-medium text-sm">
                    <div className="gap-2 flex font-semibold items-center mr-auto">
                        <CalendarRange className="w-6 h-6"  />
                        <span className="sr-only md:not-sr-only">Calendy</span>
                    </div>
                    <Navlink href="/events">Events</Navlink>
                    <Navlink href="/schedule">Schedules</Navlink>
                    <div className="ml-auto w-6 h-6">
                        <UserButton  appearance={{ elements : { userButtonAvatarBox : "size-full" }}} />
                    </div>
                </nav>
            </header>
            <main className="my-6 container  ">
                {children}
            </main>
        </>
    );
}

