"use client"

import { useTransition } from 'react'
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Textarea } from "@/components/ui/textarea";
import {
  CreateEvent,
  deleteEvent,
  EditEvent,
} from "@/server/actions/FormValidation";
import { CheckCircle } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { boolean } from "drizzle-orm/pg-core";
import {ScheduleFormSchema} from "@/schema/schedule";
import {DAYS_OF_WEEKS} from "@/data/constants";
import {formatTimeZoneOffset, timeToInt} from "@/lib/utils";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";

interface Availability {
    startTime: string,
    endTime: string,
    dayOfWeek : (typeof DAYS_OF_WEEKS)[number]
}

export function ScheduleForm({ schedule }: { schedule: {
        timezone? : string | undefined,
        availabilities?: Availability[],
    } }) {

  const [isDeletePending, startDeleteTransition] = useTransition();

  const form = useForm<
    z.input<typeof ScheduleFormSchema>,
    any,
    z.output<typeof ScheduleFormSchema>
  >({
    resolver: zodResolver(ScheduleFormSchema),
    defaultValues: {
        timezone: schedule?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
        availabilities: schedule.availabilities?.toSorted((a,b)=> {
            return timeToInt(a.startTime) - timeToInt(b.startTime)
        }),
    }
  });

  const onSubmit = async (values: z.infer<typeof ScheduleFormSchema>) => {

    const action = schedule == null ? CreateEvent : EditEvent.bind(null, schedule?.id);

    const data = await action(values);

    if (data?.error != null) {
      form.setError("root", {
        type: "server",
        message: (data.error instanceof boolean) ? "Some Error occurred" : (data?.error as z.core.$ZodIssue[]).flatMap((error) => error.message).join(" , "),
      });
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex gap-6 flex-col"
      >
        {form.formState.errors.root && (
          <div className=" text-destructive text-sm">
            {form.formState.errors.root.message}
          </div>
        )}
        <FormField
          control={form.control}
          name="timezone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>UserName</FormLabel>
              <FormDescription>
                The names users will see when booking
              </FormDescription>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {Intl.supportedValuesOf("timeZone").map((tz) =>(
                                <SelectItem key={tz} value={tz}>
                                    {tz}
                                    {`(${formatTimeZoneOffset(tz)})`}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  className="resize-none h-32"
                  placeholder="Description"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Optional description of the event
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="durationInMinutes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Duration</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...form.register("durationInMinutes")}
                  placeholder="Duration"
                  {...field}
                />
              </FormControl>
              <FormDescription>In minutes</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormDescription>
                Inactive events will not be visible
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-3">
          {event &&
            <Button asChild>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button disabled={isDeletePending || form.formState.isSubmitting} variant="destructiveGhost">Delete</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      this event and remove data from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={()=>{
                      startDeleteTransition(async ()=>{
                        const data = await deleteEvent(event.id)
                        if (data?.error){
                          form.setError("root", {
                            type: "server",
                            message:  "Some Error occurred"
                          });
                        }
                      })
                    }}>Continue</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </Button>
          }
          <Button
            type="submit"
            disabled={form.formState.isSubmitting || isDeletePending}
            className={form.formState.isSubmitting ? "bg-muted-foreground" : ""}
          >
            {form.formState.isSubmitted &&
            form.formState.errors.root == null ? (
              <CheckCircle className="size-5" />
            ) : (
              "Submit"
            )}
          </Button>
          <Button type="button" asChild variant="outline" disabled={form.formState.isSubmitting || isDeletePending}>
            <Link href="/events">Cancel</Link>
          </Button>
        </div>
      </form>
      {/*<Form watch={} getValues={} getFieldState={} setError={} clearErrors={} setValue={} trigger={} formState={} resetField={} reset={} handleSubmit={} unregister={} control={} register={} setFocus={} subscribe={}*/}
    </Form>
  );
}
