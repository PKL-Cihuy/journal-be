import { Types } from 'mongoose';
import 'reflect-metadata';

const parseQueryMetaDataKey = Symbol('parseQuery');

export type ParseQueryType =
  | 'string'
  | 'int'
  | 'boolean'
  | 'json'
  | 'range'
  | 'objectId'
  | 'objectIdArr';

export const ParseQuery = (type: ParseQueryType) => {
  return Reflect.metadata(parseQueryMetaDataKey, type);
};

export class QueryParser {
  private static parseValue(type: ParseQueryType, value: any): any {
    if (type === 'string') {
      return value as string;
    }

    if (type === 'int') {
      return parseInt(value as string);
    }

    if (type === 'boolean') {
      return value === 'true';
    }

    if (type === 'json') {
      return JSON.parse(value as string);
    }

    if (type === 'range') {
      const parsedArr: string[] = JSON.parse(value as string);
      return parsedArr.map((s) => parseInt(s));
    }

    if (type === 'objectId') {
      return new Types.ObjectId((value as string).replace(/\W/g, ''));
    }

    if (type === 'objectIdArr') {
      const parsedArr: string[] = JSON.parse(value as string);
      return parsedArr.map((s) => new Types.ObjectId(s));
    }
  }

  static parseQuery(source: any): any {
    const target: any = {};
    for (const key in source) {
      if (source.hasOwnProperty(key)) {
        const parseQueryMetaData: ParseQueryType = Reflect.getMetadata(
          parseQueryMetaDataKey,
          source,
          key,
        );

        const value = source[key];
        target[key] = this.parseValue(parseQueryMetaData, value);
      }
    }
    return target;
  }
}
