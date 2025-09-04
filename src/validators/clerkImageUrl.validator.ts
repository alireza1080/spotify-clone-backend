import z from 'zod';

const clerkImageUrlValidatorSchema = z.object({
  imageUrl: z
    .string('Clerk Image URL must be a string')
    .min(1, 'Clerk Image URL is required')
    .url('Clerk Image URL must be a valid URL'),
});

const clerkImageUrlValidator = (imageUrl: string) => {
  const { success, data, error } = clerkImageUrlValidatorSchema.safeParse({
    imageUrl: imageUrl.trim(),
  });

  if (!success) {
    return { success: false, imageUrl: undefined, error: error.message };
  }
  return { success: true, imageUrl: data.imageUrl, error: undefined };
};

export { clerkImageUrlValidator };
