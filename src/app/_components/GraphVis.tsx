"use client";

import { useState, useEffect, useMemo } from "react";
import type { CSSProperties, FC } from "react";
import { MultiDirectedGraph as MultiGraphConstructor } from "graphology";
import {
  SigmaContainer,
  ControlsContainer,
  ZoomControl,
  SearchControl,
  FullScreenControl,
  useLoadGraph,
  useRegisterEvents,
  useSigma,
} from "@react-sigma/core";

import {
  AiOutlineZoomIn,
  AiOutlineZoomOut,
  AiOutlineFullscreenExit,
  AiOutlineFullscreen,
  AiFillPlayCircle,
  AiFillPauseCircle,
} from "react-icons/ai";
import { MdFilterCenterFocus } from "react-icons/md";

import EdgeCurveProgram, {
  DEFAULT_EDGE_CURVATURE,
  indexParallelEdgesIndex,
} from "@sigma/edge-curve";

import { EdgeArrowProgram } from "sigma/rendering";
import { api } from "~/trpc/react";

import {
  LayoutForceAtlas2Control,
  useWorkerLayoutForceAtlas2,
} from "@react-sigma/layout-forceatlas2";

interface NodeType {
  x: number;
  y: number;
  label: string;
  size: number;
  color: string;
}

interface EdgeType {
  type?: string;
  label?: string;
  size?: number;
  curvature?: number;
  parallelIndex?: number;
  parallelMaxIndex?: number;
}

const ENTITY_COLORS = {
  CONSUMER: "#1f77b4",
  EXPERT: "#ff7f0e",
  PRODUCT: "#2ca02c",
  SERVICE: "#00950c",
  TASK: "#9467bd",
  MARKET: "#8c564b",
  PROBLEM: "#ff0000",
  SOLUTION: "#7f7f7f",
};

const GraphEvents: React.FC = () => {
  const registerEvents = useRegisterEvents();
  const sigma = useSigma();
  const [draggedNode, setDraggedNode] = useState<string | null>(null);

  useEffect(() => {
    // Register the events
    registerEvents({
      downNode: (e) => {
        setDraggedNode(e.node);
        sigma.getGraph().setNodeAttribute(e.node, "highlighted", true);
      },
      // On mouse move, if the drag mode is enabled, we change the position of the draggedNode
      mousemovebody: (e) => {
        if (!draggedNode) return;
        // Get new position of node
        const pos = sigma.viewportToGraph(e);
        sigma.getGraph().setNodeAttribute(draggedNode, "x", pos.x);
        sigma.getGraph().setNodeAttribute(draggedNode, "y", pos.y);

        // Prevent sigma to move camera:
        e.preventSigmaDefault();
        e.original.preventDefault();
        e.original.stopPropagation();
      },
      // On mouse up, we reset the autoscale and the dragging mode
      mouseup: () => {
        if (draggedNode) {
          setDraggedNode(null);
          sigma.getGraph().removeNodeAttribute(draggedNode, "highlighted");
        }
      },
      // Disable the autoscale at the first down interaction
      mousedown: () => {
        if (!sigma.getCustomBBox()) sigma.setCustomBBox(sigma.getBBox());
      },
    });
  }, [registerEvents, sigma, draggedNode]);

  return null;
};

interface GraphData {
  source: {
    nodeId: string;
    name: string;
    type: string;
  };
  target: {
    nodeId: string;
    name: string;
    type: string;
  };
  relation: string;
}

