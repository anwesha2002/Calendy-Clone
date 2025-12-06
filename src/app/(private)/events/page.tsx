import {UserButton} from "@clerk/nextjs";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {CalendarPlus} from "lucide-react";
import {EventTable} from "@/drizzle/schema";
import {db} from "@/drizzle/db";
import {eq} from "drizzle-orm";
import {auth} from "@clerk/nextjs/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {boolean, integer, text} from "drizzle-orm/pg-core";
import {formatTimeDuration} from "@/lib/formatTimeDuration";
import {Description} from "@radix-ui/react-dialog";
import {CustomCopyButton} from "@/components/CustomCopyButton";
import { cn } from "@/lib/utils";

interface EventCardProps {
    id : string
    name: string,
    description: string | null,
    durationInMinutes: number,
    clerkUserId: string,
    isActive: boolean
}

export default async function EventPage() {

    const {userId, redirectToSignIn } = await auth()

    if (!userId) return redirectToSignIn;

    const events = await db.query.EventTable.findMany({
        where : ({clerkUserId} , {eq}) => eq(clerkUserId, userId),
        orderBy : ({createdAt} , {desc}) => desc(createdAt)
    })

    return (
        <>
            <div className="flex gap-4 items-baseline">
                <h1 className="text-3xl lg:text-4xl xl:text-5xl mb-6">Events</h1>
                <Button asChild className="bg-primary">
                    <Link href="/events/new">
                        <CalendarPlus className="mr-3 size-6"/>
                        Event
                    </Link>
                </Button>
            </div>
            <div>
                {events.length > 0 ? (
                    <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(400px,1fr))] ">
                        {events.map((event) => (
                            <EventCard key={event.id} {...event} />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center gap-4">
                        <p className="text-lg text-muted-foreground">You have not created any events yet.</p>
                        <Button asChild className="bg-primary w-fit">
                            <Link href="/events/new">
                                <CalendarPlus className="mr-4 size-6"/>
                                Create your first event
                            </Link>
                        </Button>
                    </div>
                )}
            </div>
        </>
    );
}


export function EventCard({ name, durationInMinutes, id, isActive, clerkUserId, description } : EventCardProps) {
    return (
      <Card
        className={cn(
          "p-4 flex flex-col ",
          isActive
            ? "hover:shadow-lg transition-shadow"
            : " border-secondary/20 ",
        )}
      >
        <CardHeader>
          <CardTitle className={cn(isActive ? "" : "opacity-50")}>
            {name}
          </CardTitle>
          <CardDescription className={cn(isActive ? "" : "opacity-50")}>
            {formatTimeDuration(durationInMinutes)}
          </CardDescription>
        </CardHeader>
        {Description != null && (
          <CardContent className={cn(isActive ? "" : "opacity-50")}>
            {description}
          </CardContent>
        )}
        <CardFooter className="mt-auto flex justify-end gap-2">
          {isActive && (
            <CustomCopyButton clerkUserId={clerkUserId} EventId={id} />
          )}
          <Button asChild>
            <Link href={`events/${id}/edit`}>Edit</Link>
          </Button>
        </CardFooter>
      </Card>
    );
}

