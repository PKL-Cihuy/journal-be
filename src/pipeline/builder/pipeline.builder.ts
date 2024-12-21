import { SortDirection } from 'mongodb';
import mongoose from 'mongoose';

import { FacetPipelineBuilder } from './facetPipeline.builder';

export class PipelineBuilder<T = any> {
  private readonly pipelines: mongoose.PipelineStage[] = [];

  group(groupData: Record<string, mongoose.AnyExpression>) {
    if (groupData) {
      this.pipelines.push({
        $group: groupData,
      });
    }

    return this;
  }

  match(data: mongoose.FilterQuery<T>) {
    this.pipelines.push({
      $match: data,
    });

    return this;
  }

  lookup(data: {
    from: string;
    as: string;
    localField?: string;
    foreignField?: string;
    pipeline?: Exclude<
      mongoose.PipelineStage,
      mongoose.PipelineStage.Merge | mongoose.PipelineStage.Out
    >[];
    let?: Record<string, any>;
  }) {
    const lookup = {
      $lookup: {
        from: data.from,
        as: data.as,
        foreignField: data.foreignField,
        localField: data.localField,
        pipeline: data.pipeline,
        let: data.let,
      },
    };

    if (!data.pipeline) delete lookup.$lookup.pipeline;
    if (!data.let) delete lookup.$lookup.let;
    if (!data.localField) delete lookup.$lookup.localField;
    if (!data.foreignField) delete lookup.$lookup.foreignField;

    this.pipelines.push(lookup);

    return this;
  }

  addFields(data: Record<string, mongoose.AnyExpression>) {
    this.pipelines.push({
      $addFields: data,
    });

    return this;
  }

  limit(limit: qs.ParsedQs | number | string) {
    if (limit) {
      this.pipelines.push({
        $limit: parseInt(String(limit)),
      });
    }

    return this;
  }

  facet(data: Record<string, mongoose.PipelineStage.FacetPipelineStage[]>) {
    this.pipelines.push({
      $facet: data,
    });

    return this;
  }

  unwind(
    data:
      | string
      | {
          path: string;
          includeArrayIndex?: string;
          preserveNullAndEmptyArrays?: boolean;
        },
  ) {
    this.pipelines.push({
      $unwind: data,
    });

    return this;
  }

  bulkUnwind(
    data:
      | string[]
      | {
          path: string;
          includeArrayIndex?: string;
          preserveNullAndEmptyArrays?: boolean;
        }[],
  ) {
    for (const item of data) {
      this.pipelines.push({
        $unwind: item,
      });
    }

    return this;
  }

  set(data: Record<string, mongoose.AnyExpression>) {
    this.pipelines.push({
      $set: data,
    });

    return this;
  }

  unset(data: string | string[]) {
    this.pipelines.push({
      $unset: data,
    });

    return this;
  }

  replaceRoot(data: { newRoot: any }) {
    this.pipelines.push({
      $replaceRoot: data,
    });

    return this;
  }

  project(data: {
    [field: string]:
      | mongoose.AnyExpression
      | mongoose.Expression
      | mongoose.PipelineStage.Project['$project'];
  }) {
    this.pipelines.push({
      $project: data,
    });

    return this;
  }

  sort(data: Record<string, 1 | -1 | mongoose.Expression.Meta>) {
    this.pipelines.push({
      $sort: data,
    });

    return this;
  }

  build(): mongoose.PipelineStage[] {
    return this.pipelines;
  }

  pagination(pagination: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: SortDirection;
    sortObject?: Record<string, SortDirection>;
  }) {
    const { page, limit, sortBy, sortOrder, sortObject } = pagination;

    this.facet({
      totalRecords: [{ $count: 'total' }],
      // data: facetPipeline,
      data: new FacetPipelineBuilder()
        .sort(
          (sortBy && sortOrder && ({ [sortBy]: sortOrder } as any)) ||
            sortObject || {
              updatedAt: -1,
            },
        )
        .skip((page && limit && (page - 1) * limit) || 0)
        .limit(limit ?? 0)
        .build(),
    });

    this.unwind('$totalRecords');
    this.addFields({ totalRecords: '$totalRecords.total' });

    return this;
  }
}
