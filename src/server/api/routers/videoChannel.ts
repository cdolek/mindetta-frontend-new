import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  // publicProcedure,
} from "~/server/api/trpc";

export const videoChannelRouter = createTRPCRouter({
  //   create: protectedProcedure
  //     .input(
  //       z.object({ name: z.string().min(1), description: z.string().optional() }),
  //     )
  //     .mutation(async ({ ctx, input }) => {
  //       // simulate a slow db call
  //       // await new Promise((resolve) => setTimeout(resolve, 1000));
  //       return ctx.db.video.create({
  //         data: {
  //         //   name: input.name,
  //         //   description: input.description,
  //           createdBy: { connect: { id: ctx.session.user.id } },
  //         },
  //       });
  //     }),

  remove: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.db.video.delete({
        where: { id: input.id },
      });
    }),

  //   update: protectedProcedure
  //     .input(z.object({ channelId: z.string(), name: z.string() }))
  //     .mutation(({ ctx, input }) => {
  //       return ctx.db.video.update({
  //         where: { id: input.channelId, createdBy: { id: ctx.session.user.id } },
  //         data: { name: input.name },
  //       });
  //     }),

  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.videoChannel.findUnique({
        where: { id: input.id },
        // include: {
        //   createdBy: {
        //     select: { email: true },
        //   },
        // },
      });
    }),

  // getLatest: protectedProcedure.query(({ ctx }) => {
  //   return ctx.db.videoChannel.findFirst({
  //     orderBy: {
  //       snippet: {
  //         publishedAt: "desc",
  //       },
  //     },
  //     //   where: { createdBy: { id: ctx.session.user.id } },
  //   });
  // }),

  getVideosByChannelId: protectedProcedure
    .input(z.object({ channelId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.video.findMany({
        where: { channelId: input.channelId },
        orderBy: {
          publishedAt: "desc",
        },
        select: {
          id: true,
          videoId: true,
          title: true,
          publishedAt: true,
          isShortVideo: true,
          thumbnails: true,
          metadata: true,
          channelTitle: true,
          channel: {
            select: {
              id: true,
              snippet: {
                select: {
                  customUrl: true,
                  description: true,
                  thumbnails: {
                    select: {
                      default: true,
                    },
                  },
                },
              },
            },
          },
        },
        // where: { createdBy: { id: ctx.session.user.id } },
        take: 100,
      });
    }),

  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.db.videoChannel.findMany({
      orderBy: {
        statistics: {
          subscriberCount: "desc",
        },
      },
      // where: { createdBy: { id: ctx.session.user.id } },
      take: 100,
      //   include: {
      //     createdBy: {
      //       select: { id: true, name: true, image: true },
      //     },
      //   },
    });
  }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
