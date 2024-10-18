import { Flex, Box, Heading, Button, Link } from "@radix-ui/themes";
import UserMenu from "./UserMenu";

import { type Session } from "next-auth";

export default function ({ session }: { session?: Session | null }) {
  return (
    <Flex align="center" height="9">
      <Box width="100%" pl="3" pr="3">
        <Flex
          justify="between"
          align="center"
          gap="6"
          width="auto"
          height="auto"
        >
          <Box>
            {/* <Heading as="h1">
              agent.market <Link href={session ? "/flows" : "/"}>(~)</Link>
            </Heading> */}
          </Box>
          <Flex justify="center" align="center"></Flex>
          <Flex justify="end" gap="3" align="center">
            {/* <Box>
              {session && session.user ? (
                <UserMenu user={session.user} />
              ) : (
                <Link size="3" href="/api/auth/signin">
                  <Button>Sign in</Button>
                </Link>
              )}
            </Box> */}
          </Flex>
        </Flex>
      </Box>
    </Flex>
  );
}
