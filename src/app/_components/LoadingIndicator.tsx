"use client";
import { useRef, useEffect, CSSProperties } from "react";
import LoadingBar, { type LoadingBarRef } from "react-top-loading-bar";
import useMindettaStore from "~/_stores/store";

const LoadingIndicator = (containerStyle?: CSSProperties) => {
  const ref = useRef<LoadingBarRef>(null);

  const appLoadingState = useMindettaStore((state) => state.appLoadingState);

  useEffect(() => {
    if (ref.current) {
      if (appLoadingState === "loading") {
        ref.current.continuousStart();
      }
      if (appLoadingState === "loaded") {
        ref.current.complete();
      }
    }
  }, [appLoadingState]);

  return (
    <LoadingBar
      height={4}
      color="#6666FF"
      ref={ref}
      className="progress-bar"
      containerClassName="progress-bar-container"
      containerStyle={{
        position: "fixed",
        top: 0,
        ...containerStyle,
      }}
    />
  );
};

export default LoadingIndicator;
