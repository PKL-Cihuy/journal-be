declare namespace Express {
  export interface Request {
    user?: {
      id?: string;
      type?: 'Mahasiwa' | 'Dosen' | 'Admin';
      mhsId?: string;
      dosenId?: string;
    };
  }
}
