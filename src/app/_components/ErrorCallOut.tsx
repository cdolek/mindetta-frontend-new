"use client";

import { InfoCircledIcon } from "@radix-ui/react-icons";
import { Callout } from "@radix-ui/themes";
import React from "react";

const ErrorCallOut = ({ message }: { message: string }) => {
  return (
    <Callout.Root color="red">
      <Callout.Icon>
        <InfoCircledIcon />
      </Callout.Icon>
      <Callout.Text>{message}</Callout.Text>
    </Callout.Root>
  );
};

export default ErrorCallOut;
