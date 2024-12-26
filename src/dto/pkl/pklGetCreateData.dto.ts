import { ApiProperty } from '@nestjs/swagger';

//
// Response
//
export class PKLGetCreateDataResponseDTO {
  @ApiProperty({
    type: Object,
    example: {
      _id: '67697c4ece2a4f39e4dce1b1',
      userId: '67697c4ece2a4f39e4dce1b1',
      namaLengkap: 'Mahasiswa',
      nim: '4754400587',
      email: 'mhs@mhs.com',
      semester: 2,
      nomorHandphone: '+6276733226044',
    },
  })
  mahasiswa: {
    _id: string;
    userId: string;
    namaLengkap: string;
    nim: string;
    email: string;
    semester: number;
    nomorHandphone: string;
  };

  @ApiProperty({
    type: Object,
    example: {
      _id: '67697c4ece2a4f39e4dce19e',
      nama: 'Fakultas 2',
      initial: 'F2',
    },
  })
  fakultas: {
    _id: string;
    nama: string;
    initial: string;
  };

  @ApiProperty({
    type: Object,
    example: {
      _id: '67697c4ece2a4f39e4dce1a8',
      nama: 'Program Studi F2 3',
    },
  })
  programStudi: {
    _id: string;
    nama: string;
  };

  @ApiProperty({
    type: Object,
    example: {
      _id: '67697c4ece2a4f39e4dce19a',
      userId: '67697c4ece2a4f39e4dce1b1',
      nomorInduk: '8365793752',
      email: 'Paramita.Ardiyanti@yahoo.com',
      namaLengkap: 'Galang Firmansyah',
      nomorHandphone: '+6290808107020',
    },
  })
  koordinator: {
    _id: string;
    userId: string;
    nomorInduk: string;
    email: string;
    namaLengkap: string;
    nomorHandphone: string;
  };
}
