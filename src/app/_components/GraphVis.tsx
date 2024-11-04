"use client";

import { useState, useEffect, useMemo } from "react";
import type { CSSProperties } from "react";
import type { Attributes } from "graphology-types";
import type { SigmaContainerProps } from "@react-sigma/core";
import { IconButton, Text, Flex } from "@radix-ui/themes";

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

import { LayoutForceAtlas2Control } from "@react-sigma/layout-forceatlas2";

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

const ENTITY_COLORS = {
  CONSUMER: "#1f77b4", // Blue
  EXPERT: "#ffbc42", // Warm Yellow
  PRODUCT: "#2ca02c", // Green
  SERVICE: "#17becf", // Cyan
  TASK: "#9467bd", // Purple
  MARKET: "#8c564b", // Brown
  PROBLEM: "#d62728", // Intense Red - to draw attention
  SOLUTION: "#2a9d8f", // Teal Green - contrasting but harmonious with other colors
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
          sigma.getGraph().removeNodeAttribute(draggedNode, "highlighted");
          setDraggedNode(null);
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
    title: string;
    type: string;
  };
  target: {
    nodeId: string;
    title: string;
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
            label: source.title,
            size: 5, // Initial size, will be updated later
            color: ENTITY_COLORS[source.type as keyof typeof ENTITY_COLORS],
            x: Math.random(), // Random placement, adjust as needed
            y: Math.random(),
          });
        }

        if (!graph.hasNode(target.nodeId)) {
          graph.addNode(target.nodeId, {
            label: target.title,
            size: 5,
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
      graph.forEachEdge((edge, attributes) => {
        const { parallelIndex, parallelMaxIndex } = attributes;
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

      // Calculate degrees and set node sizes
      let maxDegree = 0;
      graph.forEachNode((node) => {
        const degree = graph.degree(node);
        if (degree > maxDegree) {
          maxDegree = degree;
        }
      });

      const minSize = 4;
      const maxSize = 20;

      graph.forEachNode((node) => {
        const degree = graph.degree(node);

        // Normalize degree to a value between minSize and maxSize
        const size = minSize + (degree / maxDegree) * (maxSize - minSize);

        graph.setNodeAttribute(node, "size", size);

        console.log("node", node, "degree", degree, "size", size);
      });

      // Load the graph into Sigma
      loadGraph(graph);
    }
  }, [data, loadGraph]);

  return null;
};

const MultiDirectedGraph: React.FC<{
  style?: CSSProperties;
  videoId: string;
}> = ({ style, videoId }) => {
  const settings = useMemo(
    () =>
      ({
        renderEdgeLabels: true,
        defaultEdgeType: "straight",
        edgeProgramClasses: {
          straight: EdgeArrowProgram,
          curved: EdgeCurveProgram,
        },
        autoRescale: true,
        autoCenter: true,
      }) as SigmaContainerProps<Attributes, Attributes, Attributes>["settings"],
    [],
  );

  // Fetch the graph data using your API
  const { data } = api.knowledgeGraph.getGraph.useQuery({
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
      <ControlsContainer
        position={"bottom-right"}
        className="graphControlsContainer"
      >
        <ZoomControl
          labels={{ zoomIn: "Zoom In", zoomOut: "Zoom Out", reset: "Reset" }}
        >
          <AiOutlineZoomIn />
          <AiOutlineZoomOut />
          <MdFilterCenterFocus />
        </ZoomControl>
        <FullScreenControl
          labels={{ enter: "Enter Fullscreen", exit: "Exit Fullscreen" }}
        >
          <AiOutlineFullscreen />
          <AiOutlineFullscreenExit />
        </FullScreenControl>
        <LayoutForceAtlas2Control
          labels={{ stop: "Stop Layout", start: "Start Layout" }}
          autoRunFor={1000}
          settings={{
            settings: {
              adjustSizes: true,
              gravity: 0.5,
              // outboundAttractionDistribution: true,
              scalingRatio: 250,
              strongGravityMode: true,
            },
          }}
        >
          <AiFillPlayCircle />
          <AiFillPauseCircle />
        </LayoutForceAtlas2Control>
      </ControlsContainer>

      <ControlsContainer
        position={"bottom-left"}
        className="graphLegendControlsContainer"
      >
        <Text size="1">
          <Flex gap="1" direction="column">
            {Object.entries(ENTITY_COLORS).map(([type, color]) => (
              <NodeTypeBadge key={type} type={type} color={color} />
            ))}
          </Flex>
        </Text>
      </ControlsContainer>
      <ControlsContainer position={"top-right"}>
        <SearchControl style={{ width: "200px" }} />
      </ControlsContainer>
    </SigmaContainer>
  );
};

const NodeTypeBadge: React.FC<{ type: string; color: string }> = ({
  type,
  color,
}) => {
  return (
    <Flex align="center" gap="1">
      <IconButton
        style={{
          backgroundColor: color,
          width: 12,
          height: 12,
          borderRadius: 16,
          display: "inline-block",
        }}
      />
      {type}
    </Flex>
  );
};

export default MultiDirectedGraph;
