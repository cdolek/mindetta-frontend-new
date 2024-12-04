"use client";
import React from "react";
import { Flex, Text } from "@radix-ui/themes";
// import InventoryItem from "./InventoryItem";

const Inventory = () => {
  return (
    <Flex
      gap="2"
      align="start"
      justify="start"
      direction="column"
      p="6"
      style={{ backgroundColor: "var(--gray-1)" }}
    >
      <Text>Inventory</Text>
      <Text>Inventory</Text>
      <Text>Inventory</Text>
      {/* <InventoryItem name="Start" type="start" />
      <InventoryItem name="Color Chooser" type="colorChooser" />
      <InventoryItem name="Diamond" type="diamond" />
      <InventoryItem name="Card" type="card" />
      <InventoryItem name="Dummy Task" type="dummyTask" />
      <InventoryItem name="Dummy Assistant" type="dummyAssistant" />
      <InventoryItem name="End" type="end" />
      <InventoryItem
        name="Product Manager"
        type="agent"
        title="I have some questions for you."
      />
      <InventoryItem
        name="Researcher"
        type="agent"
        title="I will do some deep research on this topic."
      />
      <InventoryItem
        name="Survey"
        type="agent"
        title="I have some questions for you."
        data={{
          label: "Survey",
          state: "userInput",
        }}
      />

      <InventoryItem
        name="Survey with Options"
        type="agent"
        data={{
          label: "Survey",
          state: "userInput",
          title:
            "Please specify the business topic you wish to explore through these interviews.",
          userInputOptions: [
            "Consumer Behavior in Online Retail",
            "Impact of AI in Healthcare",
            "Market Trends in Renewable Energy",
          ],
        }}
      />
      <InventoryItem name="Agent" type="agent" /> */}
      {/* <InventoryItem
        name="AI Task"
        type="task"
        data={{
          label: "AI Task",
        }}
      /> */}
    </Flex>
  );
};

export default Inventory;
