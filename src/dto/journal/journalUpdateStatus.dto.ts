import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

import { EJournalStatus } from '@/db/interface';

export class JournalUpdateStatusDTO {
  @ApiProperty({
    type: String,
    enum: [EJournalStatus.DITOLAK, EJournalStatus.DITERIMA],
  })
  @IsEnum(
    Object.entries(EJournalStatus).reduce((acc, [key, value]) => {
      // Exclude a few select statuses
      if (value === EJournalStatus.DIPROSES) return acc;

      return { ...acc, [key]: value };
    }, {}),
  )
  @IsNotEmpty()
  status: EJournalStatus;

  @ApiProperty({
    type: String,
    required: false,
  })
  @IsString()
  @IsNotEmpty()
  deskripsi: string;
}
