"use client";

import { useState, useEffect } from "react";

import { MDXRemote, type MDXRemoteSerializeResult } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";

import styled from "@emotion/styled";

import Alert from "./Actions/ConsoleLog";

import { Text } from "@radix-ui/themes";

import { customSSRComponents } from "~/mdx-components";

import type { MDXComponents } from "mdx/types";

const customClientComponents: MDXComponents = {
  ...customSSRComponents,
  Alert(props) {
    return <Alert {...props} />;
  },
};

const serializeFn = async function (source: string) {
  return await serialize(source, {
    mdxOptions: {
      development: process.env.NODE_ENV === "development",
    },
  });
};

const MDXRenderer = ({ source }: { source: string }) => {
  const [serialized, setSerialized] =
    useState<
      MDXRemoteSerializeResult<Record<string, unknown>, Record<string, unknown>>
    >();

  useEffect(() => {
    const fetchSerializedData = async () => {
      try {
        const s = await serializeFn(source);
        setSerialized(s);
      } catch (error) {
        console.error("Error compiling MDX:", error);
      }
    };
    void fetchSerializedData();
  }, [source]);

  if (!serialized) return null;

  return (
    <StyledText as="div" size="2" color="gray">
      <MDXRemote components={customClientComponents} {...serialized} />
    </StyledText>
  );
};

const StyledText = styled(Text)`
  pre,
  p + ul,
  p + div {
    margin: 1.2em 0;
  }

  ul + h2,
  p + h2 {
    margin-top: 1.2em;
  }

  li {
    list-style: disc;
    margin-left: 1.2em;
    margin-bottom: 0.2em;
  }

  pre > div {
    /* margin-left: -2.7em; */
    background: rgb(0, 0, 0, 0.5) !important;
    border-radius: 9px;
  }
`;

export default MDXRenderer;
