import { Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import FormEvent from "@/components/FormEvent";
import { db } from "@/drizzle/db";
import { auth } from "@clerk/nextjs/server";
import {notFound} from "next/navigation";


export default async function EditPage({params} : {params : {eventId : string}}) {

    const {userId, redirectToSignIn} = await auth()

    if(userId == null) return redirectToSignIn()

    const { eventId } = params;

    const data = await db.query.EventTable.findFirst({
      where: ({ clerkUserId, id }, { and,eq }) =>and(eq(clerkUserId, userId), eq(id, eventId))
    });

    if (!data) return notFound()

    return (
      <Card className="max-w-lg mx-auto">
        <CardHeader>
          <CardTitle>Edit Event</CardTitle>
        </CardHeader>
        <CardContent>
          <FormEvent event={{...data, description : data.description || undefined }} />
        </CardContent>
      </Card>
    );
}

