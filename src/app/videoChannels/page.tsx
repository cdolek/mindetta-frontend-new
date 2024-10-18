import { Grid, Text } from "@radix-ui/themes";
import VideoChannelCard from "~/app/_components/VideoChannelCard";
import { api } from "~/trpc/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "~/server/auth";

export default async function VideoChannels() {
  const videoChannels = await api.videoChannel.getAll();
  const session = await getServerSession(authOptions);

  return videoChannels.length > 0 ? (
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
      {videoChannels.map((videoChannel, index) => {
        const reversedIndex = videoChannels.length - index - 1;
        // return videoChannel.thumbnails.standard.url;
        return (
          <VideoChannelCard
            key={index}
            videoChannel={videoChannel}
            index={reversedIndex}
            sessionUserId={session!.user.id}
            sessionEmail={session!.user.email!}
          />
        );
      })}
    </Grid>
  ) : (
    <Text>No videoChannels yet.</Text>
  );
}
