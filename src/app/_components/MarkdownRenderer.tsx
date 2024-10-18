"use client";
import styled from "@emotion/styled";
import {
  Table,
  Heading,
  Text,
  Strong,
  Link,
  Separator,
  Callout,
} from "@radix-ui/themes";
import Markdown, { type Options as MarkdownOptions } from "react-markdown";
import {
  Prism as SyntaxHighlighter,
  type SyntaxHighlighterProps,
} from "react-syntax-highlighter";
import { vscDarkPlus as highlighterTheme } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";

type MarkdownRendererProps = {
  children: string;
  markdownOptions?: Partial<MarkdownOptions>;
  syntaxHighlighterOptions?: Partial<SyntaxHighlighterProps>;
};

const MarkdownRenderer = ({
  children: markdown,
  markdownOptions,
  syntaxHighlighterOptions,
}: MarkdownRendererProps) => {
  return (
    <StyledText as="div" size="2" color="gray">
      <Markdown
        components={{
          h1(props) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { children, node, ref, ...rest } = props;
            return (
              <Heading as="h1" size="8" mb="3" mt="3">
                {children}
              </Heading>
            );
          },
          h2(props) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { children, node, ref, ...rest } = props;
            return (
              <Heading as="h2" size="6" mb="3" mt="3">
                {children}
              </Heading>
            );
          },
          h3(props) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { children, node, ref, ...rest } = props;
            return (
              <Heading as="h3" size="4" mb="3" mt="3">
                {children}
              </Heading>
            );
          },
          h4(props) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { children, node, ref, ...rest } = props;
            return (
              <Heading as="h4" size="2" mb="2" mt="2">
                {children}
              </Heading>
            );
          },
          p(props) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { children, node, ref, ...rest } = props;
            return (
              <Text as="p" mb="4">
                {children}
              </Text>
            );
          },
          ul(props) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { children, node, ref, ...rest } = props;
            return <ul className="rt-r-mb-6">{children}</ul>;
          },
          b(props) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { children, node, ref, ...rest } = props;
            return <Strong>{children}</Strong>;
          },
          strong(props) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { children, node, ref, ...rest } = props;
            return <Strong>{children}</Strong>;
          },
          table(props) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { children, node, ref, ...rest } = props;
            return (
              <Table.Root variant="ghost" mt="6" mb="6">
                <Table.Body>{children}</Table.Body>
              </Table.Root>
            );
          },
          tr(props) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { children, node, ref, ...rest } = props;
            return <Table.Row>{children}</Table.Row>;
          },
          td(props) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { children, node, ref, ...rest } = props;
            return <Table.Cell>{children}</Table.Cell>;
          },
          thead(props) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { children, node, ref, ...rest } = props;
            return <Table.Header>{children}</Table.Header>;
          },
          th(props) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { children, node, ref, ...rest } = props;
            return <Table.ColumnHeaderCell>{children}</Table.ColumnHeaderCell>;
          },
          hr(props) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { children, node, ref, ...rest } = props;
            return (
              <Separator
                orientation="horizontal"
                size="4"
                children={children}
              />
            );
          },
          a(props) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { children, node, href, ref, ...rest } = props;
            return (
              <Link underline="hover" color="blue" href={href} target="_blank">
                {children}
              </Link>
            );
          },

          blockquote(props) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { children, node, ref, ...rest } = props;
            return (
              <Callout.Root size="1">
                <Callout.Text>{children}</Callout.Text>
              </Callout.Root>
            );
          },

          code(props) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { children, className, node, ref, ...rest } = props;
            const match = /language-(\w+)/.exec(className ?? "");
            return match ? (
              <SyntaxHighlighter
                {...rest}
                PreTag="div"
                // wrapLines
                // wrapLongLines
                children={String(children).replace(/\n$/, "")}
                language={match[1]}
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                style={highlighterTheme}
                {...syntaxHighlighterOptions}
              />
            ) : (
              <code {...rest} className={className}>
                {children}
              </code>
            );
          },
        }}
        remarkPlugins={[remarkGfm]}
        {...markdownOptions}
      >
        {markdown}
      </Markdown>
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

export default MarkdownRenderer;
