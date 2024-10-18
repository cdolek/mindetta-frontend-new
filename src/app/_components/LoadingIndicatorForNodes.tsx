"use client";
import {
  useRef,
  useEffect,
  useState,
  CSSProperties,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from "react";
import * as Progress from "@radix-ui/react-progress";
import useInterval from "~/hooks/useInterval";
import { randomValue } from "~/libs/utils";

import styled from "@emotion/styled";

export type LoadingIndicatorForNodesProps = {
  containerStyle?: React.CSSProperties;
  done?: boolean;
};

export type LoadingIndicatorForNodesRef = {
  startLoading: () => void;
  completeLoading: () => void;
};

const LoadingIndicatorForNodes = forwardRef<
  LoadingIndicatorForNodesRef,
  LoadingIndicatorForNodesProps
>(({ containerStyle }, ref) => {
  const [progress, setProgress] = useState(0);

  const loading = useRef({ active: true, refreshRate: 3000 });

  useImperativeHandle(ref, () => ({
    startLoading: () => {
      // Implement startLoading logic here
      setProgress(0);
      loading.current.active = true;
    },
    completeLoading: () => {
      setProgress(100);
      loading.current.active = false;
    },
  }));

  useInterval(
    () => {
      const minValue = Math.min(5, (100 - progress) / 5);
      const maxValue = Math.min(20, (100 - progress) / 3);

      const random = randomValue(minValue, maxValue);
      // console.log(
      //   "random",
      //   random,
      //   "progress",
      //   progress,
      //   "progress + random",
      //   progress + random,
      // );
      if (progress + random < 80) {
        setProgress(progress + random);
        // checkIfFull(progress + random);
      }
    },
    loading.current.active ? loading.current.refreshRate : null,
  );

  // useEffect(() => {
  //   if (progress === 100) {
  //     const timeout = setTimeout(() => setProgress(0), 2000); // Wait for 2 seconds
  //     return () => clearTimeout(timeout);
  //   }
  // }, [progress]);

  return (
    <StyledProgressRoot
      className="ProgressRoot"
      value={progress}
      style={containerStyle}
      progress={progress}
    >
      {/* <StyledProgressIndicator
        className="ProgressIndicator"
        style={{ transform: `translateX(-${100 - progress}%)` }}
      /> */}
    </StyledProgressRoot>
  );
});

const StyledProgressRoot = styled(Progress.Root)<{ progress: number }>`
  position: absolute;
  top: 0;
  overflow: hidden;
  /* background: var(--black-a8); */
  border-radius: 12px;
  width: 100%;
  /* height: 44px; */
  height: 100%;
  pointer-events: none;
  /* Fix overflow clipping in Safari */
  /* https://gist.github.com/domske/b66047671c780a238b51c51ffde8d3a0 */
  transform: translateZ(0);
  /* background: "linear-gradient(to right, #0000ff 0%,#0000ff " +
    ${({ progress }) => progress} + "%,#ff0000 " + ${({ progress }) =>
    progress} +
    "%,#ff0000 100%)"; */
`;

const StyledProgressIndicator = styled(Progress.Indicator)`
  background-color: var(--color-panel-solid);
  width: 100%;
  height: 100%;
  transition: transform 1960ms cubic-bezier(0.65, 0, 0.35, 1);
`;

export default LoadingIndicatorForNodes;
