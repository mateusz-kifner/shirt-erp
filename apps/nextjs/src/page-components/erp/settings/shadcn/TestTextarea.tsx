import { Label } from "@shirterp/ui-web/Label";
import { Textarea } from "@shirterp/ui-web/Textarea";

function TestTextarea() {
  return (
    <>
      <Textarea placeholder="Type your message here." />
      <Textarea placeholder="Type your message here." disabled />
      <div className="grid w-full gap-1.5">
        <Label label="Your Message" htmlFor="message-2" />
        <Textarea placeholder="Type your message here." id="message-2" />
        <p className="text-muted-foreground text-sm">
          Your message will be copied to the support team.
        </p>
      </div>
    </>
  );
}

export default TestTextarea;
