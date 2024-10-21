/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import React, { useEffect, useMemo, useState } from "react";
import { FaProjectDiagram } from "react-icons/fa";

import { animateNodes } from "sigma/utils";

import { useSigma } from "@react-sigma/core";
import { WorkerLayoutControl } from "@react-sigma/layout-core";
import { useLayoutCircular } from "@react-sigma/layout-circular";
import { useLayoutCirclepack } from "@react-sigma/layout-circlepack";
import { useLayoutRandom } from "@react-sigma/layout-random";
import {
  useLayoutNoverlap,
  useWorkerLayoutNoverlap,
} from "@react-sigma/layout-noverlap";
import {
  useLayoutForce,
  useWorkerLayoutForce,
} from "@react-sigma/layout-force";
import {
  useLayoutForceAtlas2,
  useWorkerLayoutForceAtlas2,
} from "@react-sigma/layout-forceatlas2";

export const LayoutsControl: React.FC = () => {
  const sigma = useSigma();
  const [layout, setLayout] = useState<string>("circular");
  const [opened, setOpened] = useState<boolean>(false);
  const layoutCircular = useLayoutCircular();
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const layoutCirclepack = useLayoutCirclepack();
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const layoutRandom = useLayoutRandom();
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const layoutNoverlap = useLayoutNoverlap();
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const layoutForce = useLayoutForce({ maxIterations: 100 });
  const layoutForceAtlas2 = useLayoutForceAtlas2({ iterations: 100 });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const layouts: Record<string, { layout: any; worker?: any }> = useMemo(() => {
    return {
      circular: {
        layout: layoutCircular,
      },
      circlepack: {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        layout: layoutCirclepack,
      },
      random: {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        layout: layoutRandom,
      },
      noverlaps: {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        layout: layoutNoverlap,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        worker: useWorkerLayoutNoverlap,
      },
      forceDirected: {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        layout: layoutForce,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        worker: useWorkerLayoutForce,
      },
      forceAtlas: {
        layout: layoutForceAtlas2,
        worker: useWorkerLayoutForceAtlas2,
      },
    };
  }, []);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const layoutConfig = layouts[layout];
    if (layoutConfig?.layout) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const { positions } = layoutConfig.layout;
      animateNodes(sigma.getGraph(), positions(), { duration: 1000 });
    }
  }, [layout, layouts, sigma]);

  useEffect(() => {
    const close = () => {
      setOpened(false);
    };
    if (opened === true) {
      setTimeout(() => document.addEventListener("click", close), 0);
    }
    return () => document.removeEventListener("click", close);
  }, [opened]);

  return (
    <>
      <div>
        {layouts[layout]?.worker && (
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          <WorkerLayoutControl layout={layouts[layout].worker} settings={{}} />
        )}
      </div>
      <div>
        <div className="react-sigma-control">
          <button onClick={() => setOpened((e: boolean) => !e)}>
            <FaProjectDiagram />
          </button>
          {opened === true && (
            <ul
              style={{
                position: "absolute",
                bottom: 0,
                right: "35px",
                backgroundColor: "#e7e9ed",
                margin: 0,
                padding: 0,
                listStyle: "none",
              }}
            >
              {Object.keys(layouts).map((name) => {
                return (
                  <li key={name}>
                    <button
                      className="btn btn-link"
                      style={{
                        fontWeight: layout === name ? "bold" : "normal",
                        width: "100%",
                      }}
                      onClick={() => {
                        setLayout(name);
                      }}
                    >
                      {name}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </>
  );
};
