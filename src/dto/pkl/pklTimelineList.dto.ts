import { ApiProperty } from '@nestjs/swagger';

import { EPKLStatus } from '@/db/interface';

//
// Response
//
export class PKLTimelineListResponseDTO {
  @ApiProperty({ type: String, example: '676778a37d05098d38b82665' })
  _id: string;

  @ApiProperty({ type: String, example: EPKLStatus.DITERIMA })
  status: EPKLStatus;

  @ApiProperty({ type: String, example: 'Alasan penolakan' })
  deskripsi: string;

  @ApiProperty({ type: String, example: '2024-12-02T14:09:51.489Z' })
  createdAt: Date;

  @ApiProperty({
    type: Object,
    example: {
      _id: '67697c4ece2a4f39e4dce166',
      email: 'Nilam91@yahoo.co.id',
      type: 'Dosen',
      namaLengkap: 'Uyainah Wulandari',
      nomorHandphone: '+6292780985734',
    },
  })
  user: object;
}
