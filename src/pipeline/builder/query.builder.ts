import { faker } from '@faker-js/faker';

import { FacetPipelineBuilder } from './facetPipeline.builder';

// Use as fallback value to match any value
const randomStringFallback = faker.string.sample(8);

export function generateSearchCondition(fieldValue: any) {
  // Replace all special characters with escape character
  const parsedValue = String(fieldValue).replaceAll(
    /[.*+?^${}()|[\]\\]/g,
    '\\$&',
  );

  return fieldValue
    ? { $regex: `(?i)${parsedValue}` }
    : { $ne: randomStringFallback };
}

export function generateNumberSearchCondition(fieldValue: string) {
  try {
    // Parse the value to number
    return fieldValue ? parseInt(fieldValue) : { $ne: randomStringFallback };
  } catch (error) {
    // Catch if the value is not a number
    console.error(error);

    return { $ne: randomStringFallback };
  }
}

export function generateArrayFilter(array: any) {
  if (!array) {
    return { $ne: randomStringFallback };
  }

  const parsedValue = Array.isArray(array) ? array : [array];

  return array ? { $in: parsedValue } : { $ne: randomStringFallback };
}

export function generateArrayFilterInExpr(fieldName: string, array: any[]) {
  fieldName = `$${fieldName}`;
  return array
    ? { $in: [fieldName, array] }
    : { $ne: [fieldName, randomStringFallback] };
}

export function generateSearchConditionInExpr(
  fieldName: string,
  value: string | number,
) {
  fieldName = `$${fieldName}`;
  return value
    ? { $regexMatch: { input: fieldName, regex: `(?i)${value}` } }
    : { $ne: [fieldName, randomStringFallback] };
}

export function setDateQueryInExpr(fieldName: string, requestDate?: number[]) {
  fieldName = `$${fieldName}`;

  if (!requestDate?.length) {
    return { $ne: [fieldName, randomStringFallback] };
  }
  if (requestDate[0] >= 0 && requestDate[1] >= 0) {
    const start = new Date(requestDate[0]);

    const end = new Date(requestDate[1]);
    end.setTime(end.getTime() + 24 * 60 * 60 * 1000 - 1);
    return { $and: [{ $gte: [fieldName, start] }, { $lte: [fieldName, end] }] };
  }
  if (requestDate[0] >= 0) {
    const start = new Date(requestDate[0]);
    const start2 = new Date(requestDate[0]);
    start2.setTime(start2.getTime() + 24 * 60 * 60 * 1000 - 1);

    return {
      $and: [{ $gte: [fieldName, start] }, { $lt: [fieldName, start2] }],
    };
  }
}

export function generateNumberRangeFilter(query: any) {
  if (
    !query ||
    !Array.isArray(query) ||
    query.every((q) => typeof q !== 'number')
  ) {
    return { $ne: randomStringFallback };
  }

  let filter: any = {};
  if (query[0] !== null && query[0] !== undefined) {
    filter = {
      ...filter,
      $gte: query[0],
    };
  }

  if (query[1] !== null && query[1] !== undefined) {
    filter = {
      ...filter,
      $lte: query[1],
    };
  }

  return filter;
}

export function generateMatchQuery(value: any) {
  return value ? { $eq: value } : { $ne: randomStringFallback };
}

export function generateFacetOption(
  shouldReturn: string | boolean,
  labelFieldName: string,
  valueFieldName: string,
  unwindLabel?: string,
) {
  const facet = new FacetPipelineBuilder().match({
    $expr: { $eq: [shouldReturn, true] },
  });

  if (unwindLabel) {
    facet.unwind(unwindLabel);
  }

  facet
    .group({ _id: { label: labelFieldName, value: valueFieldName } })
    .sort({ '_id.label': 1 })
    .replaceRoot({ newRoot: '$_id' });

  return facet.build();
}

export function generateDateQuery(requestDate?: number[]) {
  if (!requestDate?.length) {
    return { $ne: randomStringFallback };
  }

  if (requestDate[0] >= 0 && requestDate[1] >= 0) {
    const start = new Date(requestDate[0]);

    const end = new Date(requestDate[1]);
    end.setTime(end.getTime() + 24 * 60 * 60 * 1000 - 1);
    return {
      $gte: start,
      $lte: end,
    };
  }
  if (requestDate[0] >= 0) {
    const start = new Date(requestDate[0]);
    const start2 = new Date(requestDate[0]);
    start2.setTime(start2.getTime() + 24 * 60 * 60 * 1000 - 1);

    return { $gte: start, $lt: start2 };
  }
}

export function generateRangeQuery(filter?: number[]) {
  if (!filter?.length) {
    return { $ne: randomStringFallback };
  }
  if (typeof filter[0] == 'number' && typeof filter[1] == 'number') {
    return { $gte: filter[0], $lte: filter[1] };
  }
  if (typeof filter[0] == 'number') {
    return { $gte: filter[0] };
  }
  if (typeof filter[1] == 'number') {
    return { $lte: filter[1] };
  }

  // Fallback when none of the conditions are met
  // Ex: both filter[0] and filter[1] are null or undefined
  return { $ne: randomStringFallback };
}
