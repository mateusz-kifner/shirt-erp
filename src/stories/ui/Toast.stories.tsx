import type { Meta, StoryObj } from "@storybook/react";

import {
  ToastProvider,
  Toast,
  ToastDescription,
  ToastTitle,
  ToastAction,
} from "@/components/ui/Toast";
import { toast } from "@/hooks/useToast";
import Button from "@/components/ui/Button";
import { Toaster } from "@/components/layout/Toaster";

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: "shadcn/Toast",
  component: ToastProvider,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    layout: "centered",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  // tags: ["autodocs"],
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} satisfies Meta<typeof ToastProvider>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Basic: Story = {
  args: {
    children: (
      <>
        <Button
          onClick={() => {
            toast({
              title: "Scheduled: Catch up ",
              description: "Friday, February 10, 2023 at 5:57 PM",
              action: (
                <ToastAction altText="Goto schedule to undo">Undo</ToastAction>
              ),
            });
          }}
        >
          Open Toast
        </Button>
        <Button
          onClick={() => {
            toast({
              variant: "destructive",
              title: "Scheduled: Catch up ",
              description: "Friday, February 10, 2023 at 5:57 PM",
              action: (
                <ToastAction altText="Goto schedule to undo">Undo</ToastAction>
              ),
            });
          }}
        >
          Open Destructive Toast
        </Button>
        <Toaster />
      </>
    ),
  },
};
