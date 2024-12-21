import mongoose from 'mongoose';

export class FacetPipelineBuilder {
  private readonly pipelines: mongoose.PipelineStage.FacetPipelineStage[] = [];

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
  unwind(
    data:
      | string
      | {
          path: string;
          includeArrayIndex?: string;
          preserveNullAndEmptyArrays?: boolean;
        },
  ) {
    if (data) {
      this.pipelines.push({
        $unwind: data,
      });
    }
    return this;
  }

  group(groupData: Record<string, mongoose.AnyExpression>) {
    this.pipelines.push({
      $group: groupData,
    });

    return this;
  }

  replaceRoot(data: { newRoot: any }) {
    if (data) {
      this.pipelines.push({
        $replaceRoot: data,
      });

      return this;
    }
  }

  match(data: mongoose.FilterQuery<any>) {
    if (data) {
      this.pipelines.push({
        $match: data,
      });
    }
    return this;
  }

  sort(data: Record<string, 1 | -1 | mongoose.Expression.Meta>) {
    if (data) {
      this.pipelines.push({
        $sort: data,
      });
    }
    return this;
  }

  skip(data: number) {
    this.pipelines.push({
      $skip: data,
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

  build(): mongoose.PipelineStage.FacetPipelineStage[] {
    return this.pipelines;
  }
}
