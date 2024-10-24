import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  // publicProcedure,
} from "~/server/api/trpc";

export const knowledgeGraphRouter = createTRPCRouter({
  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),

  getGraph: protectedProcedure
    .input(z.object({ videoId: z.string() })) // Input validation for videoId
    .query(({ ctx, input }) => {
      return ctx.db.knowledgeGraph.findMany({
        where: { videoId: input.videoId },
        select: {
          relation: true,
          source: {
            select: {
              nodeId: true,
              title: true,
              type: true,
            },
          },
          target: {
            select: {
              nodeId: true,
              title: true,
              type: true,
            },
          },
        },
      });
    }),
});

// return ctx.db.knowledgeGraph.findMany({
//     where: { videoId: input.videoId },
//     select: {
//       id: true,
//       edgeId: true,
//       source: {
//         select: {
//           nodeId: true,
//           name: true,
//           type: true,
//         },
//       },
//       target: {
//         select: {
//           nodeId: true,
//           name: true,
//           type: true,
//         },
//       },
//       videoMetaData: {
//         select: {
//           duration: true,
//           view_count: true,
//           categories: true,
//           tags: true,
//           like_count: true,
//           channel_follower_count: true,
//           comment_count: true,
//         },
//       },
//       videoThumbnails: {
//         select: {
//           default: {
//             select: {
//               url: true,
//               width: true,
//               height: true,
//             },
//           },
//           medium: {
//             select: {
//               url: true,
//               width: true,
//               height: true,
//             },
//           },
//           high: {
//             select: {
//               url: true,
//               width: true,
//               height: true,
//             },
//           },
//           standard: {
//             select: {
//               url: true,
//               width: true,
//               height: true,
//             },
//           },
//           maxres: {
//             select: {
//               url: true,
//               width: true,
//               height: true,
//             },
//           },
//         },
//       },
//       videoPublishedAt: true,
//     },
//   });
