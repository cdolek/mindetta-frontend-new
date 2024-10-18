"use client";
import styled from "@emotion/styled";
import { Box, Button, Flex, Text } from "@radix-ui/themes";
import Link from "next/link";
import UserMenu from "./UserMenu";

import type { Session } from "next-auth";
import {
  // TbArrowLoopRight2,
  // TbArrowLoopLeft2,
  // TbArrowGuide,
  // TbArrowElbowRight,
  // TbChartArrowsVertical,
  TbHome,
} from "react-icons/tb";

export default function ({ session }: { session?: Session | null }) {
  // console.log("session", session);
  return (
    <FlexStyled
      align="center"
      top="0"
      pt="2"
      pb="2"
      position={{
        initial: "relative",
        lg: "sticky",
        sm: "sticky",
        md: "sticky",
        xs: "sticky",
        xl: "sticky",
      }}
      style={{ zIndex: 999 }}
    >
      <Box width="100%" pl="3" pr="3">
        <Flex
          justify="between"
          align="center"
          gap="6"
          width="auto"
          height="auto"
        >
          <Box>
            <Link href="/">
              <Flex>
                {/* <TbArrowLoopRight2 />
                <TbArrowLoopLeft2 />
                <TbArrowGuide />
                <TbArrowElbowRight /> */}
                <TbHome size={18} />
              </Flex>
            </Link>
          </Box>
          <Flex justify="end" gap="3" align="center">
            {session && <Box>{/* <CreateNewFlow /> */}</Box>}
            <Box>
              {session && session.user ? (
                <UserMenu user={session.user} />
              ) : (
                <Link href="/api/auth/signin">
                  <Button>Sign in</Button>
                </Link>
              )}
            </Box>
          </Flex>
        </Flex>
      </Box>
    </FlexStyled>
  );
}

const FlexStyled = styled(Flex)`
  /* height: 48px !important; */
  background: #1c2024;
`;
2;
