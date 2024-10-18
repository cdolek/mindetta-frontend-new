// import * as Y from "yjs";
// import Dagre, { type GraphLabel } from "@dagrejs/dagre";
// import { type Edge, type Node } from "reactflow";

// import {
//   type NodeOrEdge,
//   type NodeOrEdgeKeys,
//   type EdgeData,
//   type NodeDataMap,
// } from "~/_stores/SharedFlowStore";

export function formatVideoStats(num?: number | string): string {
  if (typeof num === "string") {
    num = parseInt(num);
  }

  if (!num || isNaN(num)) {
    num = 0;
  }

  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(0) + "B";
  } else if (num >= 1000000) {
    return (num / 1000000).toFixed(0) + "M";
  } else if (num >= 1000) {
    return (num / 1000).toFixed(0) + "K";
  } else {
    return num.toString();
  }
}

export function formatVideoSecondsToTime(seconds: number) {
  // Ensure the input is a number
  if (typeof seconds !== "number" || isNaN(seconds)) {
    return "Invalid input";
  }

  // Calculate hours, minutes, and seconds
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  // Format the time parts to be two digits if necessary
  const formattedHrs = hrs > 0 ? String(hrs).padStart(2, "0") + ":" : "";
  const formattedMins = String(mins).padStart(2, "0");
  const formattedSecs = String(secs).padStart(2, "0");

  // Combine the parts
  return `${formattedHrs}${formattedMins}:${formattedSecs}`;
}

/**
 * Generates a random color in HSL format.
 * @returns A string representing the random color in HSL format.
 */
export function randomHSLColor() {
  const hue = Math.random() * 360;
  const value = Math.random() * 0.5 + 0.25;
  return `hsl(${hue}, 75%, ${value * 100}%)`;
}

/**
 * Generates a random color in hex format.
 * @returns A string representing the random color in hex format.
 */
export function randomColor() {
  const palette = getColorPalette();
  return palette[Math.floor(Math.random() * palette.length)];
}

/**
 * Generates an array of colors based on the specified color specifier.
 *
 * @param specifier - The color specifier used to generate the colors.
 * @returns An array of colors.
 */
export function Colors(specifier: string) {
  const n = (specifier.length / 6) | 0;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const colors: string[] = new Array(n);
  let i = 0;
  while (i < n) colors[i] = "#" + specifier.slice(i * 6, ++i * 6);
  return colors;
}

/**
 * Returns the color palette.
 * @returns {Colors} The color palette.
 */
export function getColorPalette() {
  return Colors(
    "a6cee3b2df8a33a02cfb9a99e31a1cfdbf6fff7f00cab2d66a3d9affff99b15928",
  );
}

export function getQualitativeColorPalette() {
  // // ColorBrewer qualitative colors
  // return [
  //   "#a6cee3",
  //   "#1f78b4",
  //   "#b2df8a",
  //   "#33a02c",
  //   "#fb9a99",
  //   "#e31a1c",
  //   "#fdbf6f",
  //   "#ff7f00",
  //   "#cab2d6",
  //   "#6a3d9a",
  //   "#ffff99",
  //   "#b15928",
  // ];
  // 16 colors from https://medialab.github.io/iwanthue/ + colorblind friendly
  return [
    "#33d4d1",
    "#9b7532",
    "#3f722b",
    "#bdab54",
    "#47bb8a",
    "#b84568",
    "#6b7fd8",
    "#b85292",
    "#b84b44",
    "#593789",
    "#6a9a3e",
    "#c273cb",
    "#66c876",
    "#c46332",
    "#cf9c31",
    "#9bbb46",
  ];
}

type WithId = { id: string | number };

/**
 * Finds the elements in `newArray` that are not present in `previousArray` based on their `id` property.
 *
 * @template T - The type of elements in the arrays.
 * @param {T[]} previousArray - The previous array to compare.
 * @param {T[]} newArray - The new array to compare.
 * @returns {T[]} - An array containing the unique elements from both arrays.
 */
