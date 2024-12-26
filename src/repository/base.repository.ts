import { Injectable } from '@nestjs/common';
import { CountOptions, DeleteOptions, UpdateOptions } from 'mongodb';
import {
  FilterQuery,
  HydratedDocument,
  InsertManyOptions,
  Model,
  PipelineStage,
  ProjectionType,
  QueryOptions,
  Types,
  UpdateQuery,
} from 'mongoose';

import { NotFound } from '@/util/response.util';

/**
 * Base repository class for CRUD operations.
 *
 * @param T - Interface of the schema.
 */
@Injectable()
export class BaseRepository<T> {
  protected GET_ONE_OR_FAIL_MESSAGE = 'Data tidak ditemukan';
  protected FIND_OR_FAIL_MESSAGE = 'Satu atau lebih data tidak ditemukan';

  constructor(private readonly _model: Model<T>) {}

  async countDocuments(filter: FilterQuery<T>, options?: CountOptions) {
    return await this._model.countDocuments(filter, options).exec();
  }

  async aggregate(pipeline: PipelineStage[]) {
    return await this._model.aggregate(pipeline).exec();
  }

  async find(
    filter: FilterQuery<T> = {},
    projection?: ProjectionType<T>,
    options?: QueryOptions<T>,
  ) {
    return await this._model.find(filter, projection, options).exec();
  }

  async findOne(
    filter: FilterQuery<T> = {},
    projection?: ProjectionType<T>,
    options?: QueryOptions<T>,
  ) {
    return await this._model.findOne(filter, projection, options).exec();
  }

  async create(data: T | T[] | Partial<T> | Partial<T>[]) {
    return await this._model.create(data);
  }

  // NOTE: Prefer using this instead of create for bulk write if performance is a concern.
  // Reference:
  // - https://stackoverflow.com/questions/16726330/mongoose-mongodb-batch-insert/24848148#24848148
  // - https://github.com/Automattic/mongoose/issues/723#issuecomment-178866230
  async insertMany(body: Array<T>, options: InsertManyOptions = {}) {
    return await this._model.insertMany(body, options);
  }

  async updateOne(
    filter: FilterQuery<T>,
    body: UpdateQuery<T>,
    options?: UpdateOptions,
  ) {
    return await this._model.updateOne(filter, body, options);
  }

  async updateMany(
    filter: FilterQuery<T>,
    body: UpdateQuery<T>,
    options?: UpdateOptions,
  ) {
    return await this._model.updateMany(filter, body, options);
  }

  async findOneAndUpdate(
    filter: FilterQuery<T>,
    body: UpdateQuery<T>,
    options?: QueryOptions<T>,
  ) {
    return await this._model.findOneAndUpdate(filter, body, {
      new: true,
      ...options,
    });
  }

  async deleteOne(filter: FilterQuery<T>, options?: DeleteOptions) {
    return await this._model.deleteOne(filter, options);
  }

  async deleteMany(filter: FilterQuery<T>) {
    return await this._model.deleteMany(filter);
  }

  async findOneAndDelete(filter: FilterQuery<T>, options?: QueryOptions<T>) {
    return await this._model.findOneAndDelete(filter, options);
  }

  async getOneOrFail(
    id: string | Types.ObjectId,
    opts?: {
      errorMessage?: string;
      projection?: ProjectionType<T>;
      options?: QueryOptions<T>;
    },
  ): Promise<HydratedDocument<T>>;
  async getOneOrFail(
    filter: FilterQuery<T>,
    opts?: {
      errorMessage?: string;
      projection?: ProjectionType<T>;
      options?: QueryOptions<T>;
    },
  ): Promise<HydratedDocument<T>>;
  async getOneOrFail(
    _data: string | FilterQuery<T>,
    opts?: {
      errorMessage?: string;
      projection?: ProjectionType<T>;
      options?: QueryOptions<T>;
    },
  ): Promise<HydratedDocument<T>> {
    const { errorMessage, projection, options } = opts ?? {};

    let data: HydratedDocument<T> | null;

    if (typeof _data === 'string' || _data instanceof Types.ObjectId) {
      data = await this._model
        .findOne({ _id: _data }, projection, options)
        .exec();
    } else {
      data = await this._model.findOne(_data, projection, options).exec();
    }

    if (!data) {
      throw new NotFound(errorMessage ?? this.GET_ONE_OR_FAIL_MESSAGE);
    }

    return data;
  }

  async findOrFail(
    filter: FilterQuery<T>,
    opts: {
      expectedLength: number;
      errorMessage?: string;
      projection?: ProjectionType<T>;
      options?: QueryOptions<T>;
    },
  ): Promise<HydratedDocument<T>[]>;
  async findOrFail(
    ids: string[] | Types.ObjectId[],
    opts?: {
      expectedLength?: number;
      errorMessage?: string;
      projection?: ProjectionType<T>;
      options?: QueryOptions<T>;
    },
  ): Promise<HydratedDocument<T>[]>;
  async findOrFail(
    idsOrFilter: string[] | Types.ObjectId[] | FilterQuery<T>,
    opts?: {
      expectedLength?: number;
      errorMessage?: string;
      projection?: ProjectionType<T>;
      options?: QueryOptions<T>;
    },
  ): Promise<HydratedDocument<T>[]> {
    const { expectedLength, errorMessage, projection, options } = opts ?? {};

    let data;

    if (Array.isArray(idsOrFilter)) {
      data = await this._model.find(
        { _id: { $in: idsOrFilter } },
        projection,
        options,
      );

      if (data.length !== (expectedLength ?? idsOrFilter.length)) {
        throw new NotFound(errorMessage ?? this.FIND_OR_FAIL_MESSAGE);
      }
    } else {
      data = await this._model.find(idsOrFilter, projection, options);

      if (data.length !== expectedLength) {
        throw new NotFound(errorMessage ?? this.FIND_OR_FAIL_MESSAGE);
      }
    }

    return data;
  }
}
