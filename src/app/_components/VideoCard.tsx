"use client";
/* eslint-disable @next/next/no-img-element */
import {
  Flex,
  Card,
  Badge,
  Avatar,
  Inset,
  Strong,
  Text,
  Box,
} from "@radix-ui/themes";
import Link from "next/link";

import type { Video, VideoChannel } from "@prisma/client";
// import RemoveVideoButton from "./RemoveVideoButton";

import { formatVideoSecondsToTime } from "~/libs/utils";

type ExtendedVideo = Video & {
  channel: Pick<VideoChannel, "id" | "snippet">;
};

const VideoCard = ({
  video,
}: {
  video: ExtendedVideo;
  index: number;
  sessionUserId: string;
  sessionEmail: string;
}) => {
  if (!video) {
    return null;
  }

  return (
    <Card size="2" style={{ maxWidth: 340 }}>
      <Link href={`/videos/${video.id}`} key={video.id}>
        <Inset
          clip="padding-box"
          side="top"
          pb="current"
          style={{ position: "relative" }}
        >
          <img
            src={video.thumbnails?.standard?.url}
            alt={video.title}
            style={{
              display: "block",
              objectFit: "cover",
              width: "100%",
              height: 120,
              backgroundColor: "var(--gray-5)",
            }}
          />
          <Badge
            variant="solid"
            radius="none"
            style={{
              position: "absolute",
              bottom: 16,
              right: 0,
              background: "black",
            }}
          >
            {video.metadata
              ? formatVideoSecondsToTime(video.metadata.duration)
              : null}
          </Badge>
        </Inset>
      </Link>
      <Flex
        gap="3"
        direction="column"
        justify="between"
        style={{ minHeight: 180 }}
      >
        <Text as="p" size="3">
          <Strong>{video.title}</Strong>
        </Text>

        <Flex gap="2" justify="between" align="center">
          <Box flexGrow="0">
            <Link
              href={`/videoChannels/${video.channel?.id}`}
              title={video.channelTitle ?? ""}
            >
              <Avatar
                title={video.channelTitle ?? ""}
                src={video.channel?.snippet.thumbnails?.default.url ?? ""}
                fallback={"U"}
                radius="full"
                size="2"
                style={{
                  scale: 0.8,
                }}
              />
            </Link>
          </Box>
          <Text size="1" color="gray">
            {/* {createdByName}{" "} */}
            {`${video.publishedAt?.toLocaleDateString([], {
              year: "2-digit",
              month: "2-digit",
              day: "2-digit",
            })} ${video.publishedAt.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}`}
          </Text>
          {/* {(sessionUserId === video.createdBy.id ||
            sessionEmail === "cdolek@gmail.com") && (
            <Flex flexGrow="1" justify="end">
              <RemoveVideoButton video={video} />
            </Flex>
          )} */}
        </Flex>
      </Flex>
    </Card>
  );
};

export default VideoCard;
