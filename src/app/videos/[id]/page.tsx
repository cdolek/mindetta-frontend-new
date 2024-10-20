"use client";
import type { Video } from "@prisma/client";
import ErrorCallOut from "~/app/_components/ErrorCallOut";
// import { api } from "~/trpc/server";
import { api } from "~/trpc/react";

import { DownloadIcon, ClipboardCopyIcon } from "@radix-ui/react-icons";

import { useState } from "react";

import YouTubePlayer from "~/app/_components/YouTubePlayer";

import { formatVideoStats } from "~/libs/utils";

import { saveAs } from "file-saver";

import {
  Box,
  Button,
  Card,
  Heading,
  Container,
  Flex,
  Text,
  Separator,
} from "@radix-ui/themes";

import Link from "next/link";

import MarkdownRenderer from "~/app/_components/MarkdownRenderer";
import VideosBreadcrumbs from "~/app/_components/VideosBreadcrumbs";
import BtnGoToTop from "~/app/_components/BtnGoToTop";

export default function VideoPage({ params }: { params: { id: Video["id"] } }) {
  const { id } = params;
  // const video = await api.video.get.query({ id });

  const video = api.video.get.useQuery({ id });

  const [startSeconds, setStartSeconds] = useState<number>(0);

  // const stringMatchesSentences =
  //   await api.video.getStringMatchesSentences.query({ videoId });

  // const sentenceEntities2 = await api.video.getSentenceEntities2WithCount.query(
  //   {
  //     videoId,
  //   },
  // );

  // const sentenceEntities = await api.video.getSentenceEntitiesWithCount.query({
  //   videoId,
  // });

  if (video.isLoading || video.isPending) {
    return null;
  }

  try {
    if (!video.data && video.isError) {
      return <ErrorCallOut message={`Error: Video ${id} not found.`} />;
    }

    const topicsSummary = video.data?.topicsSummary;
    const transcriptChaptersSummary = video.data?.transcriptChaptersSummary;

    const topicsSummaryElements = topicsSummary
      ? Object.keys(topicsSummary).map((title: string) => {
          const content: string =
            topicsSummary[title as keyof typeof topicsSummary];
          return (
            <Flex direction="column" gap="2" mb="7" key={title}>
              <Box>
                <Flex gap="5" align="baseline">
                  <Heading size="6" mb="4">
                    {title}
                  </Heading>
                  <Button
                    variant="ghost"
                    onClick={() => downloadSingleTopicSummary(title, content)}
                  >
                    <DownloadIcon /> Download
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => copyToClipboard(`# ${title}\n\n${content}`)}
                  >
                    <ClipboardCopyIcon /> Copy to clipboard
                  </Button>
                </Flex>
                <Box ml="4">
                  <MarkdownRenderer>{content}</MarkdownRenderer>
                </Box>
              </Box>
              <Separator orientation="horizontal" size="4" />
            </Flex>
          );
        })
      : [];

    // console.log("transcriptChaptersSummary", transcriptChaptersSummary);

    const transcriptChaptersSummaryElement = (
      title: string,
      startTime: number,
    ) => {
      const content: string =
        transcriptChaptersSummary![
          title as keyof typeof transcriptChaptersSummary
        ];

      return (
        <Flex direction="column" gap="2" mb="7" key={title}>
          <Box>
            <Flex gap="5" align="baseline">
              <Link
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setStartSeconds(startTime);
                }}
              >
                <Heading size="6" mb="4" color="ruby">
                  {title}
                </Heading>
              </Link>
              <Button
                // size="2"
                variant="ghost"
                onClick={() => downloadSingleChapterSummary(title, content)}
              >
                <DownloadIcon /> Download
              </Button>

              <Button
                // size="2"
                variant="ghost"
                onClick={() => copyToClipboard(`# ${title}\n\n${content}`)}
              >
                <ClipboardCopyIcon /> Copy to clipboard
              </Button>
            </Flex>
            <Box ml="4">
              <MarkdownRenderer>
                {
                  transcriptChaptersSummary![
                    title as keyof typeof transcriptChaptersSummary
                  ]
                }
              </MarkdownRenderer>
            </Box>
          </Box>
          <Separator orientation="horizontal" size="4" />
        </Flex>
      );
    };

    const copyToClipboard = (content: string) => {
      navigator.clipboard.writeText(content).then(
        () => {
          console.log("Content copied to clipboard");
        },
        (err) => {
          console.error("Could not copy text: ", err);
        },
      );
    };

    const downloadSingleChapterSummary = (title: string, content: string) => {
      const blob = new Blob([`## ${title}\n\n${content}`], {
        type: "text/markdown;charset=utf-8",
      });
      saveAs(blob, `${video.data?.videoId}_CHAPTER_${title}.md`);
    };

    const downloadSingleTopicSummary = (title: string, content: string) => {
      const blob = new Blob([`## ${title}\n\n${content}`], {
        type: "text/markdown;charset=utf-8",
      });
      saveAs(blob, `${video.data?.videoId}_TOPIC_${title}.md`);
    };

    const downloadChaptersSummary = () => {
      const blob = new Blob(
        [
          Object.entries(transcriptChaptersSummary!)
            .map(([title, content]) => `## ${title}\n\n${content}`)
            .join("\n\n"),
        ],
        { type: "text/markdown;charset=utf-8" },
      );
      saveAs(
        blob,
        `${video.data?.videoId}_ALL_CHAPTERS_${video.data!.title}.md`,
      );
    };

    const downloadTopicsSummary = () => {
      const blob = new Blob(
        [
          Object.entries(topicsSummary!)
            .map(([title, content]) => `## ${title}\n\n${content}`)
            .join("\n\n"),
        ],
        { type: "text/markdown;charset=utf-8" },
      );
      saveAs(blob, `${video.data?.videoId}_TOPICS_${video.data!.title}.md`);
    };

    // return (
    //   <Box p="3">
    //     <Container
    //       style={{
    //         background: "red",
    //       }}
    //     >
    //       <Flex gap="2" align="center">
    //         <Text size="1" color="gray">
    //           Go back to
    //         </Text>
    //         <Link href="/videoChannels" size="1">
    //           All Video Channels
    //         </Link>
    //         <Link href="/videos" size="1">
    //           All Videos
    //         </Link>
    //       </Flex>
    //       <Box>
    //         <Heading size="7" mb="3">
    //           {video.data?.title}
    //         </Heading>
    //       </Box>
    //     </Container>
    //   </Box>
    // );

    // size={{
    //   initial: "1",
    //   xs: "1",
    //   sm: "1",
    //   md: "1",
    //   lg: "1",
    //   xl: "1",
    // }}

    return (
      <Box p="3">
        <Container>
          <VideosBreadcrumbs />

          <Heading size="7" mb="3">
            {video.data?.title}
          </Heading>

          <Box maxWidth="440px" mb="7">
            <Card>
              <Flex gap="3" align="start">
                {/* <Link href={`/videoChannels/${video.data?.channel.id}`}>
                    <Avatar
                      size="3"
                      src={video.data?.channel.snippet.thumbnails?.default.url}
                      radius="full"
                      fallback={video.data!.channelTitle}
                    />
                  </Link> */}
                <Box>
                  <Link href={`/videoChannels/${video.data?.channel.id}`}>
                    <Text as="div" size="2" weight="bold">
                      {video.data?.channelTitle}
                    </Text>
                  </Link>
                  <Text as="div" size="1" color="gray">
                    {formatVideoStats(
                      video.data?.channel.statistics.subscriberCount,
                    )}{" "}
                    subscribers{" "}
                    {formatVideoStats(
                      video.data?.channel.statistics.videoCount,
                    )}{" "}
                    videos{" "}
                    {formatVideoStats(video.data?.channel.statistics.viewCount)}{" "}
                    views
                  </Text>
                </Box>
              </Flex>
            </Card>
          </Box>

          <Box>
            <YouTubePlayer
              videoId={video.data!.videoId}
              startSeconds={startSeconds}
            />
          </Box>

          <Flex mt="5" mb="5" gap="3">
            {transcriptChaptersSummary &&
              Object.keys(transcriptChaptersSummary).length > 0 && (
                <Button onClick={downloadChaptersSummary}>
                  <DownloadIcon /> All Chapters
                </Button>
              )}
            <Button onClick={downloadTopicsSummary}>
              <DownloadIcon /> All Topics
            </Button>
          </Flex>

          {transcriptChaptersSummary &&
            Object.keys(transcriptChaptersSummary).length > 0 && (
              <Flex direction="column" gap="3" width="100%">
                <Heading size="6" color="teal">
                  Chapters' Summary
                </Heading>
                {video.data?.transcriptChapters.map((chapter) =>
                  transcriptChaptersSummaryElement(
                    chapter.title,
                    chapter.start_time,
                  ),
                )}
              </Flex>
            )}

          <Flex direction="column" gap="3" width="100%" mt="5">
            <Heading size="6" color="teal">
              Topics
            </Heading>

            {topicsSummary && topicsSummaryElements}
          </Flex>

          <p>{video.data!.videoId}</p>
          <BtnGoToTop />
        </Container>
      </Box>
    );
  } catch (error) {
    console.error("Error connecting to the server:", error);
    return null;
  }
}
