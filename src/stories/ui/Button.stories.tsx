import type { Meta, StoryObj } from "@storybook/react";
import { IconMail } from "@tabler/icons-react";

import Button from "@/components/ui/Button";

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: "shadcn/Button",
  component: Button,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    layout: "centered",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ["autodocs"],
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    children: { control: "text", defaultValue: "Button" },
    onClick: { action: "clicked", type: "function" },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Primary: Story = {
  args: {
    children: "Button",
    variant: "default",
  },
};

export const PrimaryWithIcons: Story = {
  args: {
    children: "Button",
    variant: "default",
    leftSection: <IconMail/>,
    rightSection: <IconMail/>
  },
};

export const Secondary: Story = {
  args: {
    children: "Button",
    variant: "secondary",
  },
};

export const Outline: Story = {
  args: {
    children: "Button",
    variant: "outline",
  },
};

export const Ghost: Story = {
  args: {
    children: "Button",
    variant: "ghost",
  },
};

export const Small: Story = {
  args: {
    size: "sm",
    children: "Button",
  },
};

export const Medium: Story = {
  args: {
    size: "default",
    children: "Button",
  },
};

export const Large: Story = {
  args: {
    size: "sm",
    children: "Button",
  },
};

export const Icon: Story = {
  args: {
    size: "icon",
    children: <IconMail />,
  },
};
