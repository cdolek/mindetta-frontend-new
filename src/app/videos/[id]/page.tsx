"use client";
import type { Video } from "@prisma/client";
import ErrorCallOut from "~/app/_components/ErrorCallOut";
// import { api } from "~/trpc/server";
import { api } from "~/trpc/react";
import TimeAgo from "react-timeago";

import { DownloadIcon } from "@radix-ui/react-icons";
import { TbClipboard } from "react-icons/tb";

import { useState } from "react";

import YouTubePlayer from "~/app/_components/YouTubePlayer";

import { formatVideoStats, formatVideoSecondsToTime } from "~/libs/utils";

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
  DataList,
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

    return (
      <Box p="3">
        <Container>
          <VideosBreadcrumbs />

          <Heading size="7" mb="3">
            {video.data?.title}
          </Heading>

          <Flex
            gap={{
              initial: "3",
              xs: "3",
              sm: "3",
              md: "6",
              lg: "9",
              xl: "9",
            }}
          >
            <Box>
              <YouTubePlayer
                videoId={video.data!.videoId}
                startSeconds={startSeconds}
              />
            </Box>

            <DataList.Root
              orientation={{ initial: "vertical", sm: "horizontal" }}
            >
              <DataList.Item>
                <DataList.Label color="gray" minWidth="120px">
                  Channel
                </DataList.Label>
                <DataList.Value>
                  <Text color="blue">
                    <Link href={`/videoChannels/${video.data?.channel.id}`}>
                      {video.data?.channelTitle}
                    </Link>
                  </Text>
                </DataList.Value>
              </DataList.Item>
              <DataList.Item>
                <DataList.Label color="gray" minWidth="120px">
                  Channel Stats
                </DataList.Label>
                <DataList.Value>
                  {formatVideoStats(
                    video.data?.channel.statistics.subscriberCount,
                  )}{" "}
                  subscribers,{" "}
                  {formatVideoStats(video.data?.channel.statistics.videoCount)}{" "}
                  videos,{" "}
                  {formatVideoStats(video.data?.channel.statistics.viewCount)}{" "}
                  views
                </DataList.Value>
              </DataList.Item>
              <DataList.Item>
                <DataList.Label color="gray" minWidth="120px">
                  Published
                </DataList.Label>
                <DataList.Value>
                  {video.data?.publishedAt.toDateString()}, (
                  {video.data?.publishedAt && (
                    <TimeAgo date={video.data.publishedAt.toDateString()} />
                  )}
                  )
                </DataList.Value>
              </DataList.Item>
              <DataList.Item>
                <DataList.Label color="gray" minWidth="120px">
                  Stats
                </DataList.Label>
                <DataList.Value>
                  {video.data?.transcriptChapters.length} chapters,{" "}
                  {topicsSummary ? Object.keys(topicsSummary).length : 0}{" "}
                  topics, {insightsCount} insights
                </DataList.Value>
              </DataList.Item>
            </DataList.Root>
          </Flex>

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
                <Tabs.Trigger value="graph">Network Visualization</Tabs.Trigger>
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
                  <Flex direction="column" gap="3" width="100%">
                    <Heading size="6" color="teal">
                      Network Visualization
                    </Heading>
                    <Text size="2" color="gray">
                      Below is a network visualization that was generated via
                      analyzing the transcipt of the{" "}
                      {formatVideoSecondsToTime(
                        video.data?.metadata?.duration ?? 0,
                      )}{" "}
                      long video titled "{video.data?.title}" by{" "}
                      {video.data?.channelTitle}, which got{" "}
                      {formatVideoStats(video.data?.metadata?.view_count)}{" "}
                      views.{" "}
                    </Text>
                    <Box pt="3" pb="5">
                      <Flex gap="3">
                        <GraphVis
                          style={{ width: "100%", height: 640 }}
                          videoId={video.data!.videoId}
                        />
                      </Flex>
                    </Box>
                  </Flex>
                </Tabs.Content>
              </Box>
            </Tabs.Root>
          ) : (
            <Text>Processing, please wait...</Text>
          )}
          <Box>
            <Text>{video.data!.videoId}</Text>
          </Box>
          <BtnGoToTop />
        </Container>
      </Box>
    );
  } catch (error) {
    console.error("Error connecting to the server:", error);
    return null;
  }
}
