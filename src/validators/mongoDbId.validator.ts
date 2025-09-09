import z from 'zod';

const mongoDbIdValidatorSchema = z.object({
  mongoDbId: z
    .string('MongoDB ID must be a string')
    .trim()
    .min(1, 'MongoDB ID is required')
    .regex(/^[a-fA-F0-9]{24}$/, 'Invalid MongoDB ID format'),
});

const mongoDbIdValidator = (mongoDbId: string) => {
  const { success, data, error } = mongoDbIdValidatorSchema.safeParse({
    mongoDbId: mongoDbId,
  });
  if (!success) {
    return {
      success: false,
      mongoDbId: undefined,
      error: error?.issues[0]?.message,
    };
  }
  return { success: true, mongoDbId: data.mongoDbId, error: undefined };
};

export { mongoDbIdValidator };
