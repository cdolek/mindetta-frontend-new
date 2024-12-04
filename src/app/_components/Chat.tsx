import { useEffect, useState, useMemo, useRef } from "react";
import { useChat } from "ai/react";
import { Container, Flex, Box, Text, IconButton } from "@radix-ui/themes";
import { PaperPlaneIcon } from "@radix-ui/react-icons";
import ChatContentCard from "./ChatContentCard";
import AdaptiveTextArea from "./AdaptiveTextArea";

// import { useMemo } from "react";
// import { insertDataIntoMessages } from "./transform";
// import { ChatInput, ChatMessages } from "./chat/";
// import Status from "./status";

const Chat = () => {
  const {
    messages,
    input,
    isLoading,
    handleSubmit,
    handleInputChange,
    // reload,
    // stop,
    data,
  } = useChat({
    api: process.env.NEXT_PUBLIC_CHAT_API,
  });

  const totalTokens = useRef(0);
  const endOfMessagesRef = useRef<HTMLDivElement | null>(null);

  const transformedMessages = useMemo(() => {
    console.log("messages", messages, "data", data);
    // return insertDataIntoMessages(messages, data);
  }, [messages, data]);

  useEffect(() => {
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollTop =
        endOfMessagesRef.current.scrollHeight;
    }
  }, [totalTokens.current]);

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <Flex
      direction="column"
      justify="between"
      gap="3"
      // width="auto"
      height="100%"
      flexGrow="1"
      style={{ height: "100%" }}
    >
      <Flex
        ref={endOfMessagesRef}
        direction="column"
        gap="3"
        // flexGrow="1"
        style={{ overflowY: "auto" }}
        pr="5"
        pt="4"
      >
        {messages.length === 0 && (
          <Flex
            align="center"
            justify="center" // Add this line to center the content horizontally
            height="100%" // Add this line to make the container take up the full height
          >
            <Text>How can I help you today?</Text>
          </Flex>
        )}

        {messages.map((item) => (
          <ChatContentCard
            key={item.id}
            who={item.role}
            content={item.content}
            isLoading={isLoading}
          />
        ))}
        {isLoading && (
          <Box pl="8">
            <div className="dot-falling"></div>
          </Box>
        )}
      </Flex>

      <Box position="fixed" bottom="0" left="0" right="0">
        <form name="chat" onSubmit={handleSubmit}>
          <Container
            size="3"
            style={{
              maxWidth: "748px",
              margin: "0 auto",
              backgroundColor: "var(--gray-1)",
              borderRadius: "var(--radius-5) var(--radius-5) 0 0",
            }}
            p="5"
          >
            <Flex align="center" gap="3">
              <AdaptiveTextArea
                lines={12}
                value={input}
                placeholder="Ask me about anything..."
                disabled={isLoading}
                onKeyDown={handleKeyDown}
                onChange={handleInputChange}
              />
              {/* <IconButton
                variant="ghost"
                size="3"
                type="submit"
                disabled={isLoading}
              >
                <PaperPlaneIcon />
              </IconButton> */}
            </Flex>
          </Container>
        </form>
      </Box>
    </Flex>
  );
};

export default Chat;
