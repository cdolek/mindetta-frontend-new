/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { useRef } from "react";
import YouTube from "react-youtube";
import type { YouTubeProps } from "react-youtube";

const YouTubePlayer = ({
  videoId,
  startSeconds,
}: {
  videoId: string; // Changed String to string (JS primitive type)
  startSeconds?: number;
}) => {
  const hasTriggered = useRef(false);

  const opts: YouTubeProps["opts"] = {
    // height: "1",
    // height: "360",
    height: (200 / 16) * 9,
    width: 200,
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: startSeconds ? 1 : 0,
      start: startSeconds,
    },
  };

  const onPlayerReady: YouTubeProps["onReady"] = (event) => {
    // if (hasTriggered.current) return;
    const {
      width,
      // height
    } = event.target.getSize() as unknown as {
      width: number;
      height: number;
    };
    const target = event.target;
    // console.log("width", width, "height", height);
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    target.setSize(width, (width / 16) * 9);
    hasTriggered.current = true;
  };

  // const onStateChange: YouTubeProps["onStateChange"] = (event) => {
  //   console.log("state", event.data);
  // };

  return (
    <YouTube
      // id={videoId}
      // className="full-width"
      videoId={videoId}
      opts={opts}
      // onReady={onPlayerReady}
      // onStateChange={onStateChange}
    />
  );
};

export default YouTubePlayer;