const MyGraph = ({ data }: { data: GraphData[] }) => {
  const loadGraph = useLoadGraph<NodeType, EdgeType>();

  useEffect(() => {
    if (data) {
      // Create the graph
      const graph = new MultiGraphConstructor<NodeType, EdgeType>();

      // Loop through the nodes and edges data to add them to the graph
      data.forEach((edgeData) => {
        const { source, target, relation } = edgeData;

        // Add source and target nodes if they don't already exist
        if (!graph.hasNode(source.nodeId)) {
          graph.addNode(source.nodeId, {
            label: source.name,
            size: 10, // Adjust size as necessary
            color: ENTITY_COLORS[source.type as keyof typeof ENTITY_COLORS],
            x: Math.random(), // Random placement, adjust as needed
            y: Math.random(),
          });
        }

        if (!graph.hasNode(target.nodeId)) {
          graph.addNode(target.nodeId, {
            label: target.name,
            size: 10,
            color: ENTITY_COLORS[target.type as keyof typeof ENTITY_COLORS],
            x: Math.random(),
            y: Math.random(),
          });
        }

        // Add edge between source and target
        graph.addEdge(source.nodeId, target.nodeId, {
          label: relation,
          size: 2,
          type: "curved", // Optional, set edge type
        });
      });

      // Use helper to identify parallel edges
      indexParallelEdgesIndex(graph, {
        edgeIndexAttribute: "parallelIndex",
        edgeMaxIndexAttribute: "parallelMaxIndex",
      });

      // Adapt edge curvature
      graph.forEachEdge((edge, { parallelIndex, parallelMaxIndex }) => {
        if (typeof parallelIndex === "number") {
          graph.mergeEdgeAttributes(edge, {
            type: "curved",
            curvature:
              DEFAULT_EDGE_CURVATURE +
              (3 * DEFAULT_EDGE_CURVATURE * parallelIndex) /
                (parallelMaxIndex ?? 1),
          });
        } else {
          graph.setEdgeAttribute(edge, "type", "straight");
        }
      });

      // Load the graph into Sigma
      loadGraph(graph);
    }
  }, [data, loadGraph]);

  return null;
};

const Fa2: FC = () => {
  const { start, kill, stop } = useWorkerLayoutForceAtlas2({
    settings: {
      slowDown: 100,
      gravity: 2,
    },
  });

  useEffect(() => {
    // start FA2
    start();
    // Kill FA2 on unmount
    return () => {
      kill();
    };
  }, [start, kill]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      stop();
    }, 3000);
    return () => {
      clearTimeout(timeoutId);
    };
  }, [stop]);

  return null;
};

const MultiDirectedGraph: React.FC<{
  style?: CSSProperties;
  videoId: string;
}> = ({ style, videoId }) => {
  const settings = useMemo(
    () => ({
      allowInvalidContainer: true,
      renderEdgeLabels: true,
      defaultEdgeType: "straight",
      edgeProgramClasses: {
        straight: EdgeArrowProgram,
        curved: EdgeCurveProgram,
      },
    }),
    [],
  );

  // Move the useQuery here
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data, isSuccess } = api.knowledgeGraph.getGraph.useQuery({
    videoId,
  });

  // If no data, return null
  if (!data || data.length === 0) {
    return null;
  }

  return (
    <SigmaContainer
      style={style}
      graph={MultiGraphConstructor}
      settings={settings}
    >
      <MyGraph data={data} />
      <GraphEvents />
      <Fa2 />
      <ControlsContainer position={"bottom-right"}>
        <ZoomControl
          labels={{ zoomIn: "PLUS", zoomOut: "MINUS", reset: "RESET" }}
        >
          <AiOutlineZoomIn />
          <AiOutlineZoomOut />
          <MdFilterCenterFocus />
        </ZoomControl>
        <FullScreenControl labels={{ enter: "ENTER", exit: "EXIT" }}>
          <AiOutlineFullscreen />
          <AiOutlineFullscreenExit />
        </FullScreenControl>
        <LayoutForceAtlas2Control
          labels={{ stop: "STOP", start: "START" }}
          autoRunFor={1000}
        >
          <AiFillPlayCircle />
          <AiFillPauseCircle />
        </LayoutForceAtlas2Control>
      </ControlsContainer>

      <ControlsContainer position={"top-right"}>
        <SearchControl style={{ width: "200px" }} />
      </ControlsContainer>
    </SigmaContainer>
  );
};

export default MultiDirectedGraph;

// "use client";

// import { useEffect, useMemo, useState } from "react";
// import type { CSSProperties, FC } from "react";
// import { MultiDirectedGraph as MultiGraphConstructor } from "graphology";
// import {
//   SigmaContainer,
//   ControlsContainer,
//   ZoomControl,
//   SearchControl,
//   FullScreenControl,
//   useLoadGraph,
//   useRegisterEvents,
//   useSigma,
// } from "@react-sigma/core";

