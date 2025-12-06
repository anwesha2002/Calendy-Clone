import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import FormEvent from "@/components/FormEvent";


export default function NewEventPage() {
    return (
      <Card className="max-w-lg mx-auto">
        <CardHeader>
          <CardTitle>Create New Event</CardTitle>
        </CardHeader>
        <CardContent>
          <FormEvent />
        </CardContent>
      </Card>
    );
}

