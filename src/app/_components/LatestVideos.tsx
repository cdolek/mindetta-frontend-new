"use client";

import type { Session } from "next-auth";

import { api } from "~/trpc/react";

import { Heading, Flex, Box, Grid, Container } from "@radix-ui/themes";
import VideoCard from "~/app/_components/VideoCard";

import type { Video, VideoChannel } from "@prisma/client";
import SortVideos from "./SortVideos";
import Autocomplete from "./AutoComplete";

type ExtendedVideo = Video & {
  channel: Pick<VideoChannel, "id" | "snippet">;
};
import useMindettaStore from "~/_stores/store";

export function LatestVideos({ session }: { session?: Session | null }) {
  const videosSortBy = useMindettaStore((state) => state.videosSortBy);
  const videosSortOrder = useMindettaStore((state) => state.videosSortOrder);
  const videosSortCount = useMindettaStore((state) => state.videosSortCount);

  const [latestVideos] = api.video.getAll.useSuspenseQuery({
    videosSortBy,
    videosSortOrder,
    videosSortCount,
  });

  return latestVideos.length > 0 ? (
    <Container>
      <Flex
        align="center"
        pl="3"
        // style={{ background: "red" }}
      >
        <Box flexGrow="1">
          <Heading>Videos</Heading>
        </Box>
        <SortVideos />
      </Flex>
      <Grid
        columns={{
          initial: "1",
          xs: "2",
          sm: "3",
          md: "5",
        }}
        gap="3"
        p="3"
        width="auto"
        style={{ zIndex: 0 }}
      >
        {latestVideos.map((video, index) => {
          const reversedIndex = latestVideos.length - index - 1;
          return (
            <VideoCard
              key={index}
              video={video as unknown as ExtendedVideo}
              index={reversedIndex}
              sessionUserId={session?.user?.id ?? ""}
              sessionEmail={session?.user?.email ?? ""}
            />
          );
        })}
      </Grid>
    </Container>
  ) : null;
}
