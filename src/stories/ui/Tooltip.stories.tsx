import type { Meta, StoryObj } from "@storybook/react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/Tooltip";

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: "shadcn/Tooltip",
  component: TooltipProvider,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    layout: "centered",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ["autodocs"],
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} satisfies Meta<typeof TooltipProvider>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Basic: Story = {
  args: {
    children: (
      <Tooltip>
        <TooltipTrigger>test tooltip</TooltipTrigger>
        <TooltipContent>Test tooltip content</TooltipContent>
      </Tooltip>
    ),
  },
};

export const Left: Story = {
  args: {
    children: (
      <Tooltip>
        <TooltipTrigger>left tooltip</TooltipTrigger>
        <TooltipContent side="left">Test tooltip content</TooltipContent>
      </Tooltip>
    ),
  },
};

export const Right: Story = {
  args: {
    children: (
      <Tooltip>
        <TooltipTrigger>right tooltip</TooltipTrigger>
        <TooltipContent side="right">Test tooltip content</TooltipContent>
      </Tooltip>
    ),
  },
};

export const Top: Story = {
  args: {
    children: (
      <Tooltip>
        <TooltipTrigger>top tooltip</TooltipTrigger>
        <TooltipContent side="top">Test tooltip content</TooltipContent>
      </Tooltip>
    ),
  },
};

export const Bottom: Story = {
  args: {
    children: (
      <Tooltip>
        <TooltipTrigger>bottom tooltip</TooltipTrigger>
        <TooltipContent side="bottom">Test tooltip content</TooltipContent>
      </Tooltip>
    ),
  },
};
