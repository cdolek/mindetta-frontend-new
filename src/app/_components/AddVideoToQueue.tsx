"use client";
import { useState } from "react";
import { BiSolidVideoPlus } from "react-icons/bi";

import { Button, Dialog, Flex, TextField } from "@radix-ui/themes";
import { api } from "~/trpc/react";
import type { Session } from "next-auth";

const AddVideoToQueue = ({ session }: { session?: Session | null }) => {
  const [videoInput, setVideoInput] = useState("");
  const utils = api.useUtils();

  const addNewVideo = api.video.newVideo.useMutation({
    onSuccess: async () => {
      console.log("success");
      await utils.video.getAll.invalidate();
    },
  });

  const extractVideoId = (urlOrId: string): string | null => {
    // Regular expression to match a YouTube video URL and extract the video ID
    const urlPattern =
      /(?:youtube\.com\/(?:[^\/]+\/.*\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = urlPattern.exec(urlOrId);

    if (match) {
      return match[1] ?? null; // Extracted video ID or null if undefined
    }

    // Assume it's a video ID if it's 11 characters long
    if (urlOrId.length === 11) {
      return urlOrId;
    }

    return null; // Invalid URL or ID
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const videoId = extractVideoId(videoInput);
    if (!videoId) {
      alert("Please provide a valid YouTube link or video ID");
      return;
    }

    addNewVideo.mutate({
      videoId,
      userId: session!.user.id || "",
    });
  };

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <Button variant="soft">
          <BiSolidVideoPlus />
        </Button>
      </Dialog.Trigger>

      <Dialog.Content style={{ maxWidth: 400 }}>
        <Dialog.Title>Add a Video to Process Queue</Dialog.Title>
        <Dialog.Description size="2" mb="4">
          It will be ready within a few minutes.
        </Dialog.Description>

        <form onSubmit={handleSubmit}>
          <Flex direction="column" gap="3">
            <TextField.Root
              placeholder="YouTube link or video ID"
              value={videoInput}
              onChange={(e) => setVideoInput(e.target.value)}
            />
          </Flex>
          <Flex gap="3" mt="4" justify="end">
            <Dialog.Close>
              <Button variant="soft" color="gray">
                Cancel
              </Button>
            </Dialog.Close>
            <Dialog.Close>
              <Button
                type="submit"
                variant="solid"
                disabled={videoInput.trim() === ""}
              >
                Save
              </Button>
            </Dialog.Close>
          </Flex>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default AddVideoToQueue;

// "use client";
// import { useState } from "react";

// import { Button, Dialog, Flex, TextField } from "@radix-ui/themes";
// // import { api } from "~/trpc/react";

// const AddVideoToQueue = () => {
//   const [name, setName] = useState("");
//   const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//   };

//   return (
//     <Dialog.Root>
//       <Dialog.Trigger>
//         <Button variant="soft">Add a Video to Process Queue</Button>
//       </Dialog.Trigger>

//       <Dialog.Content style={{ maxWidth: 400 }}>
//         <Dialog.Title>Add a Video to Process Queue</Dialog.Title>
//         <Dialog.Description size="2" mb="4">
//           It will be ready within a few minutes.
//         </Dialog.Description>

//         <form onSubmit={handleSubmit}>
//           <Flex direction="column" gap="3">
//             <TextField.Root
//               placeholder="YouToube link or video ID"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//             ></TextField.Root>
//           </Flex>
//           <Flex gap="3" mt="4" justify="end">
//             <Dialog.Close>
//               <Button variant="soft" color="gray">
//                 Cancel
//               </Button>
//             </Dialog.Close>
//             <Dialog.Close>
//               <Button
//                 type="submit"
//                 // disabled={createFlow.isLoading || name.trim() === ""}
//                 variant="solid"
//               >
//                 Save
//                 {/* {createFlow.isLoading ? "Saving..." : "Save"} */}
//               </Button>
//             </Dialog.Close>
//           </Flex>
//         </form>
//       </Dialog.Content>
//     </Dialog.Root>
//   );
// };

// export default AddVideoToQueue;
