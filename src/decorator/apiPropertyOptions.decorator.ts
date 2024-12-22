import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

// NOTE: EXAMPLE USAGE
// export class MyOptionsResponseDTO {
//   @ApiPropertyOptions("My String", "string")
//   stringValue: TOptionsBodyDTO<string>;
//
//   @ApiPropertyOptions("My Boolean", true)
//   booleanValue: TOptionsBodyDTO<boolean>;
//
//   @ApiPropertyOptions("My Number", 7)
//   integerValue: TOptionsBodyDTO<number>;
// }

export type TOptionsBodyDTO<T> = {
  label: string;
  value: T;
}[];

export function ApiPropertyOptions<T>(labelExample: string, valueExample: T) {
  return applyDecorators(
    ApiProperty({
      type: Array,
      example: [
        {
          label: labelExample,
          value: valueExample,
        },
      ],
    }),
  );
}
