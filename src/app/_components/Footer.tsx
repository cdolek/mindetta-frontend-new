import React from "react";
import { Box, Container, Flex, Text } from "@radix-ui/themes";

export default function Footer() {
  return (
    <Flex align="center" height="7">
      <Container>
        <Flex
          justify="between"
          align="center"
          gap="6"
          width="auto"
          height="auto"
        >
          <Box>
            <Text size="1">© 2024</Text>
          </Box>
          <Flex justify="center">
            <Box>
              <Text size="1"></Text>
            </Box>
          </Flex>
          <Flex justify="end">
            <Box>
              <Text size="1"></Text>
            </Box>
          </Flex>
        </Flex>
      </Container>
    </Flex>
  );
}
