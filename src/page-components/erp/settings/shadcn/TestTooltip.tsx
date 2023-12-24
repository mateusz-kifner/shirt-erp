import Button from "@/components/ui/Button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/Tooltip";

function TestTooltip() {
  return (
    <>
      <div className="flex gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline">Hover</Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Add to library</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline">End</Button>
          </TooltipTrigger>
          <TooltipContent align="end">
            <p>Add to library</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline">Start</Button>
          </TooltipTrigger>
          <TooltipContent align="start">
            <p>Add to library</p>
          </TooltipContent>
        </Tooltip>
      </div>
      <div className="flex gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline">bottom</Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>Add to library</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline">left</Button>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p>Add to library</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline">top</Button>
          </TooltipTrigger>
          <TooltipContent side="top">
            <p>Add to library</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline">right</Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Add to library</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </>
  );
}

export default TestTooltip;
