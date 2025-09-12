import z from 'zod';

const songTitleValidatorSchema = z.object({
  songTitle: z
    .string('Song Title must be a string')
    .trim()
    .min(1, 'Song Title is required')
    .min(2, 'Song Title must be at least 2 characters long')
    .max(50, 'Song Title must be at most 50 characters long')
    .regex(/^[a-zA-Z\s]+$/, 'Song Title must contain only letters and spaces'),
});

const songTitleValidator = (songTitle: string) => {
  const { success, data, error } = songTitleValidatorSchema.safeParse({
    songTitle: songTitle,
  });
  if (!success) {
    return {
      success: false,
      songTitle: undefined,
      error: error?.issues[0]?.message,
    };
  }
  return { success: true, songTitle: data.songTitle, error: undefined };
};

export { songTitleValidator };
