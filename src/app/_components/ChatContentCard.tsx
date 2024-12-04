import { memo } from "react";
import { Box, Flex, Text, Avatar } from "@radix-ui/themes";
import { useSession } from "next-auth/react";
import styled from "@emotion/styled";
import MarkdownRenderer from "./MarkdownRenderer";
// import MDXRenderer from "./MDXRenderer";
const ChatContentCard = ({
  who,
  content,
  isLoading,
}: {
  who: "data" | "user" | "system" | "assistant";
  content: string;
  isLoading: boolean;
}) => {
  // const session = useSession();
  const bgcolor = "var(--gray-a2)";

  return (
    <Flex
      gap="3"
      align="start"
      // style={{ background: "red" }}
      justify={who === "user" ? "end" : "start"}
    >
      {who === "assistant" && <Avatar size="2" radius="full" fallback="M" />}
      <Box
        pl={who === "assistant" ? "1" : "4"}
        pr="4"
        style={{
          background: who === "user" ? bgcolor : "transparent",
          borderRadius: "var(--radius-3)",
        }}
      >
        <Spacing />
        <MarkdownRenderer>{content}</MarkdownRenderer>
      </Box>
    </Flex>
  );
};

export default memo(ChatContentCard);

{
  /* <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempore
            consectetur at quam ullam, repellat voluptatibus odio sed, nam
            necessitatibus nihil consequuntur ut, iusto tenetur magni accusamus
            quasi deserunt quisquam. Harum!
          </p>
          <p>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Molestiae
            nesciunt tempore nam rem, consectetur reprehenderit possimus
            officiis consequuntur laudantium, cumque assumenda iusto minima et
            recusandae impedit reiciendis inventore repellendus. Tenetur.
          </p>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempore
            consectetur at quam ullam, repellat voluptatibus odio sed, nam
            necessitatibus nihil consequuntur ut, iusto tenetur magni accusamus
            quasi deserunt quisquam. Harum!
          </p>
          <p>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Molestiae
            nesciunt tempore nam rem, consectetur reprehenderit possimus
            officiis consequuntur laudantium, cumque assumenda iusto minima et
            recusandae impedit reiciendis inventore repellendus. Tenetur.
          </p> */
}

const Spacing = styled.div`
  height: 6px;
`;
