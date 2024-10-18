import { Button, Flex } from "@radix-ui/themes";
import Link from "next/link";

import { getServerAuthSession } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";
import NavBar2 from "./_components/NavBar2";
import { LatestVideos } from "./_components/LatestVideos";

export default async function Home() {
  const session = await getServerAuthSession();
  void api.video.getAll.prefetch();

  return (
    // <HydrateClient>
    <Flex direction="column" height="100%" style={{ height: "100vh" }}>
      <NavBar2 session={session} />
      <Flex
        flexGrow="1"
        style={{ background: "#0A0A0A" }}
        align="center"
        justify="center"
      >
        {session?.user ? (
          <LatestVideos session={session} />
        ) : (
          <Link href="/api/auth/signin">
            <Button>Sign in</Button>
          </Link>
        )}
      </Flex>
    </Flex>
    // </HydrateClient>
  );
}
