/**
 * Generate examples for `@ApiProperty` or `@ApiPropertyOptional` decorator
 *
 * @param {any[]} allPossibleValues - Array of all possible values
 * @param {boolean} shouldWrapInQuotes - Should wrap each value in quotes or not. Default: true
 *
 * @returns {Record<string, { value: string, summary: string }>} Examples object
 *
 * @example
 * // Works with ApiProperty and ApiPropertyOptional
 * ApiProperty({ examples: apiPropertyGenerateExamplesMultiple(Object.values(MyEnum)) })
 * ApiPropertyOptional({ examples: apiPropertyGenerateExamplesMultiple([true, false], false) })
 * ApiPropertyOptional({ examples: apiPropertyGenerateExamplesMultiple([1, 2, 3], false) })
 */
export function apiPropertyGenerateExamplesMultiple(
  allPossibleValues: any[],
  shouldWrapInQuotes: boolean = true,
): Record<string, { value: string; summary: string }> {
  return {
    _all: {
      value: `[${allPossibleValues
        .map((v) => (shouldWrapInQuotes ? `"${v}"` : `[${v}]`))
        .join(',')}]`,
      summary: 'All',
    },
    _empty: {
      value: '',
      summary: 'Empty',
    },
    ...allPossibleValues.reduce((acc, curr) => {
      return {
        ...acc,
        [curr]: {
          value: shouldWrapInQuotes ? `["${curr}"]` : curr,
          summary: curr,
        },
      };
    }, {}),
  };
}

/**
 * Generate examples for `@ApiProperty` or `@ApiPropertyOptional` decorator
 *
 * @param {any[]} allPossibleValues - Array of all possible values
 * @param {boolean} shouldWrapInQuotes - Should wrap each value in quotes or not. Default: true
 *
 * @returns {Record<string, { value: string, summary: string }>} Examples object
 *
 * @example
 * // Works with ApiProperty and ApiPropertyOptional
 * ApiProperty({ examples: apiPropertyGenerateExamplesSingle(Object.values(MyEnum)) })
 * ApiPropertyOptional({ examples: apiPropertyGenerateExamplesSingle([true, false], false) })
 * ApiPropertyOptional({ examples: apiPropertyGenerateExamplesSingle([1, 2, 3], false) })
 */
export function apiPropertyGenerateExamplesSingle(
  allPossibleValues: any[],
  shouldWrapInQuotes: boolean = true,
): Record<string, { value: string; summary: string }> {
  return {
    _empty: {
      value: '',
      summary: 'Empty',
    },
    ...allPossibleValues.reduce((acc, curr) => {
      return {
        ...acc,
        [curr]: {
          value: shouldWrapInQuotes ? `"${curr}"` : curr,
          summary: curr,
        },
      };
    }, {}),
  };
}
