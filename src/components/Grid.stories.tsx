import React from "react";
import { Meta, StoryFn } from "@storybook/react"; // Import the updated Storybook types
import Grid from "./Grid"; // Path to your component

// Default export to define the component metadata in Storybook
export default {
  title: "Components/Grid", // The title for your component in the Storybook menu
  component: Grid, // The component to be displayed
} as Meta<typeof Grid>; // Type the default export

// Create a template of how your component should look
const Template: StoryFn<typeof Grid> = (args) => <Grid {...args} />;

// Create different stories using the template
export const Primary = Template.bind({});
Primary.args = {
  label: "Primary Button",
  primary: true,
};

export const Secondary = Template.bind({});
Secondary.args = {
  label: "Secondary Button",
  primary: false,
};
