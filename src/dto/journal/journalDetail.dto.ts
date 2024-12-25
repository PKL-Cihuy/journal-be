import { ApiProperty } from '@nestjs/swagger';

import { EJournalStatus } from '@/db/interface';

//
// Response
//
export class JournalListResponseDTO {
  @ApiProperty({ type: String, example: '676778a37d05098d38b82665' })
  _id: string;

  @ApiProperty({ type: String, example: 'Konten jurnal' })
  deskripsi: string;

  @ApiProperty({
    type: Array,
    example: [
      '/uploads/jurnal/676778a37d05098d38b82665_1.jpg',
      '/uploads/jurnal/676778a37d05098d38b82665_2.pdf',
    ],
  })
  attachments: string[];

  @ApiProperty({ type: String, example: EJournalStatus.DITERIMA })
  status: string;

  @ApiProperty({ type: String, example: '2024-12-02T14:09:51.489Z' })
  tanggalMulai: Date;

  @ApiProperty({ type: String, example: '2024-12-02T14:09:51.489Z' })
  tanggalSelesai: Date;

  @ApiProperty({ type: String, example: '2024-12-02T14:09:51.489Z' })
  createdAt: Date;

  @ApiProperty({ type: String, example: '2024-12-02T14:09:51.489Z' })
  updatedAt: Date;
}
