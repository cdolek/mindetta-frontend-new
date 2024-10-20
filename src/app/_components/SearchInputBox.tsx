import React, { useState, useEffect, useRef } from "react";
import type { ChangeEvent } from "react";
import { api } from "~/trpc/react";
import Link from "next/link";

import {
  Avatar,
  Badge,
  Flex,
  Card,
  ScrollArea,
  TextField,
  Box,
  Text,
} from "@radix-ui/themes";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import TimeAgo from "react-timeago";
import { set } from "zod";

const SearchInputBox: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>("");
  const [searchValue, setSearchValue] = useState<string>("");
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const dataResult = api.video.autoComplete.useQuery(
    { keyword: searchValue },
    {
      enabled: searchValue.trim() !== "",
    },
  );

  const data = dataResult.data;

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInputValue(value);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      // This will only run after user stops typing
      if (value.trim() !== "") {
        setSearchValue(value);
      }
    }, 500);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      containerRef.current &&
      !containerRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  const handleTextFieldClick = () => {
    if (inputValue.trim() !== "" && !dataResult.isPending) {
      setIsOpen(true);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (data) {
      if (data.length > 0) {
        setIsOpen(true);
      }
      console.log(data);
    }
  }, [data]);

  return (
    <Box ref={containerRef} style={{ position: "relative" }}>
      <TextField.Root
        placeholder="Search videos…"
        value={inputValue}
        onChange={handleInputChange}
        onClick={handleTextFieldClick}
      >
        <TextField.Slot>
          <MagnifyingGlassIcon height="16" width="16" />
        </TextField.Slot>
      </TextField.Root>

      <Card
        style={{
          position: "absolute",
          width: "100%",
          zIndex: 1,
          display: isOpen ? "block" : "none",
        }}
        size="1"
      >
        <ScrollArea
          type="always"
          scrollbars="vertical"
          style={{ maxHeight: 270 }}
        >
          <Box p="2">
            <Flex direction="column" gap="2">
              {Array.isArray(data) && data.length > 0
                ? data.map(
                    ({
                      title,
                      id,
                      thumbnail,
                      channelTitle,
                      viewCount,
                      publishedAt,
                    }) => (
                      // <Text as="p" size="3" truncate key={title} color="blue">
                      //   <Link href={`/videos/${id}`}>{title}</Link>
                      // </Text>

                      <Card key={id} variant="ghost">
                        <Link href={`/videos/${id}`}>
                          <Flex gap="3" align="center">
                            <Avatar
                              size={{ initial: "1", sm: "3" }}
                              fallback={title}
                              color="indigo"
                              src={thumbnail}
                            />
                            <Box>
                              <Text as="div" size="2" weight="bold" truncate>
                                {title}
                              </Text>
                              <Flex gap="2">
                                <Badge color="blue">{channelTitle}</Badge>
                                <Badge color="orange">
                                  {viewCount.toLocaleString()} views
                                </Badge>
                                <Badge color="gray">
                                  <TimeAgo date={publishedAt} />
                                </Badge>
                              </Flex>
                            </Box>
                          </Flex>
                        </Link>
                      </Card>
                    ),
                  )
                : !dataResult.isPending && (
                    <Text>
                      No results found for <strong>{inputValue}</strong>.
                    </Text>
                  )}
            </Flex>
          </Box>
        </ScrollArea>
      </Card>
    </Box>
  );
};

export default SearchInputBox;
