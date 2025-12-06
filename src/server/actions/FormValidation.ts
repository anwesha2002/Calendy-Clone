"use server";

import { z } from "zod";
import { formEvents } from "@/schema/events";
import {db} from "@/drizzle/db";
import {EventTable} from "@/drizzle/schema";
import {auth} from "@clerk/nextjs/server";
import {redirect} from "next/navigation";
import { eq, and } from "drizzle-orm";
import { error } from "next/dist/build/output/log";

export async function CreateEvent(EventData : z.infer<typeof formEvents>) : Promise<{success: boolean, error: z.core.$ZodIssue[] | undefined} | undefined>{
    const {userId} = await auth()

    const { success, error, data } =  formEvents.safeParse(EventData);

    if(!success || userId == null){
        return {
            success : false,
            error : error?.issues
        }
    }

    await db.insert(EventTable).values({ ...data, clerkUserId : userId });

    redirect("/events")

}

export async function EditEvent(eventId : string , EventData : z.infer<typeof formEvents> ) : Promise<{success?: boolean | undefined, error?: z.core.$ZodIssue[] | boolean | undefined} | undefined>{
    const {userId} = await auth()

    const { success, error, data } =  formEvents.safeParse(EventData);

    if(!success || userId == null){
        return {
            success : false,
            error : error?.issues
        }
    }

  const { rowCount } = await db
    .update(EventTable)
    .set({ ...data })
    .where(and(eq(EventTable.id, eventId), eq(EventTable.clerkUserId, userId)))


  if(rowCount == 0) {
      return {
        error: true
      }
    }

    redirect("/events")

}

export async function deleteEvent(eventId : string  ) : Promise<{ error: boolean} | undefined>{
  const {userId} = await auth()

  if( userId == null){
    return {
      error : true
    }
  }

  await db.delete(EventTable).where(and(eq(EventTable.id, `${eventId}`), eq(EventTable.clerkUserId, userId)));

  redirect("/events")

}