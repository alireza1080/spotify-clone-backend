import z from 'zod';

const clerkIdValidatorSchema = z.object({
  clerkId: z
    .string('Clerk ID must be a string')
    .trim()
    .min(1, 'Clerk ID is required')
    .regex(/^user_[a-zA-Z0-9]+$/, 'Invalid clerk ID format'),
});

const clerkIdValidator = (clerkId: string) => {
  const { success, data, error } = clerkIdValidatorSchema.safeParse({
    clerkId: clerkId,
  });
  if (!success) {
    return {
      success: false,
      clerkId: undefined,
      error: error?.issues[0]?.message,
    };
  }
  return { success: true, clerkId: data.clerkId, error: undefined };
};

export { clerkIdValidator };
