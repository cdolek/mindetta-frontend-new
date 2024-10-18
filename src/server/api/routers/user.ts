import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  // Procedure to update the user's name
  updateName: protectedProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(({ ctx, input }) => {
      return ctx.db.user.update({
        where: { id: ctx.session.user.id },
        data: { name: input.name },
      });
    }),

  updateProfile: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        // openAIKey: z.string().min(1),
        // useGPT4: z.boolean(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.user.update({
        where: { id: ctx.session.user.id },
        data: {
          name: input.name,
          // openAIKey: input.openAIKey,
          // useGPT4: input.useGPT4,
        },
      });
    }),

  // Procedure to update the user's representative image
  updateImage: protectedProcedure
    .input(z.object({ image: z.string().url() }))
    .mutation(({ ctx, input }) => {
      return ctx.db.user.update({
        where: { id: ctx.session.user.id },
        data: { image: input.image },
      });
    }),

  // Procedure to get the current user's details
  getCurrentUser: protectedProcedure.query(({ ctx }) => {
    return ctx.db.user.findUnique({
      where: { id: ctx.session.user.id },
    });
  }),

  // Additional user-related procedures can be added here
});
