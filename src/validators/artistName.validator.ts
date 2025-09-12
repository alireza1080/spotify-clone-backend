import z from 'zod';

const artistNameValidatorSchema = z.object({
  artistName: z
    .string('Artist Name must be a string')
    .trim()
    .min(1, 'Artist Name is required')
    .min(2, 'Artist Name must be at least 2 characters long')
    .max(50, 'Artist Name must be at most 50 characters long')
    .regex(/^[a-zA-Z\s]+$/, 'Artist Name must contain only letters and spaces')
    .transform((val) =>
      val
        .toLowerCase()
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
    ),
});

const artistNameValidator = (artistName: string) => {
  const { success, data, error } = artistNameValidatorSchema.safeParse({
    artistName: artistName,
  });
  if (!success) {
    return {
      success: false,
      artistName: undefined,
      error: error?.issues[0]?.message,
    };
  }
  return { success: true, artistName: data.artistName, error: undefined };
};

export { artistNameValidator };
