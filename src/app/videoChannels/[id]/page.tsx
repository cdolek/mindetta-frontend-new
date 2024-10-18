import { Grid, Text, Flex, Heading, Container } from "@radix-ui/themes";
import VideoCard from "~/app/_components/VideoCard";
import ErrorCallOut from "~/app/_components/ErrorCallOut";
import VideosBreadcrumbs from "~/app/_components/VideosBreadcrumbs";
import { api } from "~/trpc/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "~/server/auth";
import type { Video, User, VideoChannel } from "@prisma/client";
import Link from "next/link";

type ExtendedVideo = Video & {
  channel: Pick<VideoChannel, "id" | "snippet">;
};

export default async function VideoChannelPage({
  params,
}: {
  params: { id: VideoChannel["id"] };
}) {
  const { id } = params;

  const videoChannel = await api.videoChannel.get({ id });

  const channelId = videoChannel?.channelId!;

  const recentVideos = await api.videoChannel.getVideosByChannelId({
    channelId,
  });
  const session = await getServerSession(authOptions);

  try {
    if (!videoChannel) {
      return <ErrorCallOut message={`Error: VideoChannel ${id} not found.`} />;
    }
    return recentVideos.length > 0 ? (
      <>
        <Flex direction="column" gap="3" mt="3">
          <Flex m="3" flexGrow="1" direction="column">
            <VideosBreadcrumbs />
            <Flex align="center" gap="3">
              <Heading size="7">{videoChannel.snippet.title}</Heading>
              <Text>
                <Link
                  href={`https://www.youtube.com/channel/${videoChannel.channelId}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  {videoChannel.snippet.customUrl}
                </Link>
              </Text>
            </Flex>
            {/* <code>{JSON.stringify(videoChannel, null, 2)}</code> */}
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
              {recentVideos.map((video, index) => {
                const reversedIndex = recentVideos.length - index - 1;
                // return video.thumbnails.standard.url;
                return (
                  <VideoCard
                    key={index}
                    video={video as ExtendedVideo}
                    index={reversedIndex}
                    sessionUserId={session!.user.id}
                    sessionEmail={session!.user.email!!}
                  />
                );
              })}
            </Grid>
          </Flex>
        </Flex>
      </>
    ) : (
      <Text>No videos found.</Text>
    );
  } catch (error) {
    console.error("Error connecting to the server:", error);
    return (
      <ErrorCallOut message="Error: Failed to connect to the socket server." />
    );
  }
}
