import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import FormEvent from "@/components/FormEvent";
import {auth} from "@clerk/nextjs/server";
import {db} from "@/drizzle/db";
import {eq} from "drizzle-orm";
import {ScheduleTable} from "@/drizzle/schema";
import {ScheduleForm} from "@/components/ScheduleForm";


export default async function SchedulePage() {


    const { isAuthenticated, redirectToSignIn, userId } = await auth()
    if(!isAuthenticated || !userId) return redirectToSignIn();

    const schedule = await db.query.ScheduleTable.findFirst(
        {
            where: ({clerkUserId}, {eq}) => eq(clerkUserId, userId),
            with : {
                availabilities : {
                    orderBy : ({startTime}, {desc}) => desc(startTime)
                }
            }
        }
    );

    return (
        <Card className="max-w-lg mx-auto">
            <CardHeader>
                <CardTitle>New Schedule</CardTitle>
            </CardHeader>
            <CardContent>
                <ScheduleForm schedule={{...schedule , availabilities :  schedule?.availabilities  }} />
            </CardContent>
        </Card>
    );
}

