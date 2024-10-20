"use client";
import styled from "@emotion/styled";
import { type ComponentProps, useRef, useEffect, useState } from "react";
import { TextArea } from "@radix-ui/themes";

type AdaptiveTextAreaProps = {
  lines?: number;
} & ComponentProps<typeof TextArea>;

const AdaptiveTextArea: React.FC<AdaptiveTextAreaProps> = (props) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { onChange, value, lines } = props;

  const [, setTextAreaValue] = useState(value);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [textareaRef, value]);

  const handleOnChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    setTextAreaValue(e.currentTarget.value);
    if (onChange) {
      onChange(e);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { onChange: throwAwayOnChange, ...rest } = props;

  return (
    <StyledTextArea
      ref={textareaRef}
      lines={lines}
      onChange={handleOnChange}
      {...rest}
      rows={1}
    />
  );
};

const StyledTextArea = styled(TextArea)<{ lines?: number }>`
  resize: none;
  width: 100%;
  overflow-y: hidden;
  height: auto;
  min-height: 38px; // Initial height for 1 line
  max-height: ${(props) => (props.lines ? props.lines * 24 : 192)}px;
  line-height: 24px;
`;

export default AdaptiveTextArea;
