declare namespace Express {
  export interface Request {
    user?: {
      id?: string;
      type?: 'Mahasiswa' | 'Dosen' | 'Admin';
      mhsId?: string;
      dosenId?: string;
    };
  }
}
