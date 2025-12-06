import {ReactNode} from "react";
import { auth} from "@clerk/nextjs/server";
import {redirect} from "next/navigation";

export default async function AuthLayout({children} : {children: ReactNode}) {
    const { userId   } = await auth()

    console.log(userId);

    if(userId != null) redirect("/")

    return (
        <div className="flex flex-col justify-center items-center min-h-screen ">
            {children}
        </div>
    );
}

