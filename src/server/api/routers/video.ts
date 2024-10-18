import { z } from "zod";
import fs, { createWriteStream } from "fs";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

import { Prisma } from "@prisma/client";

type StringMatchesSentenceObj = {
  sentence: string;
  matches: {
    key: string;
    start: number;
    end: number;
  }[];
};

interface SentenceEntity {
  text: string;
  label: string;
  score: number;
  start: number;
  end: number;
}

interface Sentence2Entity {
  span: string;
  label: string;
  score: number;
  char_start_index: number;
  char_end_index: number;
}

interface SentenceEntities2Obj {
  index: number;
  entities: Sentence2Entity[];
  sentence: string;
}

interface SentenceEntitiesObj {
  index: number;
  entities: SentenceEntity[];
  sentence: string;
}

export const videoRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

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
    .input(z.object({ videoId: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.db.video.delete({
        where: { id: input.videoId },
      });
    }),

  //   update: protectedProcedure
  //     .input(z.object({ videoId: z.string(), name: z.string() }))
  //     .mutation(({ ctx, input }) => {
  //       return ctx.db.video.update({
  //         where: { id: input.videoId, createdBy: { id: ctx.session.user.id } },
  //         data: { name: input.name },
  //       });
  //     }),

  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.video.findUnique({
        where: { id: input.id },
        select: {
          id: true,
          videoId: true,
          title: true,
          publishedAt: true,
          isShortVideo: true,
          thumbnails: true,
          metadata: true,
          description: true,
          channelTitle: true,
          topics: true,
          topicsSummary: true,
          transcriptChaptersSummary: true,
          paragraphs: true,
          transcriptChapters: true,
          channel: {
            select: {
              id: true,
              statistics: true,
              snippet: {
                select: {
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
      });
    }),

  getStringMatchesSentences: protectedProcedure
    .input(z.object({ videoId: z.string() }))
    .query(async ({ ctx, input }) => {
      const videoData = await ctx.db.video.findUnique({
        where: { id: input.videoId },
        select: {
          stringMatchesSentences: true,
        },
      });

      if (!videoData) {
        throw new Error("Video not found");
      }

      const s = videoData.stringMatchesSentences as Prisma.JsonArray;

      const matchesByKey = (s as StringMatchesSentenceObj[]).reduce(
        (acc: any, sentenceObj: StringMatchesSentenceObj) => {
          sentenceObj!.matches.forEach((match) => {
            if (!acc[match.key]) {
              acc[match.key] = [];
            }
            acc[match.key].push({
              sentence: sentenceObj.sentence,
              matches: match,
            });
          });
          return acc;
        },
        {},
      );

      return matchesByKey;
    }),

  getSentenceEntities2: protectedProcedure
    .input(z.object({ videoId: z.string() }))
    .query(async ({ ctx, input }) => {
      const videoData = await ctx.db.video.findUnique({
        where: { id: input.videoId },
        select: {
          sentenceEntities2: true,
        },
      });

      if (!videoData) {
        throw new Error("Video not found");
      }

      const entities =
        videoData.sentenceEntities2 as unknown as SentenceEntities2Obj[];

      const entitiesByLabel = entities.reduce((acc: any, entityObj) => {
        entityObj!.entities.forEach((entity) => {
          if (!acc[entity.label]) {
            acc[entity.label] = [];
          }
          acc[entity.label].push({
            sentence: entityObj.sentence,
            entity: entity,
          });
        });
        return acc;
      }, {});

      return entitiesByLabel;
    }),

  getSentenceEntitiesWithCount: protectedProcedure
    .input(z.object({ videoId: z.string() }))
    .query(async ({ ctx, input }) => {
      const videoData = await ctx.db.video.findUnique({
        where: { id: input.videoId },
        select: {
          sentenceEntities: true,
        },
      });

      if (!videoData) {
        throw new Error("Video not found");
      }

      const entities =
        videoData.sentenceEntities as unknown as SentenceEntitiesObj[];

      const entitiesByLabelWithCount = entities.reduce(
        (acc: any, entityObj: SentenceEntitiesObj) => {
          entityObj!.entities.forEach((entity) => {
            if (!acc[entity.label]) {
              acc[entity.label] = {};
            }
            const text = entity.text;
            if (!acc[entity.label][text]) {
              acc[entity.label][text] = 1;
            } else {
              acc[entity.label][text]++;
            }
          });
          return acc;
        },
        {},
      );

      return entitiesByLabelWithCount;
    }),

  getSentenceEntities2WithCount: protectedProcedure
    .input(z.object({ videoId: z.string() }))
    .query(async ({ ctx, input }) => {
      const videoData = await ctx.db.video.findUnique({
        where: { id: input.videoId },
        select: {
          sentenceEntities2: true,
        },
      });

      if (!videoData) {
        throw new Error("Video not found");
      }

      const entities =
        videoData.sentenceEntities2 as unknown as SentenceEntities2Obj[];

      const entitiesByLabelWithCount = entities.reduce(
        (acc: any, entityObj) => {
          entityObj!.entities.forEach((entity) => {
            if (!acc[entity.label]) {
              acc[entity.label] = {};
            }
            const span = entity.span;
            if (!acc[entity.label][span]) {
              acc[entity.label][span] = 1;
            } else {
              acc[entity.label][span]++;
            }
          });
          return acc;
        },
        {},
      );

      return entitiesByLabelWithCount;
    }),

  // getLatest: protectedProcedure.query(({ ctx }) => {
  //   return ctx.db.video.findFirst({
  //     orderBy: { publishedAt: "desc" },
  //     //   where: { createdBy: { id: ctx.session.user.id } },
  //   });
  // }),

  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.db.video.findMany({
      // where: {
      //   isShortVideo: false,
      // },
      // orderBy: { publishedAt: "desc" },
      // where: { createdBy: { id: ctx.session.user.id } },

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

      take: 100,
    });
  }),

  loadFromDisk: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      try {
        // Using async/await to read file contents
        const fileContents = await fs.promises.readFile(
          `./videoData/${input.id}/data.ysweet`,
        );
        // Convert the binary data to a base64 string
        const base64Data = fileContents.toString("base64");
        return base64Data;
      } catch (error: unknown) {
        // Handle errors, such as file not found
        throw new Error("Error reading file");
        console.error(error);
      }
    }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),

  uploadImage: protectedProcedure
    .input(z.object({ imageData: z.string(), videoId: z.string() }))
    .mutation(async ({ input }) => {
      const { videoId } = input;

      // Decode the base64 image
      const base64Data = input.imageData.replace(
        /^data:image\/png;base64,/,
        "",
      );

      const filename = videoId + ".png";
      const filePath = `./videoData/${videoId}/${filename}`;

      // Write the file
      await new Promise((resolve, reject) => {
        const writeStream = createWriteStream(filePath);
        writeStream.write(base64Data, "base64");
        writeStream.on("finish", resolve);
        writeStream.on("error", reject);
        writeStream.end();
      });

      return { filename };
    }),
});
