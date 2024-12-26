import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

import { EPKLStatus } from '@/db/interface';

//
// Login
//
export class LoginDTO {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  email: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  password: string;
}

export const LoginResponseAdminData = {
  jwt: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3Njk3YzRlY2UyYTRmMzllNGRjZTEyYSIsInR5cGUiOiJBZG1pbiIsImlhdCI6MTczNTEzNzUwNywiZXhwIjoxNzM1MTM4NDA3fQ.Ufqdedg_BdQydmJsVudj1zZRa93Pu8mrUu-ROV4e27w',
  user: {
    fullName: 'Admin',
    type: 'Admin',
  },
};

export const LoginResponseDosenData = {
  jwt: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3Njk3YzRlY2UyYTRmMzllNGRjZTE5MSIsInR5cGUiOiJEb3NlbiIsImRvc2VuSWQiOiI2NzY5N2M0ZWNlMmE0ZjM5ZTRkY2UxOWIiLCJpYXQiOjE3MzUxMzc0NzMsImV4cCI6MTczNTEzODM3M30.ddts0eK0DjTCK2atLoXQiAZRhM4EaNHB8sEk6d05QlY',
  user: {
    fullName: 'Usamah Rina',
    type: 'Dosen',
  },
};

export const LoginResponseMahasiswaData = {
  jwt: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3Njk3YzRlY2UyYTRmMzllNGRjZTEyZSIsInR5cGUiOiJNYWhhc2lzd2EiLCJtaHNJZCI6IjY3Njk3YzRlY2UyYTRmMzllNGRjZTFiMiIsImlhdCI6MTczNTEzNzQ4NiwiZXhwIjoxNzM1MTM4Mzg2fQ.3yV8lsGcOWgJ6enibcSRMiDmR1BN_UTsdQNgpnKprf0',
  user: {
    statusPKL: EPKLStatus.DITERIMA,
    fullName: 'Hariyah Kartika',
    type: 'Mahasiswa',
  },
};
