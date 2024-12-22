import { HttpStatus, Type, applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import {
  ReferenceObject,
  SchemaObject,
} from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

// NOTE: FULL EXAMPLE USAGE
// @Get('/')
// @ApiOperation({ summary: 'My Controller Method' })
// @ApiResponseList(MyListResponseDTO, {
//   description: 'My Custom Description (optional)',
//   message: 'My Custom Message (optional)',
// })
// @ApiResponseNotFound({ message 'Data not found' })
// @ApiResponseBadRequest(
//   { description: 'Description 1', message: 'Bad request reason 1' },
//   { description: 'Description 2', message: 'Bad request reason 2' }, // Description must be unique or it will get replaced by the last one
//   { message: 'Bad request reason 3' }, // Description will use message as fallback if empty
// );
// async myControllerMethod() {}

type TCoreData = {
  _ApiResponseClass: typeof ApiResponse;
  status: number;
};

type TResponseOptions<T extends Type<any>> = {
  responseDTO?: T;
  data?: SchemaObject | ReferenceObject;
  description?: string;
  message?: string;
};

/**
 * Default message and status for response
 *
 * @param data - Response data
 *
 * @returns Default message and status
 */
function defaultMessageAndStatus(data?: TCoreData) {
  switch (data?.status) {
    case HttpStatus.CREATED:
      return {
        description: 'Created',
        message: 'Created',
      };
    case HttpStatus.NOT_FOUND:
      return {
        description: 'Not Found',
        message: 'Not Found',
      };
    case HttpStatus.BAD_REQUEST:
      return {
        description: 'Bad Request',
        message: 'Bad Request',
      };
    case HttpStatus.INTERNAL_SERVER_ERROR:
      return {
        description: 'Internal Server Error',
        message: 'Internal Server Error',
      };
    case HttpStatus.OK:
    default:
      return {
        description: 'OK',
        message: 'Success',
      };
  }
}
/**
 * Generic response decorator
 *
 * @param coreData._ApiResponseClass - Custom ApiResponse class
 * @param coreData.status - Status code for swagger
 * @param opts.data - Custom data schema
 * @param opts.responseDTO - Model schema
 * @param opts.description - Description for swagger
 * @param opts.message - Message inside response body
 *
 * @remarks data and responseDTO are mutually exclusive, data will be prioritized
 */
export function GenericResponse<T extends Type<any>>(
  coreData?: TCoreData,
  ...opts: TResponseOptions<T>[]
): ReturnType<typeof applyDecorators> {
  // Conditionally apply which ApiResponse to use
  const ApiResponseClass = coreData?._ApiResponseClass ?? ApiOkResponse;
  const _default = defaultMessageAndStatus(coreData);

  if (opts.length === 1) {
    const opt = opts[0];
    // Placeholder for response properties
    const responseProperties: Record<string, any> = {
      status: {
        type: 'integer',
        example: coreData?.status ?? HttpStatus.OK,
      },
      message: { type: 'string', example: opt?.message ?? _default.message },
    };

    // Conditionally apply custom data or responseDTO
    if (opt?.data) {
      responseProperties['data'] = opt.data;
    } else if (opt?.responseDTO) {
      responseProperties['data'] = { $ref: getSchemaPath(opt.responseDTO) };
    }

    // Prepare decorators to be applied
    const decoratorsToBeApplied = [
      ApiResponseClass({
        description: opt?.description ?? _default.description,
        schema: {
          title: opt?.responseDTO?.name,
          properties: responseProperties,
        },
      }),
    ];

    // Conditionally apply responseDTO if provided
    if (opt?.responseDTO) {
      decoratorsToBeApplied.push(ApiExtraModels(opt.responseDTO));
    }
    // Finally return and apply all decorators
    return applyDecorators(...decoratorsToBeApplied);
  } else {
    // Prepare examples for multiple response
    const examples: Record<string, any> = {};

    // Loop through each data and add to examples
    opts.forEach((opt) => {
      const exampleKey = opt?.description ?? opt?.message ?? 'default';
      examples[exampleKey] = {
        value: {
          statusCode: coreData?.status ?? HttpStatus.OK,
          message: opt.message ?? _default.message,
        },
      };
    });

    // Return and apply decorators
    return applyDecorators(
      ApiResponseClass({
        description: _default.description,
        content: {
          'application/json': {
            examples,
          },
        },
      }),
    );
  }
}

// NOTE: EXAMPLE USAGE
// @Get('/')
// @ApiOperation({ summary: 'My Controller Method' })
// @ApiResponsePaginated(MyListResponseDTO, {
//   description: 'My Custom Description (optional)',
//   message: 'My Custom Message (optional)',
// })
// async myControllerMethod() {}
export function ApiResponsePaginated<T extends Type<any>>(
  responseDTO: T,
  opts?: Pick<TResponseOptions<T>, 'description' | 'message'>,
) {
  return GenericResponse(
    {
      _ApiResponseClass: ApiOkResponse,
      status: HttpStatus.OK,
    },
    {
      data: {
        type: 'object',
        properties: {
          totalRecords: { type: 'integer', example: 1 },
          data: {
            type: 'array',
            items: { $ref: getSchemaPath(responseDTO) },
          },
        },
      },
      responseDTO,
      ...opts,
    },
  );
}

// NOTE: EXAMPLE USAGE
// @Get('/')
// @ApiOperation({ summary: 'My Controller Method' })
// @ApiResponseList(MyListResponseDTO, {
//   description: 'My Custom Description (optional)',
//   message: 'My Custom Message (optional)',
// })
// async myControllerMethod() {}
export function ApiResponseList<T extends Type<any>>(
  responseDTO: T,
  opts?: Pick<TResponseOptions<T>, 'description' | 'message'>,
) {
  return GenericResponse(
    {
      _ApiResponseClass: ApiOkResponse,
      status: HttpStatus.OK,
    },
    {
      data: {
        type: 'array',
        items: { $ref: getSchemaPath(responseDTO) },
      },
      responseDTO,
      ...opts,
    },
  );
}

// NOTE: SEE ALSO
// - ApiPropertyOptions: src/decorators/apiPropertyOptions.decorator.ts
// - TOptionsBodyDTO: src/decorators/apiPropertyOptions.decorator.ts

// NOTE: EXAMPLE USAGE
// @Get('/options')
// @ApiOperation({ summary: 'My Controller Method' })
// @ApiResponseOptions(MyOptionsResponseDTO, {
//   description: 'My Custom Description (optional)',
//   message: 'My Custom Message (optional)',
// })
// async myControllerMethod() {}
export function ApiResponseOptions<T extends Type<any>>(
  responseDTO: T,
  opts?: Pick<TResponseOptions<T>, 'description' | 'message'>,
) {
  return GenericResponse(
    {
      _ApiResponseClass: ApiOkResponse,
      status: HttpStatus.OK,
    },
    {
      responseDTO,
      ...opts,
    },
  );
}

// CUSTOM RESPONSE DECORATORS
// Description and message should be the primary usage
// But added support for custom data and responseDTO for rare cases
//
// 2xx
//
export function ApiResponseOk<T extends Type<any>>(
  ...opts: TResponseOptions<T>[]
) {
  return GenericResponse(
    {
      _ApiResponseClass: ApiOkResponse,
      status: HttpStatus.OK,
    },
    ...opts,
  );
}

export function ApiResponseCreated<T extends Type<any>>(
  ...opts: TResponseOptions<T>[]
) {
  return GenericResponse(
    {
      _ApiResponseClass: ApiCreatedResponse,
      status: HttpStatus.CREATED,
    },
    ...opts,
  );
}

//
// 4xx
//
export function ApiResponseNotFound<T extends Type<any>>(
  ...opts: TResponseOptions<T>[]
) {
  return GenericResponse(
    {
      _ApiResponseClass: ApiNotFoundResponse,
      status: HttpStatus.NOT_FOUND,
    },
    ...opts,
  );
}

export function ApiResponseBadRequest<T extends Type<any>>(
  ...opts: TResponseOptions<T>[]
) {
  return GenericResponse(
    {
      _ApiResponseClass: ApiBadRequestResponse,
      status: HttpStatus.BAD_REQUEST,
    },
    ...opts,
  );
}

//
// 5xx
//
export function ApiResponseInternalServerError<T extends Type<any>>(
  ...opts: TResponseOptions<T>[]
) {
  return GenericResponse(
    {
      _ApiResponseClass: ApiInternalServerErrorResponse,
      status: HttpStatus.INTERNAL_SERVER_ERROR,
    },
    ...opts,
  );
}
