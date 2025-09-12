import z from 'zod';

const albumIdValidatorSchema = z.object({
  albumId: z
    .string('Album ID must be a string')
    .trim()
    .min(1, 'Album ID is required')
    .regex(/^[a-fA-F0-9]{24}$/, 'Invalid Album ID format'),
});

const albumIdValidator = (albumId: string) => {
  const { success, data, error } = albumIdValidatorSchema.safeParse({
    albumId: albumId,
  });
  if (!success) {
    return {
      success: false,
      albumId: undefined,
      error: error?.issues[0]?.message,
    };
  }
  return { success: true, albumId: data.albumId, error: undefined };
};

export { albumIdValidator };
