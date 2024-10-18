"use client";
import { useState } from "react";
import { DropdownMenu, Button, Avatar } from "@radix-ui/themes";
import { ExitIcon } from "@radix-ui/react-icons";
import { signOut } from "next-auth/react";
import EditProfile from "./EditProfile";

export type UserProps = {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  openAIKey?: string | null;
  useGPT4?: boolean | null;
};

export default function UserMenu({ user }: { user: UserProps }) {
  const { image, name } = user;
  const fallbackName = name ? name[0] : "U";

  const [editProfileOpen, setEditProfileOpen] = useState(false);

  return (
    <>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <Button variant="ghost" radius="full">
            <Avatar
              title={name ?? ""}
              src={image ?? ""}
              fallback={<>{fallbackName}</>}
              size="1"
            />
          </Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Item
            onClick={() => setEditProfileOpen(!editProfileOpen)}
          >
            Edit Profile
          </DropdownMenu.Item>
          <DropdownMenu.Separator />

          <DropdownMenu.Item
            color="red"
            onClick={() => signOut({ callbackUrl: "/" })}
          >
            <ExitIcon />
            Sign out
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
      <EditProfile
        user={user}
        editProfileOpen={editProfileOpen}
        setEditProfileOpen={setEditProfileOpen}
      />
    </>
  );
}