// import {
//   AiOutlineZoomIn,
//   AiOutlineZoomOut,
//   AiOutlineFullscreenExit,
//   AiOutlineFullscreen,
//   AiFillPlayCircle,
//   AiFillPauseCircle,
// } from "react-icons/ai";
// import { MdFilterCenterFocus } from "react-icons/md";

// import EdgeCurveProgram, {
//   DEFAULT_EDGE_CURVATURE,
//   indexParallelEdgesIndex,
// } from "@sigma/edge-curve";

// import { EdgeArrowProgram } from "sigma/rendering";
// import { api } from "~/trpc/react";

// import {
//   LayoutForceAtlas2Control,
//   useWorkerLayoutForceAtlas2,
// } from "@react-sigma/layout-forceatlas2";

// interface NodeType {
//   x: number;
//   y: number;
//   label: string;
//   size: number;
//   color: string;
// }

// interface EdgeType {
//   type?: string;
//   label?: string;
//   size?: number;
//   curvature?: number;
//   parallelIndex?: number;
//   parallelMaxIndex?: number;
// }

// const ENTITY_COLORS = {
//   CONSUMER: "#1f77b4",
//   EXPERT: "#ff7f0e",
//   PRODUCT: "#2ca02c",
//   SERVICE: "#00950c",
//   TASK: "#9467bd",
//   MARKET: "#8c564b",
//   PROBLEM: "#ff0000",
//   SOLUTION: "#7f7f7f",
// };

// const GraphEvents: React.FC = () => {
//   const registerEvents = useRegisterEvents();
//   const sigma = useSigma();
//   const [draggedNode, setDraggedNode] = useState<string | null>(null);

//   useEffect(() => {
//     // Register the events
//     registerEvents({
//       downNode: (e) => {
//         setDraggedNode(e.node);
//         sigma.getGraph().setNodeAttribute(e.node, "highlighted", true);
//       },
//       // On mouse move, if the drag mode is enabled, we change the position of the draggedNode
//       mousemovebody: (e) => {
//         if (!draggedNode) return;
//         // Get new position of node
//         const pos = sigma.viewportToGraph(e);
//         sigma.getGraph().setNodeAttribute(draggedNode, "x", pos.x);
//         sigma.getGraph().setNodeAttribute(draggedNode, "y", pos.y);

//         // Prevent sigma to move camera:
//         e.preventSigmaDefault();
//         e.original.preventDefault();
//         e.original.stopPropagation();
//       },
//       // On mouse up, we reset the autoscale and the dragging mode
//       mouseup: () => {
//         if (draggedNode) {
//           setDraggedNode(null);
//           sigma.getGraph().removeNodeAttribute(draggedNode, "highlighted");
//         }
//       },
//       // Disable the autoscale at the first down interaction
//       mousedown: () => {
//         if (!sigma.getCustomBBox()) sigma.setCustomBBox(sigma.getBBox());
//       },
//     });
//   }, [registerEvents, sigma, draggedNode]);

//   return null;
// };

// const MyGraph = ({ videoId }: { videoId: string }) => {
//   const loadGraph = useLoadGraph<NodeType, EdgeType>();

//   // Fetch the graph data using tanstack query
//   const { data, isSuccess } = api.knowledgeGraph.getGraph.useQuery({
//     videoId,
//   });

//   useEffect(() => {
//     if (isSuccess && data) {
//       // Create the graph
//       const graph = new MultiGraphConstructor<NodeType, EdgeType>();

//       // Loop through the nodes and edges data to add them to the graph
//       data.forEach((edgeData) => {
//         const { source, target, relation } = edgeData;

//         // Add source and target nodes if they don't already exist
//         if (!graph.hasNode(source.nodeId)) {
//           graph.addNode(source.nodeId, {
//             label: source.name,
//             size: 10, // Adjust size as necessary
//             color: ENTITY_COLORS[source.type as keyof typeof ENTITY_COLORS],
//             x: Math.random(), // Random placement, adjust as needed
//             y: Math.random(),
//           });
//         }

//         if (!graph.hasNode(target.nodeId)) {
//           graph.addNode(target.nodeId, {
//             label: target.name,
//             size: 10,
//             color: ENTITY_COLORS[source.type as keyof typeof ENTITY_COLORS],
//             x: Math.random(),
//             y: Math.random(),
//           });
//         }

