// import { Tabs, Box, Flex, Text } from "@radix-ui/themes";
import Chat from "./Chat";
// import { ChatBubbleIcon } from "@radix-ui/react-icons";

const RightSidebar = () => {
  return (
    // <Tabs.Root defaultValue="chat" style={{ height: "100%" }}>
    //   <Tabs.List>
    //     <Tabs.Trigger value="chat">
    //       <Flex gap="2" align="center">
    //         <Text>Chat</Text> <ChatBubbleIcon />
    //       </Flex>
    //     </Tabs.Trigger>
    //     <Tabs.Trigger value="inspectNodesAndEdges">
    //       Inspect Elements
    //     </Tabs.Trigger>
    //     <Tabs.Trigger value="inspectViewPort">Inspect Viewport</Tabs.Trigger>
    //   </Tabs.List>
    //   <Box pl="4" pt="0" pb="2" pr="4" flexGrow="1" style={{ height: "100%" }}>
    //     <Tabs.Content value="chat" style={{ height: "calc(100% - 50px)" }}>
    <Chat />
    //     </Tabs.Content>
    //   </Box>
    // </Tabs.Root>
  );
};

export default RightSidebar;
