import React from "react";
import YouTube, { YouTubeProps } from "react-youtube";

const YouTubePlayer = ({
  videoId,
  startSeconds,
}: {
  videoId: string; // Changed String to string (JS primitive type)
  startSeconds?: number;
}) => {
  const opts: YouTubeProps["opts"] = {
    // height: "360",
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: startSeconds ? 1 : 0,
      start: startSeconds,
    },
  };

  const onPlayerReady: YouTubeProps["onReady"] = (event) => {
    const { width, height } = event.target.getSize();
    event.target.setSize(width, (width / 16) * 9);
    console.log("width", width);
  };

  return <YouTube videoId={videoId} opts={opts} onReady={onPlayerReady} />;
};

export default YouTubePlayer;
