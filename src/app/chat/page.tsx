"use client";
import { Flex, Box, Container, Heading, Grid, Text } from "@radix-ui/themes";
import LeftSidebar from "../_components/LeftSidebar";
import Chat from "../_components/Chat";
import { SessionProvider } from "next-auth/react";

export default function VideoChannels() {
  return (
    <SessionProvider>
      <Flex width="100%" height="100%" direction="row" justify="between">
        <LeftSidebar />

        <Container size="2">
          <Box p="6">
            {/* <Heading
            size={{
              initial: "7",
              xs: "2",
              sm: "3",
              md: "5",
            }}
            mb="3"
          >
            Hello
          </Heading> */}

            <Chat />
          </Box>
        </Container>

        <LeftSidebar />
      </Flex>
    </SessionProvider>
  );
}

// "use client";

// import { useEffect, useRef, useState } from "react";
// import { SessionProvider } from "next-auth/react";

// import useResizeObserver from "use-resize-observer";

// import RightSidebar from "../_components/RightSidebar";

// import styled from "@emotion/styled";

// import { IconButton, Box } from "@radix-ui/themes";

// import { TbArrowBarLeft, TbArrowBarRight } from "react-icons/tb";

// const CanvasContainer = () => {
//   const [panes, setPanes] = useState([true, true, true]);
//   const [count, setCount] = useState(0);
//   const [containerW, setContainerW] = useState(0);
//   const [containerH, setContainerH] = useState(0);
//   const containerRef = useRef(null!);
//   const leftPaneRef = useRef(null!);
//   const rightPaneRef = useRef(null!);

//   const { width: containerWidth, height: containerHeight } =
//     useResizeObserver<HTMLDivElement>({
//       ref: containerRef,
//       onResize: ({ width, height }) => {
//         setContainerW(width ?? 0);
//         setContainerH(height ?? 0);
//         // console.log("containerWidth", width, "containerHeight", height);
//       },
//     });

//   return (
//     <SessionProvider>
//       <Allotment
//         defaultSizes={[100, 400, 200]}
//         onChange={() => setCount((count) => count + 1)}
//         onVisibleChange={(_index, value) => {
//           console.log("visible change", _index, value);
//         }}
//       >
//         <Allotment.Pane
//           minSize={200}
//           visible={panes[0]}
//           // className="leftPane"
//           ref={leftPaneRef}
//         >
//           <LeftSidebar />
//         </Allotment.Pane>
//         <Allotment.Pane ref={containerRef}>
//           <div
//             style={{
//               // background: "red",
//               width: containerW,
//               height: containerH,
//             }}
//           >
//             <>
//               <PaneCloser
//                 index={0}
//                 setPanes={setPanes}
//                 panes={panes}
//                 alignment="left"
//               />
//               <Box>
//                 Lorem ipsum dolor sit amet, consectetur adipisicing elit.
//                 Sapiente non molestiae possimus suscipit nulla cumque alias
//                 inventore labore omnis deleniti laborum enim tempora, magni
//                 repellendus ratione recusandae. Maxime, totam dolore.
//               </Box>
//               <PaneCloser
//                 index={2}
//                 setPanes={setPanes}
//                 panes={panes}
//                 alignment="right"
//               />
//             </>
//           </div>
//         </Allotment.Pane>
//         <Allotment.Pane
//           ref={rightPaneRef}
//           // className="rightPane"
//           minSize={290}
//           maxSize={440}
//           visible={panes[2]}
//           preferredSize={290}
//         >
//           <RightSidebar />
//         </Allotment.Pane>
//       </Allotment>
//     </SessionProvider>
//   );
// };

// export default CanvasContainer;

// const PaneCloser = ({
//   index,
//   setPanes,
//   panes,
//   alignment,
// }: {
//   index: number;
//   setPanes: React.Dispatch<React.SetStateAction<boolean[]>>;
//   panes: boolean[];
//   alignment?: "left" | "right";
// }) => {
//   return (
//     <div
//       style={{
//         position: "absolute",
//         top: "50%",
//         left: alignment === "left" ? 0 : undefined,
//         right: alignment === "right" ? 0 : undefined,
//         // background: "red",
//       }}
//     >
//       <IconButton
//         variant="ghost"
//         size="1"
//         // color="gray"
//         onClick={() =>
//           setPanes((panes) => {
//             const newPanes = [...panes];
//             newPanes[index] = !newPanes[index];
//             return newPanes;
//           })
//         }
//       >
//         {alignment === "left" &&
//           (panes[index] ? <StyledTbArrowBarLeft /> : <StyledTbArrowBarRight />)}
//         {alignment === "right" &&
//           (panes[index] ? <StyledTbArrowBarRight /> : <StyledTbArrowBarLeft />)}
//       </IconButton>
//     </div>
//   );
// };

// const StyledTbArrowBarLeft = styled(TbArrowBarLeft)`
//   margin-left: 6px;
//   color: #777;
// `;
// const StyledTbArrowBarRight = styled(TbArrowBarRight)`
//   margin-right: 6px;
//   color: #777;
// `;
