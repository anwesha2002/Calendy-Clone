// "use client";

import {Button} from "@/components/ui/button";
import {SignInButton, SignUpButton, UserButton} from "@clerk/nextjs";
import {  auth } from "@clerk/nextjs/server";
import {redirect} from "next/navigation";


export default async function Home() {

    const { userId } = await auth()

    console.log(userId);

    if(userId != null) redirect("/events")

  return (
      <div className="flex justify-center items-center flex-col gap-2">
          <div className="text-3xl ">Fancy Home Page</div>
          <div className=" flex justify-center gap-2 ">
              <Button  asChild variant="default">
                  <SignUpButton  />
              </Button>
              <Button variant="outline" asChild>
                  <SignInButton  />
              </Button>
              <UserButton/>
          </div>
      </div>
  )
}
