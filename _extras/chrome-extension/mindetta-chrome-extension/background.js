chrome.action.onClicked.addListener((tab) => {
  let notificationId = `mindetta-video-${Date.now()}`;
  if (tab.url?.includes("youtube.com/watch")) {
    const url = new URL(tab.url);
    const videoId = url.searchParams.get("v");
    if (videoId) {
      fetch("http://178.128.150.234:8000/api/v1/insert", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ videoId }),
      })
        .then((response) => {
          if (response.ok) {
            console.log("API Triggered Successfully");
            void chrome.notifications.create(notificationId, {
              type: "basic",
              iconUrl: "open-mind.png",
              title: "Video Queued",
              message: `Video ID: ${videoId} is in the queue!`,
            });
          } else {
            console.error("Failed to trigger API");
            throw new Error("Failed to trigger API");
          }
        })
        .catch((error) => {
          console.error("Error: " + error);
          void chrome.notifications.create(notificationId, {
            type: "basic",
            iconUrl: "open-mind.png",
            title: "Error",
            message: "Failed to queue the video. Please try again.",
          });
        });
    } else {
      console.error("Unable to determine video ID");
      void chrome.notifications.create(notificationId, {
        type: "basic",
        iconUrl: "open-mind.png",
        title: "Error",
        message: "Unable to determine video ID.",
      });
    }
  } else {
    console.error("This is not a YouTube video page");
    void chrome.notifications.create(notificationId, {
      type: "basic",
      iconUrl: "open-mind.png",
      title: "Error",
      message: "This is not a YouTube video page.",
    });
  }
});
