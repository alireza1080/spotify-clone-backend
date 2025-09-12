import z from 'zod';

const currentYear = new Date().getFullYear();

const releaseYearValidatorSchema = z.object({
  releaseYear: z
    .number('Release Year must be a number')
    .min(1900, 'Release Year must be at least 1900')
    .max(currentYear, 'Release Year must be at most ' + currentYear),
});

const releaseYearValidator = (releaseYear: number) => {
  const { success, data, error } = releaseYearValidatorSchema.safeParse({
    releaseYear: releaseYear,
  });
  if (!success) {
    return {
      success: false,
      releaseYear: undefined,
      error: error?.issues[0]?.message,
    };
  }
  return { success: true, releaseYear: data.releaseYear, error: undefined };
};

export { releaseYearValidator };
