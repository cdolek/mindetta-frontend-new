"use client";
/* eslint-disable @next/next/no-img-element */
import {
  Flex,
  Card,
  Avatar,
  Inset,
  Link,
  Strong,
  Text,
  Box,
} from "@radix-ui/themes";
import type { VideoChannel } from "@prisma/client";

const VideoChannelCard = ({
  videoChannel,
  index,
  sessionUserId,
  sessionEmail,
}: {
  videoChannel: VideoChannel;
  index: number;
  sessionUserId: string;
  sessionEmail: string;
}) => {
  return (
    <Card size="2" style={{ maxWidth: 240 }}>
      <Link href={`/videoChannels/${videoChannel.id}`} key={videoChannel.id}>
        <Inset clip="padding-box" side="top" pb="current">
          <img
            src={videoChannel.snippet.thumbnails?.medium.url}
            alt={videoChannel.snippet.title}
            style={{
              display: "block",
              objectFit: "cover",
              width: "100%",
              height: 140,
              backgroundColor: "var(--gray-5)",
            }}
          />
        </Inset>
      </Link>
      <Flex gap="3" direction="column" justify="between">
        <Text as="p" size="3">
          <Strong>{videoChannel.snippet.title}</Strong>
        </Text>

        <Flex gap="2" justify="between" align="center">
          <Box flexGrow="0">
            <Text size="1">
              Subs: {videoChannel.statistics.subscriberCount.toLocaleString()}
            </Text>
            {/* <Avatar
              title={videoChannel.createdBy.title ?? ""}
              src={videoChannel.createdBy.image ?? ""}
              fallback={"U"}
              radius="full"
              size="1"
              style={{
                scale: 0.8,
              }}
            /> */}
          </Box>
          <Text size="1" color="gray">
            {/* {createdByName}{" "} */}
            {`${videoChannel.snippet.publishedAt?.toLocaleDateString([], {
              year: "2-digit",
              month: "2-digit",
              day: "2-digit",
            })}`}
          </Text>
          {/* {(sessionUserId === videoChannel.createdBy.id ||
            sessionEmail === "cdolek@gmail.com") && (
            <Flex flexGrow="1" justify="end">
              <RemoveVideoButton videoChannel={videoChannel} />
            </Flex>
          )} */}
        </Flex>
      </Flex>
    </Card>
  );
};

export default VideoChannelCard;
