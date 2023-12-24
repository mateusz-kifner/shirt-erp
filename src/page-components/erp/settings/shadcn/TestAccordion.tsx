import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/Accordion";
import { Card } from "@/components/ui/Card";
import { lorem } from "./lorem";

function TestAccordion() {
  return (
    <Card className="w-full bg-white p-2 dark:bg-stone-950">
      <Accordion type="multiple" className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger>Test</AccordionTrigger>
          <AccordionContent>{lorem}</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Test2</AccordionTrigger>
          <AccordionContent>{lorem}</AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
}

export default TestAccordion;
