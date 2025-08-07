interface ExpectedArgsLength {
  min: number,
  max: number
}

export const getArguments = (args: string[]): number[] => {
  return args.slice(2).map(a => Number(a));
};

export const validateArguments = (
  args: number[],
  expectedArgsLength: ExpectedArgsLength
): void => {
  if (args.some((n) => Number.isNaN(n))) {
    throw new Error('All arguments must be valid numbers');
  }

  const { min, max } = expectedArgsLength;

  if (args.length < min || args.length > max) {
    const errorMessage =
      min === max
        ? `Exactly ${min} arguments are expected`
        : `Expected from ${min} to ${max} arguments`;

    throw new Error(errorMessage);
  }
};