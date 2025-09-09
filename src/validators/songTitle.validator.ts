import z from 'zod';

const songTitleValidatorSchema = z.object({
  title: z
    .string('Title must be a string')
    .trim()
    .min(1, 'Title is required')
    .min(2, 'Title must be at least 2 characters long')
    .max(50, 'Title must be at most 50 characters long')
    .regex(/^[a-zA-Z\s]+$/, 'Title must contain only letters and spaces'),
});

const songTitleValidator = (title: string) => {
  const { success, data, error } = songTitleValidatorSchema.safeParse({
    title: title,
  });
  if (!success) {
    return {
      success: false,
      title: undefined,
      error: error?.issues[0]?.message,
    };
  }
  return { success: true, title: data.title, error: undefined };
};

export { songTitleValidator };
