import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {z} from "zod";
import {formEvents} from "@/schema/events";
import {UseFormReturn} from "react-hook-form";

export function SingleFormEvent({form} : {form : UseFormReturn<z.input<typeof formEvents>, any, z.output<typeof formEvents>>} ) {
    return (
        <FormField
            control={form.control}
            name="name"
            render={({field})=>(
                <FormItem>
                    <FormLabel>UserName</FormLabel>
                    <FormControl>
                        <Input placeholder="Name" {...field} />
                    </FormControl>
                    <FormDescription>This is the name</FormDescription>
                    <FormMessage/>
                </FormItem>
            )}
        />
    );
}

