import React, { useState, useEffect, useRef } from "react";

import type { ChangeEvent } from "react";

import {
  Flex,
  Heading,
  Card,
  ScrollArea,
  TextField,
  Box,
  Text,
} from "@radix-ui/themes";

import { MagnifyingGlassIcon } from "@radix-ui/react-icons";

interface AutocompleteProps {
  onSelect: (option: string) => void;
}

const Autocomplete: React.FC<AutocompleteProps> = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>("");
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInputValue(value);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      // This will only run after user stops typing
      console.log("User stopped typing. Call the function here.");
      if (value.trim() === "") {
        setIsOpen(false);
      } else {
        setIsOpen(true);
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
    if (inputValue.trim() !== "") {
      setIsOpen(true);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <Box ref={containerRef} style={{ position: "relative" }}>
      <TextField.Root
        placeholder="Search…"
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
          zIndex: 1,
          display: isOpen ? "block" : "none",
        }}
      >
        <ScrollArea type="always" scrollbars="vertical" style={{ height: 280 }}>
          <Box p="2" pr="8">
            <Heading size="4" mb="2" trim="start">
              Principles of the typographic craft
            </Heading>
            <Flex direction="column" gap="4">
              <Text as="p">
                Three fundamental aspects of typography are legibility,
                readability, and aesthetics. Although in a non-technical sense
                “legible” and “readable” are often used synonymously,
                typographically they are separate but related concepts.
              </Text>

              <Text as="p">
                Legibility describes how easily individual characters can be
                distinguished from one another. It is described by Walter Tracy
                as “the quality of being decipherable and recognisable”. For
                instance, if a “b” and an “h”, or a “3” and an “8”, are
                difficult to distinguish at small sizes, this is a problem of
                legibility.
              </Text>

              <Text as="p">
                Typographers are concerned with legibility insofar as it is
                their job to select the correct font to use. Brush Script is an
                example of a font containing many characters that might be
                difficult to distinguish. The selection of cases influences the
                legibility of typography because using only uppercase letters
                (all-caps) reduces legibility.
              </Text>
            </Flex>
          </Box>
        </ScrollArea>
      </Card>
    </Box>
  );
};

export default Autocomplete;
