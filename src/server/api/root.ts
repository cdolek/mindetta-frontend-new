import { userRouter } from "~/server/api/routers/user";
import { videoRouter } from "~/server/api/routers/video";
import { videoChannelRouter } from "~/server/api/routers/videoChannel";
import { knowledgeGraphRouter } from "./routers/knowledgeGraph";

import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  video: videoRouter,
  videoChannel: videoChannelRouter,
  user: userRouter,
  knowledgeGraph: knowledgeGraphRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
