"use client";
import type { Video } from "@prisma/client";
import ErrorCallOut from "~/app/_components/ErrorCallOut";
// import { api } from "~/trpc/server";
import { api } from "~/trpc/react";

import { DownloadIcon } from "@radix-ui/react-icons";
import { TbClipboard } from "react-icons/tb";

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
  Grid,
  Avatar,
  Tabs,
} from "@radix-ui/themes";

import Link from "next/link";

import MarkdownRenderer from "~/app/_components/MarkdownRenderer";
import VideosBreadcrumbs from "~/app/_components/VideosBreadcrumbs";
import BtnGoToTop from "~/app/_components/BtnGoToTop";
import GraphVis from "~/app/_components/GraphVis";

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

    // Function to count bullet points in the given Markdown content
    const countBulletPoints = (markdown: string): number => {
      const bulletPointRegex = /^\s*[-*]\s+/gm;
      const matches = markdown.match(bulletPointRegex);
      return matches ? matches.length : 0;
    };

    // Calculate total insights count across all chapters
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const insightsCount = transcriptChaptersSummary
      ? Object.values(transcriptChaptersSummary).reduce(
          // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-argument
          (total, content) => total + countBulletPoints(content),
          0,
        )
      : 0;

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
                    onClick={() => copyToClipboard(`# ${title}\n\n${content}`)}
                  >
                    <TbClipboard />
                  </Button>

                  <Button
                    variant="ghost"
                    onClick={() => downloadSingleTopicSummary(title, content)}
                  >
                    <DownloadIcon />
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
                onClick={() => copyToClipboard(`# ${title}\n\n${content}`)}
              >
                <TbClipboard />
              </Button>
              <Button
                // size="2"
                variant="ghost"
                onClick={() => downloadSingleChapterSummary(title, content)}
              >
                <DownloadIcon />
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

    const copyAllChaptersToClipboard = () => {
      const content = Object.entries(transcriptChaptersSummary!)
        .map(([title, content]) => `# ${title}\n\n${content}`)
        .join("\n\n");
      copyToClipboard(content);
    };

    const copyAllTopicsToClipboard = () => {
      const content = Object.entries(topicsSummary!)
        .map(([title, content]) => `# ${title}\n\n${content}`)
        .join("\n\n");
      copyToClipboard(content);
    };

    const downloadSingleChapterSummary = (title: string, content: string) => {
      const blob = new Blob([`# ${title}\n\n${content}`], {
        type: "text/markdown;charset=utf-8",
      });
      saveAs(blob, `${video.data?.videoId}_CHAPTER_${title}.md`);
    };

    const downloadSingleTopicSummary = (title: string, content: string) => {
      const blob = new Blob([`# ${title}\n\n${content}`], {
        type: "text/markdown;charset=utf-8",
      });
      saveAs(blob, `${video.data?.videoId}_TOPIC_${title}.md`);
    };

    const downloadChaptersSummary = () => {
      const blob = new Blob(
        [
          Object.entries(transcriptChaptersSummary!)
            .map(([title, content]) => `# ${title}\n\n${content}`)
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
            .map(([title, content]) => `# ${title}\n\n${content}`)
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

          <Box mb="3" mt="3">
            <Card>
              <Flex gap="3" align="start">
                <Link href={`/videoChannels/${video.data?.channel.id}`}>
                  <Avatar
                    size="3"
                    src={video.data?.channel.snippet.thumbnails?.default.url}
                    radius="full"
                    fallback={video.data!.channelTitle}
                  />
                </Link>
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
                <Box ml="5">
                  <Text as="div" size="2">
                    Published: {video.data?.publishedAt.toDateString()}
                  </Text>
                </Box>
                <Box ml="5">
                  <Text as="div" size="2">
                    Chapters: {video.data?.transcriptChapters.length}
                  </Text>
                </Box>
                <Box ml="5">
                  <Text as="div" size="2">
                    Topics:{" "}
                    {topicsSummary ? Object.keys(topicsSummary).length : 0}
                  </Text>
                </Box>
                <Box ml="5">
                  <Text as="div" size="2">
                    Insights: {insightsCount}
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

          <Grid
            columns={{
              initial: "2",
              xs: "2",
              sm: "2",
              md: "5",
            }}
            gap="3"
            p="3"
            width="auto"
            justify="between"
          >
            {transcriptChaptersSummary &&
              Object.keys(transcriptChaptersSummary).length > 0 && (
                <>
                  <Button onClick={copyAllChaptersToClipboard}>
                    <TbClipboard /> All Chapters
                  </Button>

                  <Button onClick={downloadChaptersSummary} variant="soft">
                    <DownloadIcon /> All Chapters
                  </Button>
                </>
              )}
            {topicsSummary && Object.keys(topicsSummary).length > 0 && (
              <>
                <Button onClick={copyAllTopicsToClipboard}>
                  <TbClipboard /> All Topics
                </Button>
                <Button onClick={downloadTopicsSummary} variant="soft">
                  <DownloadIcon /> All Topics
                </Button>
              </>
            )}
          </Grid>

          {transcriptChaptersSummary || topicsSummary ? (
            <Tabs.Root defaultValue="chapters">
              <Tabs.List>
                <Tabs.Trigger value="chapters">Chapters</Tabs.Trigger>
                {topicsSummary && (
                  <Tabs.Trigger value="topics">Topics</Tabs.Trigger>
                )}
                <Tabs.Trigger value="graph">Graph Visualization</Tabs.Trigger>
              </Tabs.List>

              <Box pt="3">
                <Tabs.Content value="chapters">
                  {transcriptChaptersSummary &&
                    Object.keys(transcriptChaptersSummary).length > 0 && (
                      <Flex direction="column" gap="3" width="100%">
                        <Heading size="6" color="teal">
                          Chapters
                        </Heading>
                        {video.data?.transcriptChapters.map((chapter) =>
                          transcriptChaptersSummaryElement(
                            chapter.title,
                            chapter.start_time,
                          ),
                        )}
                      </Flex>
                    )}
                </Tabs.Content>

                <Tabs.Content value="topics">
                  <Flex direction="column" gap="3" width="100%">
                    <Heading size="6" color="teal">
                      Topics
                    </Heading>
                    {topicsSummary && topicsSummaryElements}
                  </Flex>
                </Tabs.Content>
                <Tabs.Content value="graph">
                  <GraphVis
                    style={{ width: "100%", height: 540 }}
                    videoId={video.data!.videoId}
                  />
                </Tabs.Content>
              </Box>
            </Tabs.Root>
          ) : (
            <Text>Processing, please wait...</Text>
          )}

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
