import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';

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
  @IsEnum(EPKLStatus)
  @IsNotEmpty()
  status: EPKLStatus;

  @ApiProperty({
    type: String,
    required: false,
  })
  @IsNotEmpty()
  deskripsi: string;
}
