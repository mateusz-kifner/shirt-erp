import type { Meta, StoryObj } from "@storybook/react";

import SimpleTooltip from "@/components/ui/SimpleTooltip";

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: "shadcn/SimpleTooltip",
  component: SimpleTooltip,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    layout: "centered",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ["autodocs"],
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    children: { control: "text", defaultValue: "SimpleTooltip" },
  },
} satisfies Meta<typeof SimpleTooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Basic: Story = {
  args: {
    tooltip: "test tooltip",

    children: <div>test tooltip</div>,
  },
};

export const Left: Story = {
  args: {
    tooltip: "left tooltip",
    position: "left",

    children: <div>left tooltip</div>,
  },
};

export const Right: Story = {
  args: {
    tooltip: "right tooltip",
    position: "right",

    children: <div>right tooltip</div>,
  },
};

export const Top: Story = {
  args: {
    tooltip: "top tooltip",
    position: "top",

    children: <div>top tooltip</div>,
  },
};

export const Bottom: Story = {
  args: {
    tooltip: "bottom tooltip",
    position: "bottom",
    align: "center",
    children: <div>bottom tooltip</div>,
  },
};
