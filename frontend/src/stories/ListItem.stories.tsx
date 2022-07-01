import React from "react"
import { ComponentStory, ComponentMeta } from "@storybook/react"
import { NavButton } from "../components/layout/NavButton"
import { Sun } from "../utils/TablerIcons"

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "ShirtERP/Navigation",
  component: NavButton,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    label: { control: "text" },
    size: { control: "text" },
    Icon: { control: null },
  },
} as ComponentMeta<typeof NavButton>

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof NavButton> = (args) => (
  <NavButton {...args} />
)

export const Primary = Template.bind({})
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = {
  label: "Button",
  Icon: <Sun />,
}
