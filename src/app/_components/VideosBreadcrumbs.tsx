import Link from "next/link";
import {
  Grid,
  Text,
  Flex,
  Heading,
  Container,
  Link as Link2,
} from "@radix-ui/themes";

const VideosBreadcrumbs = () => {
  return (
    <Text size="1" color="blue">
      <Flex gap="2" align="center">
        <Text color="gray">Go back to</Text>
        <Link href="/videoChannels">All Video Channels</Link>
        <Link href="/">All Videos</Link>
      </Flex>
    </Text>
  );
};

export default VideosBreadcrumbs;
