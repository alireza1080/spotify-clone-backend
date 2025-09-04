import z from 'zod';

const firstNameValidatorSchema = z.object({
  firstName: z
    .string('First Name must be a string')
    .trim()
    .min(1, 'First Name is required')
    .min(2, 'First Name must be at least 2 characters long')
    .max(50, 'First Name must be at most 50 characters long')
    .regex(/^[a-zA-Z\s]+$/, 'First Name must contain only letters and spaces')
    .transform((val) =>
      val
        .toLowerCase()
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
    ),
});

const firstNameValidator = (firstName: string) => {
  const { success, data, error } = firstNameValidatorSchema.safeParse({
    firstName: firstName,
  });
  if (!success) {
    return { success: false, firstName: undefined, error: error.message };
  }
  return { success: true, firstName: data.firstName, error: undefined };
};

export { firstNameValidator };
