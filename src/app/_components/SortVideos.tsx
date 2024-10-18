"use client";

import { Flex, Select } from "@radix-ui/themes";
import { use } from "react";

import useMindettaStore from "~/_stores/store";

const SortVideos = () => {
  const setVideosSortBy = useMindettaStore((state) => state.setVideosSortBy);
  const setVideosSortOrder = useMindettaStore(
    (state) => state.setVideosSortOrder,
  );
  const setVideosSortCount = useMindettaStore(
    (state) => state.setVideosSortCount,
  );
  const videosSortBy = useMindettaStore((state) => state.videosSortBy);
  const videosSortOrder = useMindettaStore((state) => state.videosSortOrder);
  const videosSortCount = useMindettaStore((state) => state.videosSortCount);

  return (
    <Flex justify="end" p="3" gap="1">
      <Select.Root
        defaultValue={videosSortBy}
        onValueChange={(v: typeof videosSortBy) => setVideosSortBy(v)}
      >
        <Select.Trigger />
        <Select.Content>
          <Select.Group>
            <Select.Label>Sort by</Select.Label>
            <Select.Item value="published">Published</Select.Item>
            <Select.Item value="processed">Processed</Select.Item>
          </Select.Group>
        </Select.Content>
      </Select.Root>
      <Select.Root
        defaultValue={videosSortOrder}
        onValueChange={(v: typeof videosSortOrder) => setVideosSortOrder(v)}
      >
        <Select.Trigger />
        <Select.Content>
          <Select.Group>
            <Select.Label>Sort Order</Select.Label>
            <Select.Item value="desc">DESC</Select.Item>
            <Select.Item value="asc">ASC</Select.Item>
          </Select.Group>
        </Select.Content>
      </Select.Root>

      <Select.Root
        defaultValue={videosSortCount}
        onValueChange={(v: typeof videosSortCount) => setVideosSortCount(v)}
      >
        <Select.Trigger />
        <Select.Content>
          <Select.Group>
            <Select.Label>Count</Select.Label>
            <Select.Item value="15">25</Select.Item>
            <Select.Item value="25">25</Select.Item>
            <Select.Item value="50">50</Select.Item>
            <Select.Item value="75">75</Select.Item>
            <Select.Item value="100">100</Select.Item>
            <Select.Item value="200">200</Select.Item>
          </Select.Group>
        </Select.Content>
      </Select.Root>
    </Flex>
  );
};

export default SortVideos;
