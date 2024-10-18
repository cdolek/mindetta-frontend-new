"use client";

import type { Session } from "next-auth";

import { api } from "~/trpc/react";

import { Grid, Container } from "@radix-ui/themes";
import VideoCard from "~/app/_components/VideoCard";

import type { Video, VideoChannel } from "@prisma/client";
import SortVideos from "./SortVideos";

type ExtendedVideo = Video & {
  channel: Pick<VideoChannel, "id" | "snippet">;
};

export function LatestVideos({ session }: { session?: Session | null }) {
  const [latestVideos] = api.video.getAll.useSuspenseQuery();

  return latestVideos.length > 0 ? (
    <Container>
      <SortVideos />
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
