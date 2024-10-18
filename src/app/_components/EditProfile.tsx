"use client";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import useLocalStorage from "use-local-storage";

import {
  Button,
  Dialog,
  Flex,
  TextField,
  Text,
  Switch,
  HoverCard,
  Slider,
  Heading,
  Box,
  Avatar,
} from "@radix-ui/themes";
import { api } from "~/trpc/react";
import { type UserProps } from "./UserMenu";

import {
  QuestionMarkCircledIcon,
  LockClosedIcon,
  RocketIcon,
} from "@radix-ui/react-icons";

import { PiThermometerHot } from "react-icons/pi";

type EditProfileProps = {
  user: UserProps;
  editProfileOpen: boolean;
  setEditProfileOpen: Dispatch<SetStateAction<boolean>>;
};

const EditProfile = ({
  user,
  editProfileOpen,
  setEditProfileOpen,
}: EditProfileProps) => {
  const [name, setName] = useState(user.name ?? "");

  const [localOpenAIKey, setLocalOpenAIKey] = useLocalStorage<string>(
    "openAIKey",
    "",
  );
  const [localUseGPT4, setLocalUseGPT4] = useLocalStorage<boolean>(
    "useGPT4",
    false,
  );

  const [localOpenAITemperature, setOpenAILocalTemperature] =
    useLocalStorage<number>("openAITemperature", 0);

  const [canUseLocalKey, setCanUseLocalKey] = useLocalStorage<boolean>(
    "canUseLocalKey",
    false,
  );

  const updateProfile = api.user.updateProfile.useMutation({
    onSuccess: () => {
      console.log("success");
      setEditProfileOpen(false);
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateProfile.mutate({
      name,
      // openAIKey: localOpenAIKey,
      // useGPT4: localUseGPT4,
    });
  };

  useEffect(() => {
    if (localOpenAIKey.trim() !== "") {
      console.log("can use local key");
      setCanUseLocalKey(true);
    } else {
      setCanUseLocalKey(false);
    }
  }, [localOpenAIKey, localUseGPT4]);

  return (
    <Dialog.Root open={editProfileOpen}>
      <Dialog.Content style={{ maxWidth: 400 }}>
        <Dialog.Title>Edit Profile</Dialog.Title>
        {/* <Dialog.Description size="2" mb="4">
          Make changes to your profile.
        </Dialog.Description> */}

        <form name="ipasd" onSubmit={handleSubmit} autoComplete="open-ai-key">
          <Flex direction="column" gap="3">
            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                Name
              </Text>
              <TextField.Root
                name="flow name input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Update your name"
              />
            </label>
            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                Email
              </Text>
              <TextField.Root disabled name="email" value={user.email ?? ""} />
            </label>

            <label>
              <Flex gap="4" align="center" mb="1">
                <Text as="div" size="2" weight="bold">
                  OpenAI API Key
                </Text>

                <HoverCard.Root>
                  <HoverCard.Trigger>
                    <QuestionMarkCircledIcon />
                  </HoverCard.Trigger>
                  <HoverCard.Content maxWidth="440px">
                    <Flex gap="4">
                      <Avatar
                        variant="solid"
                        color="crimson"
                        size="2"
                        fallback={<LockClosedIcon />}
                        radius="full"
                      />
                      <Box>
                        <Heading size="3" as="h3">
                          Secure storage
                        </Heading>
                        <Text as="div" size="2">
                          Your OpenAI API key will be stored in your browser's
                          local storage. This means that your key will never be
                          sent to the server and it will be only accessible by
                          you.
                        </Text>
                        <Text as="div" size="2" mt="2">
                          The downside is, if you clear your browser's local
                          cache or use another browser, you will need to
                          re-enter your key.
                        </Text>
                      </Box>
                    </Flex>
                  </HoverCard.Content>
                </HoverCard.Root>
              </Flex>
              <TextField.Root
                name="openAIKey"
                type="password"
                autoComplete="open-ai-key"
                placeholder="sk-..."
                value={localOpenAIKey}
                onChange={(e) =>
                  setLocalOpenAIKey(e.target.value.replace(/\s/g, ""))
                }
              />
            </label>

            <Flex asChild justify="between" align="center">
              <label>
                <Flex gap="4" align="center" mb="1">
                  <Text as="div" size="2" weight="bold">
                    Use GPT-4o using my key
                  </Text>
                  <HoverCard.Root>
                    <HoverCard.Trigger>
                      <QuestionMarkCircledIcon />
                    </HoverCard.Trigger>
                    <HoverCard.Content maxWidth="440px">
                      <Flex gap="4">
                        <Avatar
                          variant="solid"
                          color="crimson"
                          size="2"
                          fallback={<RocketIcon />}
                          radius="full"
                        />
                        <Box>
                          <Heading size="3" as="h3">
                            Using GPT-4o
                          </Heading>
                          <Text as="div" size="2">
                            If you enable this, we will use GPT-4o for
                            generating content. Results will be much better than
                            GPT-3.5, which is the default.
                          </Text>
                        </Box>
                      </Flex>
                    </HoverCard.Content>
                  </HoverCard.Root>
                </Flex>
                <Switch
                  size="1"
                  defaultChecked={localUseGPT4}
                  onCheckedChange={(e) => setLocalUseGPT4(e)}
                  disabled={localOpenAIKey.trim() === ""}
                />
              </label>
            </Flex>
          </Flex>

          <label>
            <Flex gap="4" align="center" mt="3" mb="1">
              <Text as="div" size="2" weight="bold">
                Temperature
              </Text>

              <HoverCard.Root>
                <HoverCard.Trigger>
                  <QuestionMarkCircledIcon />
                </HoverCard.Trigger>
                <HoverCard.Content maxWidth="440px">
                  <Flex gap="4">
                    <Avatar
                      variant="solid"
                      size="2"
                      color="crimson"
                      fallback={<PiThermometerHot />}
                      radius="full"
                    />
                    <Box>
                      <Heading size="3" as="h3">
                        What is temperature?
                      </Heading>
                      <Text as="div" size="2">
                        Temperature is a parameter that controls the
                        “creativity” or randomness of the text generated by the
                        model. A higher temperature (e.g., 0.7) results in more
                        diverse and creative output, while a lower temperature
                        (e.g., 0.2) makes the output more deterministic and
                        focused.
                      </Text>
                      <Text as="div" size="2" mt="4">
                        In practice, temperature affects the probability
                        distribution over the possible tokens at each step of
                        the generation process. A temperature of 0 would make
                        the model completely deterministic, always choosing the
                        most likely token.
                      </Text>
                    </Box>
                  </Flex>
                </HoverCard.Content>
              </HoverCard.Root>
            </Flex>
            <Flex gap="4" align="center">
              <Slider
                disabled={localOpenAIKey.trim() === ""}
                defaultValue={[0]}
                max={70}
                value={[localOpenAITemperature]}
                onValueChange={(e) => {
                  setOpenAILocalTemperature(e[0]);
                }}
              />
              <Text>{localOpenAITemperature / 100}</Text>
            </Flex>
          </label>

          <Flex gap="3" mt="4" justify="end">
            <Dialog.Close>
              <Button
                variant="soft"
                color="gray"
                onClick={() => setEditProfileOpen(false)}
              >
                Cancel
              </Button>
            </Dialog.Close>
            <Dialog.Close>
              <Button
                type="submit"
                disabled={updateProfile.isPending || name.trim() === ""}
                variant="solid"
              >
                {updateProfile.isPending ? "Saving..." : "Save"}
              </Button>
            </Dialog.Close>
          </Flex>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default EditProfile;
