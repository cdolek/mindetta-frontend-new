import { Grid, Text } from "@radix-ui/themes";
import VideoCard from "~/app/_components/VideoCard";
import { api } from "~/trpc/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "~/server/auth";
import type { Video, VideoChannel } from "@prisma/client";
import { Flex, Select } from "@radix-ui/themes";
type ExtendedVideo = Video & {
  channel: Pick<VideoChannel, "id" | "snippet">;
};

export default async function Videos() {
  const recentVideos = await api.video.getAll();
  const session = await getServerSession(authOptions);

  return recentVideos.length > 0 ? (
    <>
      <Flex justify="end" p="3">
        <Select.Root defaultValue="published">
          <Select.Trigger />
          <Select.Content>
            <Select.Group>
              <Select.Label>Sort by</Select.Label>
              <Select.Item value="published">Published</Select.Item>
              <Select.Item value="processed">Processed</Select.Item>
            </Select.Group>
          </Select.Content>
        </Select.Root>
        <Select.Root defaultValue="desc">
          <Select.Trigger />
          <Select.Content>
            <Select.Group>
              <Select.Label>Sort by</Select.Label>
              <Select.Item value="desc">DESC</Select.Item>
              <Select.Item value="asc">ASC</Select.Item>
            </Select.Group>
          </Select.Content>
        </Select.Root>
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
        {recentVideos.map((video, index) => {
          const reversedIndex = recentVideos.length - index - 1;
          // return video.thumbnails.standard.url;
          return (
            <VideoCard
              key={index}
              video={video as ExtendedVideo}
              index={reversedIndex}
              sessionUserId={session!.user.id}
              sessionEmail={session!.user.email!}
            />
          );
        })}
      </Grid>
    </>
  ) : (
    <Text>No videos were found.</Text>
  );
}
