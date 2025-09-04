import z from 'zod';

const lastNameValidatorSchema = z.object({
  lastName: z
    .string('Last Name must be a string')
    .trim()
    .min(1, 'Last Name is required')
    .min(2, 'Last Name must be at least 2 characters long')
    .max(50, 'Last Name must be at most 50 characters long')
    .regex(/^[a-zA-Z\s]+$/, 'Last Name must contain only letters and spaces')
    .transform((val) =>
      val
        .toLowerCase()
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
    ),
});

const lastNameValidator = (lastName: string) => {
  const { success, data, error } = lastNameValidatorSchema.safeParse({
    lastName: lastName,
  });
  if (!success) {
    return { success: false, lastName: undefined, error: error.message };
  }
  return { success: true, lastName: data.lastName, error: undefined };
};

export { lastNameValidator };
