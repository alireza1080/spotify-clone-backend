import z from 'zod';

const songIdValidatorSchema = z.object({
  songId: z
    .string('Song ID must be a string')
    .trim()
    .min(1, 'Song ID is required')
    .regex(/^[a-fA-F0-9]{24}$/, 'Invalid Song ID format'),
});

const songIdValidator = (songId: string) => {
  const { success, data, error } = songIdValidatorSchema.safeParse({
    songId: songId,
  });
  if (!success) {
    return {
      success: false,
      songId: undefined,
      error: error?.issues[0]?.message,
    };
  }
  return { success: true, songId: data.songId, error: undefined };
};

export { songIdValidator };
