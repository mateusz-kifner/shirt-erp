import type { Meta, StoryObj } from "@storybook/react";

import { Toggle } from "@/components/ui/Toggle";

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: "shadcn/Toggle",
  component: Toggle,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    layout: "centered",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ["autodocs"],
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    children: { control: "text", defaultValue: "Toggle" },
  },
} satisfies Meta<typeof Toggle>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Primary: Story = {
  args: {
    children: "Toggle",
    variant: "default",
  },
};

export const Outline: Story = {
  args: {
    children: "Toggle",
    variant: "outline",
  },
};

export const Small: Story = {
  args: {
    children: "Toggle",
variant:"outline",
    size: "sm",
  },
};

export const Default: Story = {
  args: {
    children: "Toggle",
variant:"outline",
    size: "default",
  },
};

export const Large: Story = {
  args: {
    children: "Toggle",
variant:"outline",
    size: "lg",
  },
};
