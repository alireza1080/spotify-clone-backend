import z from 'zod';

const fullNameValidatorSchema = z.object({
  fullName: z
    .string('Full Name must be a string')
    .trim()
    .min(1, 'Full Name is required')
    .min(2, 'Full Name must be at least 2 characters long')
    .max(50, 'Full Name must be at most 50 characters long')
    .regex(/^[a-zA-Z\s]+$/, 'Full Name must contain only letters and spaces')
    .transform((val) =>
      val
        .toLowerCase()
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
    ),
});

const fullNameValidator = (fullName: string) => {
  const { success, data, error } = fullNameValidatorSchema.safeParse({
    fullName: fullName,
  });
  if (!success) {
    return {
      success: false,
      fullName: undefined,
      error: error?.issues[0]?.message,
    };
  }
  return { success: true, fullName: data.fullName, error: undefined };
};

export { fullNameValidator };