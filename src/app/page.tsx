import { Button, Flex, Link } from "@radix-ui/themes";

import { LatestPost } from "~/app/_components/post";
import { getServerAuthSession } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";

export default async function Home() {
  const session = await getServerAuthSession();
  void api.post.getLatest.prefetch();

  return (
    <HydrateClient>
      <Flex direction="column" height="100%" style={{ height: "100vh" }}>
        <Flex
          flexGrow="1"
          style={{ background: "#0A0A0A" }}
          align="center"
          justify="center"
        >
          {session?.user ? (
            <LatestPost />
          ) : (
            <Link size="3" href="/api/auth/signin">
              <Button>Sign in</Button>
            </Link>
          )}
        </Flex>
      </Flex>
    </HydrateClient>
  );
}
