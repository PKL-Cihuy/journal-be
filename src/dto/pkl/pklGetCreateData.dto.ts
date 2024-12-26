import { ApiProperty } from '@nestjs/swagger';

//
// Response
//
export class PKLGetCreateDataResponseDTO {
  @ApiProperty({
    type: Object,
    example: {
      _id: '67697c4ece2a4f39e4dce1b1',
      namaLengkap: 'Mahasiswa',
      nim: '4754400587',
      email: 'mhs@mhs.com',
      semester: 2,
      nomorHandphone: '+6276733226044',
    },
  })
  mahasiswa: object;

  @ApiProperty({
    type: Object,
    example: {
      _id: '67697c4ece2a4f39e4dce19e',
      nama: 'Fakultas 2',
      initial: 'F2',
    },
  })
  fakultas: object;

  @ApiProperty({
    type: Object,
    example: {
      _id: '67697c4ece2a4f39e4dce1a8',
      nama: 'Program Studi F2 3',
    },
  })
  programStudi: object;

  @ApiProperty({
    type: Object,
    example: {
      _id: '67697c4ece2a4f39e4dce19a',
      nomorInduk: '8365793752',
      email: 'Paramita.Ardiyanti@yahoo.com',
      namaLengkap: 'Galang Firmansyah',
      nomorHandphone: '+6290808107020',
    },
  })
  koordinator: object;
}
