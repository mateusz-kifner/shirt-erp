import type { Meta, StoryObj } from "@storybook/react";

import { Calendar } from "@/components/ui/Calendar";
import { ComponentProps, useState } from "react";
import { DayPickerSingleProps } from "react-day-picker";

const TestCalendar = ({
  mode = "single",
  selected,
  onSelect,
  ...moreProps
}: Omit<DayPickerSingleProps, "mode"> & { mode?: undefined | "single" }) => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  return (
    <Calendar selected={date} onSelect={setDate} mode="single" {...moreProps} />
  );
};

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: "shadcn/Calendar",
  component: TestCalendar,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    layout: "centered",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ["autodocs"],
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} satisfies Meta<typeof TestCalendar>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Primary: Story = {
  args: {},
};