export function findUnmatchingElementsById<T extends WithId>(
  previousArray: T[],
  newArray: T[],
): T[] {
  // Find elements in newArray that are not in previousArray
  const uniqueInNewArray = newArray.filter(
    (newItem) => !previousArray.some((prevItem) => prevItem.id === newItem.id),
  );

  // Find elements in previousArray that are not in newArray
  const uniqueInPreviousArray = previousArray.filter(
    (prevItem) => !newArray.some((newItem) => newItem.id === prevItem.id),
  );

  // Combine and return the unique elements from both arrays
  return uniqueInNewArray.concat(uniqueInPreviousArray);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ObjectWithId = { id: string | number; [key: string]: any };

/**
 * Finds the elements in `newArray` that do not exist in `previousArray` based on specified properties to exclude.
 *
 * @template T - The type of objects in the arrays.
 * @param previousArray - The previous array to compare.
 * @param newArray - The new array to compare.
 * @param propsToExclude - The properties to exclude when comparing the objects.
 * @returns An array of elements that are unique to `newArray` or `previousArray`.
 */
export function findUnmatchingElementsByValue<T extends ObjectWithId>(
  previousArray: T[],
  newArray: T[],
  propsToExclude: string[],
): T[] {
  // Function to remove specified properties from an object
  const removeProperties = (obj: T, props: string[]): T => {
    const newObj = { ...obj };
    props.forEach((prop) => {
      delete newObj[prop];
    });
    return newObj;
  };

  // Function to compare two objects by their properties, excluding specified props
  const isDifferent = (obj1: T, obj2: T): boolean => {
    const restObj1 = removeProperties(obj1, propsToExclude);
    const restObj2 = removeProperties(obj2, propsToExclude);

    for (const key in restObj1) {
      if (restObj1[key] !== restObj2[key]) {
        return true;
      }
    }
    return false;
  };

  // Find elements in newArray that are not in previousArray
  const uniqueInNewArray = newArray.filter(
    (newItem) =>
      !previousArray.some(
        (prevItem) =>
          prevItem.id === newItem.id && !isDifferent(prevItem, newItem),
      ),
  );

  // Find elements in previousArray that are not in newArray
  const uniqueInPreviousArray = previousArray.filter(
    (prevItem) =>
      !newArray.some(
        (newItem) =>
          newItem.id === prevItem.id && !isDifferent(newItem, prevItem),
      ),
  );

  // Combine and return the unique elements from both arrays
  return uniqueInNewArray.concat(uniqueInPreviousArray);
}

/**
 * Replaces an item in a Yjs Y.Array based on its unique 'id' property.
 * @param {Y.Array<Y.Map<Node<NodeDataMap>>>} yarray The Y.Array containing objects.
 * @param {Node<NodeDataMap>} newItem The new object with which to replace the existing one.
 */
// export function replaceItemInYArray(
//   yarray: Y.Array<Y.Map<NodeOrEdge>>,
//   newItem: NodeOrEdge,
// ): void {
//   // Check if newItem has an 'id' property
//   if (typeof newItem?.id === "undefined") {
//     console.error("New item must have an id property");
//     return;
//   }

//   console.log("replaceItemInYArray: yarray", yarray.toJSON());

//   // Find the index of the item with the same id
//   const itemIndex = yarray
//     .toJSON()
//     .findIndex(
//       (item) =>
//         (item as unknown as NodeOrEdge).id ===
//         (newItem as unknown as NodeOrEdge).id,
//     );
//   // If the item is found, replace it
//   if (itemIndex !== -1) {
//     yarray.delete(itemIndex, 1); // Delete the old item
//     yarray.insert(itemIndex, [newItem as unknown as Y.Map<NodeOrEdge>]); // Insert the new item at the same position
//   } else {
//     // yarray.push([newItem as unknown as Y.Map<NodeOrEdge>]); // If the item is not found, push it to the end of the array
//     console.warn("Item with id", newItem.id, "not found in Y.Array");
//   }
// }

function isDiffSameValues(
  obj: Record<string, unknown>,
  diff: Record<string, unknown>,
) {
  return Object.keys(diff).every(
    (key) => obj.hasOwnProperty(key) && obj[key] === diff[key],
  );
}

// /**
//  * Applies a diff to an item with a specified ID in a Yjs Y.Array.
//  * @param {Y.Array<Y.Map<NodeOrEdge>>} yarray The Y.Array containing objects.
//  * @param {string} id The ID of the item to update.
//  * @param {Partial<NodeOrEdge>} diff The diff to apply to the item.
//  * @param {NodeOrEdgeKeys[]} excludedProps An array of properties to exclude from the updated item.
//  */
// export function applyDiffToYArrayItem(
//   yarray: Y.Array<Y.Map<NodeOrEdge>>,
//   diff: Partial<NodeOrEdge>,
//   excludedProps: NodeOrEdgeKeys[] = [],
// ): void {
//   // Find the index of the item with the given ID
//   const itemIndex = yarray
//     .toArray()
//     .findIndex((item) => item.get("id") === diff.id);

//   // Check if the item was found
//   if (itemIndex === -1) {
//     console.error("Item with the specified ID not found");
//     return;
//   }

//   // Retrieve the current item at the index
//   const currentItem = yarray.get(itemIndex);

//   // Check if the item is an object
//   if (typeof currentItem !== "object" || currentItem === null) {
//     console.error("Item at the index is not an object");
//     return;
//   }

//   // Check if the diff is the same as the current item
//   if (
//     isDiffSameValues(currentItem as unknown as Record<string, unknown>, diff)
//   ) {
//     console.log("Diff is the same as the current item, skipping update");
//     return;
//   }

//   // Apply the diff to the item directly
//   Object.keys(diff).forEach((key) => {
//     if (!excludedProps.includes(key as NodeOrEdgeKeys) && key !== "id") {
//       const value = diff[key as keyof NodeOrEdge] as NodeOrEdge;
//       currentItem.set(key, value);
//     }
//   });
// }

// /**
//  * Adds a new item to the Y.Array if an item with the same id doesn't exist.
//  * @param {Y.Array<Y.Map<NodeOrEdge>>} yarray The Y.Array to add the new item to.
//  * @param {NodeOrEdge} newItem The new item to add.
//  */

// export function addItemToYArray(
//   yarray: Y.Array<Y.Map<NodeOrEdge>>,
//   newItem: NodeOrEdge,
// ) {
//   if (typeof newItem?.id === "undefined") {
//     console.error("New item must have an id property");
//     return;
//   }
//   const exists = (yarray.toJSON() as NodeOrEdge[]).some(
//     (item) => item.id === newItem.id,
//   );
//   if (!exists) {
//     console.log("newItem", newItem, Object.keys(newItem));
//     const newElement = new Y.Map<NodeOrEdge>();
//     Object.keys(newItem).forEach((key) => {
//       const value = newItem[key as keyof NodeOrEdge] as NodeOrEdge;
//       console.log("key", key, "value", value);
//       newElement.set(key as keyof NodeOrEdge, value);
//     });
//     console.log("newElement", newElement);
//     // yarray.push([newElement]);
//   } else {
//     console.warn("An item with id", newItem.id, "already exists");
//   }
// }

// /**
//  * Deletes an item from the Y.Array based on its 'id' property.
//  * @param {Y.Array<Y.Map<NodeOrEdge>>} yarray The Y.Array to delete the item from.
//  * @param {string} itemId The id of the item to delete.
//  */
// export function deleteItemFromYArray(
//   yarray: Y.Array<Y.Map<NodeOrEdge>>,
//   itemId: string,
// ): void {
//   const itemIndex = (yarray.toJSON() as NodeOrEdge[]).findIndex(
//     (item) => item.id === itemId,
//   );
//   if (itemIndex !== -1) {
//     yarray.delete(itemIndex, 1);
//   } else {
//     console.warn("Item with id", itemId, "not found in Y.Array");
//   }
// }

// /**
//  * Finds an item in a Y.Array based on its 'id' property.
//  * @param {Y.Array<Y.Map<Node<NodeDataMap>>>} yarray The Y.Array to search for the item.
//  * @param {string} id The id of the item to find.
//  * @returns {Y.Map<Node<NodeDataMap>>} The item with the specified id.
//  */
// export function findYItemById(
//   yarray: Y.Array<Y.Map<Node<NodeDataMap>>>,
//   id: string,
// ): Y.Map<Node<NodeDataMap>> | undefined {
//   return yarray.toArray().find((item) => item.get("id")?.id === id);
// }

// /**
//  * Calculates the layout positions of elements in a graph.
//  *
//  * @param nodes - An array of nodes in the graph.
//  * @param edges - An array of edges in the graph.
//  * @param options - The graph layout options.
//  * @returns An object containing the layout positions of nodes and the original edges.
//  */

// export function getLayoutedElements(
//   nodes: Y.Map<Node<NodeDataMap>>[],
//   edges: Y.Map<Edge<EdgeData>>[],
//   options: GraphLabel,
// ) {
//   const g = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));

//   g.setGraph(options);
//   // let xMin = Infinity;
//   // let yMin = Infinity;
//   nodes.forEach((node) => {
//     const nodeObj = node.toJSON();
//     // xMin = Math.min(xMin, node.position.x);
//     // yMin = Math.min(yMin, node.position.y);
//     g.setNode(nodeObj.id, {
//       label: nodeObj.id,
//       width: nodeObj.width,
//       height: nodeObj.height,
//     });
//   });

//   edges.forEach((edge) => {
//     const edgeObj = edge.toJSON();
//     g.setEdge(edgeObj.source, edgeObj.target);
//   });

//   Dagre.layout(g);

//   return {
//     nodes: nodes.map((node) => {
//       const nodeObj = node.toJSON();
//       const { x, y } = g.node(nodeObj.id);
//       console.log(
//         "getLayoutedElements node --->",
//         nodeObj.id,
//         x,
//         y,
//         nodeObj.width,
//         nodeObj.height,
//       );
//       return {
//         id: nodeObj.id,
//         position: {
//           x: nodeObj.width ? x - nodeObj.width! / 2 : x, // adjust x coordinate
//           y: nodeObj.height ? y - nodeObj.height! / 2 : y, // adjust y coordinate
//         },
//         width: nodeObj.width!,
//         height: nodeObj.height!,
//       };
//     }),
//     edges,
//   };
// }

// export function getGraphExecutionPath(
//   nodes: Node[],
//   edges: Edge[],
// ): string[][] {
//   const startNode = nodes.find((node) => node.data.isStartNode);
//   if (!startNode) {
//     console.log("No start node found.");
//     return [];
//   }

//   const visited = new Set<string>();
//   const levels: string[][] = []; // Initialize an array to hold levels of node IDs
//   const queue: Node[][] = [[startNode]]; // Initialize queue with the start node as the first level

//   while (queue.length > 0) {
//     const currentLevel = queue.shift(); // Get the current level nodes
//     const nextLevel: Node[] = []; // Prepare for the next level nodes
//     const currentLevelIds: string[] = [];

//     if (currentLevel) {
//       currentLevel.forEach((node) => {
//         visited.add(node.id); // Mark the node as visited
//         currentLevelIds.push(node.id); // Collect the current level node IDs

//         edges.forEach((edge) => {
//           if (edge.source === node.id && !visited.has(edge.target)) {
//             const targetNode = nodes.find((n) => n.id === edge.target);
//             if (targetNode && !nextLevel.some((n) => n.id === targetNode.id)) {
//               nextLevel.push(targetNode); // Add to the next level if not already visited and not added
//             }
//           }
//         });
//       });
//     }

//     if (currentLevelIds.length > 0) {
//       levels.push(currentLevelIds); // Add current level IDs to the levels array
//     }

//     if (nextLevel.length > 0) {
//       queue.push(nextLevel); // Add the next level to the queue if it's not empty
//     }
//   }

//   return levels; // Return the collected levels of node IDs
// }

// export function getGraphExecutionPathBFS(
//   nodes: Node[],
//   edges: Edge[],
// ): string[][] {
//   const visited = new Set<string>();
//   const levels: string[][] = [];

//   nodes.forEach((startNode) => {
//     if (!visited.has(startNode.id)) {
//       const queue: Node[][] = [[startNode]]; // Initialize queue with the start node as the first level

//       while (queue.length > 0) {
//         const currentLevel = queue.shift(); // Get the current level nodes
//         const nextLevel: Node[] = []; // Prepare for the next level nodes
//         const currentLevelIds: string[] = [];

//         if (currentLevel) {
//           currentLevel.forEach((node) => {
//             visited.add(node.id); // Mark the node as visited
//             currentLevelIds.push(node.id); // Collect the current level node IDs

//             edges.forEach((edge) => {
//               if (edge.source === node.id && !visited.has(edge.target)) {
//                 const targetNode = nodes.find((n) => n.id === edge.target);
//                 if (
//                   targetNode &&
//                   !nextLevel.some((n) => n.id === targetNode.id)
//                 ) {
//                   nextLevel.push(targetNode); // Add to the next level if not already visited and not added
//                 }
//               }
//             });
//           });
//         }

//         if (currentLevelIds.length > 0) {
//           levels.push(currentLevelIds); // Add current level IDs to the levels array
//         }

//         if (nextLevel.length > 0) {
//           queue.push(nextLevel); // Add the next level to the queue if it's not empty
//         }
//       }
//     }
//   });

//   return levels; // Return the collected levels of node IDs
// }

// export function getNewNodePositionById(nodeId: string) {}

// /**
//  * Finds the middle x and y coordinates of the given nodes.
//  *
//  * @param nodes - An array of nodes.
//  * @returns An object containing the middle x and y coordinates.
//  */
// export function findCenterXY(nodes: Node<NodeDataMap>[]) {
//   // Initialize variables to store min and max x and y coordinates.
//   let minX = Infinity;
//   let maxX = -Infinity;
//   let minY = Infinity;
//   let maxY = -Infinity;

//   // Iterate over the nodes and update the min and max coordinates.
//   for (const node of nodes) {
//     const { position, width, height } = node;
//     const centerX = position.x + width! / 2;
//     const centerY = position.y + height! / 2;
//     minX = Math.min(minX, centerX - width! / 2);
//     maxX = Math.max(maxX, centerX + width! / 2);
//     minY = Math.min(minY, centerY - height! / 2);
//     maxY = Math.max(maxY, centerY + height! / 2);
//   }

//   // Calculate the middle x and y coordinates.
//   const centerX = (minX + maxX) / 2;
//   const centerY = (minY + maxY) / 2;

//   return { x: centerX, y: centerY };
// }

// /**
//  * Logs the provided messages to the console if the environment is not in production mode.
//  * @param messages - The messages to be logged.
//  */
// export function log(...messages: unknown[]): void {
//   if (process.env.NODE_ENV !== "production") {
//     console.log(...messages);
//   }
// }

// /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
// export const isNumeric = (n: any): n is number => !isNaN(n) && isFinite(n);

// // https://github.com/YousefED/SyncedStore/issues/29
// //
// // export function serializeYDoc(yDoc: Y.Doc) {
// //   const documentState = Y.encodeStateAsUpdate(yDoc)
// //   const base64Encoded = fromUint8Array(documentState)
// //   return base64Encoded
// // }

// // export function deserializeYDoc(base64YDoc: string) {
// //   const binaryEncoded = toUint8Array(base64YDoc)
// //   const deserializedYDoc = new Y.Doc()
// //   Y.applyUpdate(deserializedYDoc, binaryEncoded)
// //   return deserializedYDoc
// // }

export function randomValue(min: number, max: number): number {
  return Math.random() * (max - min + 1) + min;
}

// export function randomInt(min: number, max: number): number {
//   return Math.floor(randomValue(min, max));
// }

// export const sampleGraph2 = {
//   output: {
//     nodes: [
//       {
//         id: "1",
//         data: {
//           isStartNode: true,
//           label: "Project Initialization",
//           instructions:
//             "Create a new project directory and initialize it with version control.",
//         },
//       },
//       {
//         id: "2",
//         data: {
//           label: "Design Mockup",
//           instructions:
//             "Design a mockup of the landing page including layout, color scheme, and key elements.",
//         },
//       },
//       {
//         id: "3",
//         data: {
//           label: "Tech Stack Decision",
//           instructions:
//             "Decide on the technology stack (HTML, CSS framework, JavaScript library/framework).",
//         },
//       },
//       {
//         id: "4",
//         data: {
//           label: "Setup Development Environment",
//           instructions:
//             "Setup the local development environment including necessary compilers or interpreters based on the chosen tech stack.",
//         },
//       },
//       {
//         id: "5",
//         data: {
//           label: "Create Basic Layout",
//           instructions:
//             "Using the chosen tech stack, create the basic layout of the landing page as per the design mockup.",
//         },
//       },
//       {
//         id: "6",
//         data: {
//           label: "Add Content",
//           instructions:
//             "Add textual and graphical content to the landing page.",
//         },
//       },
//       {
//         id: "7",
//         data: {
//           label: "Styling",
//           instructions:
//             "Apply CSS/styling frameworks to match the landing page's design with the mockup.",
//         },
//       },
//       {
//         id: "8",
//         data: {
//           label: "Interactive Elements",
//           instructions:
//             "Implement interactive elements using JavaScript or chosen framework (e.g., sign-up form, scroll animations).",
//         },
//       },
//       {
//         id: "9",
//         data: {
//           label: "Responsive Design",
//           instructions:
//             "Ensure the landing page is responsive and works well on various devices and screen sizes.",
//         },
//       },
//       {
//         id: "10",
//         data: {
//           label: "Testing",
//           instructions:
//             "Test the landing page for functionality, responsiveness, and cross-browser compatibility.",
//         },
//       },
//       {
//         id: "11",
//         data: {
//           label: "Feedback Loop Setup",
//           instructions:
//             "Set up a system for collecting feedback from users (e.g., feedback form, analytics).",
//         },
//       },
//       {
//         id: "12",
//         data: {
//           label: "Error Corrections",
//           instructions:
//             "Review feedback and analytics to identify and correct any errors or user experience issues.",
//         },
//       },
//       {
//         id: "13",
//         data: {
//           label: "Final Review",
//           instructions:
//             "Perform a final review of the landing page to ensure all elements are functioning correctly and the design is as intended.",
//         },
//       },
//       {
//         id: "14",
//         data: {
//           label: "Launch",
//           instructions: "Deploy the landing page to a live server.",
//         },
//       },
//       {
//         id: "15",
//         data: {
//           label: "Result",
//           instructions:
//             "The landing page for the note-taking app is now live and accessible to users.",
//         },
//       },
//     ],
//     edges: [
//       {
//         id: 1,
//         label: "initialization to design and tech decision",
//         source: "1",
//         target: "2",
//       },
//       {
//         id: 2,
//         label: "initialization to design and tech decision",
//         source: "1",
//         target: "3",
//       },
//       {
//         id: 3,
//         label: "design and tech stack to setup",
//         source: "2",
//         target: "4",
//       },
//       {
//         id: 4,
//         label: "design and tech stack to setup",
//         source: "3",
//         target: "4",
//       },
//       {
//         id: 5,
//         label: "setup to basic layout",
//         source: "4",
//         target: "5",
//       },
//       {
//         id: 6,
//         label: "basic layout to content",
//         source: "5",
//         target: "6",
//       },
//       {
//         id: 7,
//         label: "content to styling",
//         source: "6",
//         target: "7",
//       },
//       {
//         id: 8,
//         label: "styling to interactive elements",
//         source: "7",
//         target: "8",
//       },
//       {
//         id: 9,
//         label: "interactive elements to responsive design",
//         source: "8",
//         target: "9",
//       },
//       {
//         id: 10,
//         label: "responsive design to testing",
//         source: "9",
//         target: "10",
//       },
//       {
//         id: 11,
//         label: "testing to feedback loop",
//         source: "10",
//         target: "11",
//       },
//       {
//         id: 12,
//         label: "feedback loop to error corrections",
//         source: "11",
//         target: "12",
//       },
//       {
//         id: 13,
//         label: "error corrections to final review",
//         source: "12",
//         target: "13",
//       },
//       {
//         id: 14,
//         label: "final review to launch",
//         source: "13",
//         target: "14",
//       },
//       {
//         id: 15,
//         label: "launch to result",
//         source: "14",
//         target: "15",
//       },
//     ],
//   },
// };

// export const sampleGraph = {
//   nodes: [
//     {
//       id: "1",
//       data: {
//         isStartNode: true,
//         label: "Project Initialization",
//         instructions:
//           "Create a new project directory and initialize it with version control.",
//       },
//     },
//     {
//       id: "2",
//       data: {
//         label: "Design Mockup",
//         instructions:
//           "Design a mockup of the landing page including layout, color scheme, and key elements.",
//       },
//     },
//     {
//       id: "3",
//       data: {
//         label: "Tech Stack Decision",
//         instructions:
//           "Decide on the technology stack (HTML, CSS framework, JavaScript library/framework).",
//       },
//     },
//     {
//       id: "4",
//       data: {
//         label: "Setup Development Environment",
//         instructions:
//           "Setup the local development environment including necessary compilers or interpreters based on the chosen tech stack.",
//       },
//     },
//     {
//       id: "5",
//       data: {
//         label: "Create Basic Layout",
//         instructions:
//           "Using the chosen tech stack, create the basic layout of the landing page as per the design mockup.",
//       },
//     },
//   ],
//   edges: [
//     {
//       label: "initialization to design and tech decision",
//       source: "1",
//       target: "2",
//     },
//     {
//       label: "initialization to design and tech decision",
//       source: "1",
//       target: "3",
//     },
//     {
//       label: "design and tech stack to setup",
//       source: "2",
//       target: "4",
//     },
//     {
//       label: "design and tech stack to setup",
//       source: "3",
//       target: "4",
//     },
//     {
//       label: "setup to basic layout",
//       source: "4",
//       target: "5",
//     },
//   ],
// };

// export const sampleGraphCompetitiveStrategy = {
//   nodes: [
//     {
//       id: "1",
//       data: {
//         label: "Define Company's Objectives",
//         isStartNode: true,
//         instructions: "Identify the main objectives and goals of the company.",
//       },
//     },
//     {
//       id: "2",
//       data: {
//         label: "Analyze Industry Structure",
//         instructions:
//           "Use Porter's Five Forces model to analyze the industry's competitiveness.",
//       },
//     },
//     {
//       id: "3",
//       data: {
//         label: "Identify Company's Resources",
//         instructions: "List the company's key resources and capabilities.",
//       },
//     },
//     {
//       id: "4",
//       data: {
//         label: "Determine Competitive Position",
//         instructions:
//           "Assess the company's current position within the industry compared to competitors.",
//       },
//     },
//     {
//       id: "5",
//       data: {
//         label: "Select Generic Strategy",
//         instructions:
//           "Based on the analysis, choose between Cost Leadership, Differentiation, or Focus strategy.",
//       },
//     },
//     {
//       id: "6",
//       data: {
//         label: "Feedback Loop: Strategy Evaluation",
//         instructions:
//           "Evaluate the chosen strategy for feasibility, consistency with company objectives, and industry conditions.",
//       },
//     },
//     {
//       id: "7",
//       data: {
//         label: "Implement Strategy",
//         instructions:
//           "Develop an action plan for implementing the selected strategy.",
//       },
//     },
//     {
//       id: "8",
//       data: {
//         label: "Monitor and Adapt",
//         instructions:
//           "Set up mechanisms to monitor the strategy's effectiveness and adapt as necessary.",
//       },
//     },
//     {
//       id: "9",
//       data: {
//         label: "Result",
//         instructions:
//           "Finalize the competitive strategy plan ready for deployment.",
//       },
//     },
//   ],
//   edges: [
//     {
//       id: 1,
//       label: "inputs",
//       source: "1",
//       target: "2",
//     },
//     {
//       id: 2,
//       label: "inputs",
//       source: "2",
//       target: "4",
//     },
//     {
//       id: 3,
//       label: "inputs",
//       source: "3",
//       target: "4",
//     },
//     {
//       id: 4,
//       label: "inputs",
//       source: "4",
//       target: "5",
//     },
//     {
//       id: 5,
//       label: "inputs",
//       source: "5",
//       target: "6",
//     },
//     {
//       id: 6,
//       label: "evaluation",
//       source: "6",
//       target: "5",
//     },
//     {
//       id: 7,
//       label: "strategy selected",
//       source: "6",
//       target: "7",
//     },
//     {
//       id: 8,
//       label: "implementation",
//       source: "7",
//       target: "8",
//     },
//     {
//       id: 9,
//       label: "monitoring feedback",
//       source: "8",
//       target: "6",
//     },
//     {
//       id: 10,
//       label: "final",
//       source: "8",
//       target: "9",
//     },
//   ],
//   callback_events: [],
//   metadata: {
//     run_id: "786ea87b-2ea8-4f18-8f86-2dca6b3a7e2b",
//   },
// };
