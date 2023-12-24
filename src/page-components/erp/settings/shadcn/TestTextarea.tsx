import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";

function TestTextarea() {
  return (
    <>
      <Textarea placeholder="Type your message here." />
      <Textarea placeholder="Type your message here." disabled />
      <div className="grid w-full gap-1.5">
        <Label label="Your Message" htmlFor="message-2"></Label>
        <Textarea placeholder="Type your message here." id="message-2" />
        <p className="text-sm text-muted-foreground">
          Your message will be copied to the support team.
        </p>
      </div>
    </>
  );
}

export default TestTextarea;
