import z from 'zod';

const albumTitleValidatorSchema = z.object({
  albumTitle: z
    .string('Album Title must be a string')
    .trim()
    .min(1, 'Album Title is required')
    .min(2, 'Album Title must be at least 2 characters long')
    .max(50, 'Album Title must be at most 50 characters long')
    .regex(/^[a-zA-Z\s]+$/, 'Album Title must contain only letters and spaces'),
});

const albumTitleValidator = (albumTitle: string) => {
  const { success, data, error } = albumTitleValidatorSchema.safeParse({
    albumTitle: albumTitle,
  });
  if (!success) {
    return {
      success: false,
      albumTitle: undefined,
      error: error?.issues[0]?.message,
    };
  }
  return { success: true, albumTitle: data.albumTitle, error: undefined };
};

export { albumTitleValidator };
