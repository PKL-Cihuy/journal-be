import { ApiProperty } from '@nestjs/swagger';
import { IsDefined } from 'class-validator';

export class LoginDTO {
  @ApiProperty({ type: String })
  @IsDefined()
  email: string;

  @ApiProperty({ type: String })
  @IsDefined()
  password: string;
}