//         // Add edge between source and target
//         graph.addEdge(source.nodeId, target.nodeId, {
//           label: relation,
//           size: 2,
//           type: "curved", // Optional, set edge type
//         });
//       });

//       // Use helper to identify parallel edges
//       indexParallelEdgesIndex(graph, {
//         edgeIndexAttribute: "parallelIndex",
//         edgeMaxIndexAttribute: "parallelMaxIndex",
//       });

//       // Adapt edge curvature
//       graph.forEachEdge((edge, { parallelIndex, parallelMaxIndex }) => {
//         if (typeof parallelIndex === "number") {
//           graph.mergeEdgeAttributes(edge, {
//             type: "curved",
//             curvature:
//               DEFAULT_EDGE_CURVATURE +
//               (3 * DEFAULT_EDGE_CURVATURE * parallelIndex) /
//                 (parallelMaxIndex ?? 1),
//           });
//         } else {
//           graph.setEdgeAttribute(edge, "type", "straight");
//         }
//       });

//       // Load the graph into Sigma
//       loadGraph(graph);
//     }
//   }, [isSuccess, data, loadGraph]);

//   return null;
// };

// const Fa2: FC = () => {
//   const { start, kill, stop } = useWorkerLayoutForceAtlas2({
//     settings: {
//       slowDown: 100,
//       gravity: 2,
//       // linLogMode?: boolean;
//       // outboundAttractionDistribution?: boolean;
//       // adjustSizes?: boolean;
//       // edgeWeightInfluence?: number;
//       // scalingRatio?: number;
//       // strongGravityMode?: boolean;
//       // gravity?: number;
//       // slowDown?: number;
//       // barnesHutOptimize?: boolean;
//       // barnesHutTheta?: number;
//     },
//   });

//   useEffect(() => {
//     // start FA2
//     start();
//     // Kill FA2 on unmount
//     return () => {
//       kill();
//     };
//   }, [start, kill]);

//   useEffect(() => {
//     const timeoutId = setTimeout(() => {
//       stop();
//     }, 3000);
//     return () => {
//       clearTimeout(timeoutId);
//     };
//   }, [stop]);

//   return null;
// };

// const MultiDirectedGraph: React.FC<{
//   style?: CSSProperties;
//   videoId: string;
// }> = ({ style, videoId }) => {
//   const settings = useMemo(
//     () => ({
//       allowInvalidContainer: true,
//       renderEdgeLabels: true,
//       defaultEdgeType: "straight",
//       edgeProgramClasses: {
//         straight: EdgeArrowProgram,
//         curved: EdgeCurveProgram,
//       },
//     }),
//     [],
//   );

//   return (
//     <SigmaContainer
//       style={style}
//       graph={MultiGraphConstructor}
//       settings={settings}
//     >
//       <MyGraph videoId={videoId} />
//       {/* <ControlsContainer position={"bottom-right"}>
//         <ZoomControl />
//         <FullScreenControl />
//         <LayoutsControl />
//       </ControlsContainer> */}
//       <GraphEvents />
//       <Fa2 />
//       <ControlsContainer position={"bottom-right"}>
//         <ZoomControl
//           labels={{ zoomIn: "PLUS", zoomOut: "MINUS", reset: "RESET" }}
//         >
//           <AiOutlineZoomIn />
//           <AiOutlineZoomOut />
//           <MdFilterCenterFocus />
//         </ZoomControl>
//         <FullScreenControl labels={{ enter: "ENTER", exit: "EXIT" }}>
//           <AiOutlineFullscreen />
//           <AiOutlineFullscreenExit />
//         </FullScreenControl>
//         <LayoutForceAtlas2Control
//           labels={{ stop: "STOP", start: "START" }}
//           autoRunFor={1000}
//           // settings={{ settings: { slowDown: 10 } }}
//         >
//           <AiFillPlayCircle />
//           <AiFillPauseCircle />
//         </LayoutForceAtlas2Control>
//       </ControlsContainer>

//       <ControlsContainer position={"top-right"}>
//         <SearchControl style={{ width: "200px" }} />
//       </ControlsContainer>
//     </SigmaContainer>
//   );
// };

// export default MultiDirectedGraph;
