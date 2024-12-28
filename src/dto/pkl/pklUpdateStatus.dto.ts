import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

import { EPKLStatus } from '@/db/interface';

export class PKLUpdateStatusDTO {
  @ApiProperty({
    type: String,
    enum: [
      // EPKLStatus.MENUNGGU_PERSETUJUAN,
      EPKLStatus.PENGAJUAN_DITOLAK,
      EPKLStatus.MENUNGGU_VERIFIKASI,
      EPKLStatus.VERIFIKASI_GAGAL,
      EPKLStatus.DITOLAK,
      EPKLStatus.DITERIMA,
      // EPKLStatus.MULAI_FINALISASI,
      EPKLStatus.PROSES_FINALISASI,
      EPKLStatus.FINALISASI_DITOLAK,
      EPKLStatus.GAGAL,
      EPKLStatus.SELESAI,
    ],
  })
  @IsEnum(
    Object.entries(EPKLStatus).reduce((acc, [key, value]) => {
      // Exclude a few select statuses
      if (
        value === EPKLStatus.MENUNGGU_PERSETUJUAN ||
        value === EPKLStatus.MULAI_FINALISASI
      )
        return acc;

      return { ...acc, [key]: value };
    }, {}),
  )
  @IsNotEmpty()
  status: EPKLStatus;

  @ApiProperty({
    type: String,
    required: false,
  })
  @IsString()
  @IsNotEmpty()
  deskripsi: string;
}
