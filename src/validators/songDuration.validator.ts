import z from 'zod';

const songDurationValidatorSchema = z.object({
  duration: z
    .number('Duration must be a number')
    .min(1, 'Duration must be at least 1 second')
    .max(1000, 'Duration must be at most 1000 seconds'),
});

const songDurationValidator = (duration: number) => {
  const { success, data, error } = songDurationValidatorSchema.safeParse({
    duration: duration,
  });
  if (!success) {
    return {
      success: false,
      duration: undefined,
      error: error?.issues[0]?.message,
    };
  }

  return { success: true, duration: data.duration, error: undefined };
};

export { songDurationValidator };