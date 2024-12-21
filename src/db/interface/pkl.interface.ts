import { Types } from 'mongoose';
import { IMahasiswa } from './mahasiswa.interface';
import { IDosen } from './dosen.interface';
import { IFakultas } from './fakultas.interface';
import { IProgramStudi } from './programStudi.interface';

export enum EPKLStatus {
  MENUNGGU_PERSETUJUAN = 'Menunggu Persetujuan',
  PENGAJUAN_DITOLAK = 'Pengajuan Ditolak',
  MENUNGGU_VERIFIKASI = 'Menunggu Verifikasi',
  VERIFIKASI_GAGAL = 'Verifikasi Gagal',
  DITOLAK = 'Ditolak',
  DITERIMA = 'Diterima',
  MULAI_FINALISASI = 'Mulai Finalisasi',
  PROSES_FINALISASI = 'Proses Finalisasi',
  FINALISASI_DITOLAK = 'Finalisasi Ditolak',
  GAGAL = 'Gagal',
  SELESAI = 'Selesai',
}

export interface IPKL {
  /**
   * @property `Unique`, `Index`
   */
  _id?: Types.ObjectId;

  /**
   * @see {@linkcode IMahasiswa._id}
   * @property `Index`
   */
  mahasiswaId: Types.ObjectId;

  /**
   * @see {@linkcode IDosen._id}
   * @property `Index`
   */
  koordinatorId: Types.ObjectId;

  /**
   * @see {@linkcode IFakultas._id}
   * @property `Index`
   */
  fakultasId: Types.ObjectId;

  /**
   * @see {@linkcode IProgramStudi._id}
   * @property `Index`
   */
  prodiId: Types.ObjectId;

  /**
   * @description Nama instansi/organisasi tempat PKL
   */
  namaInstansi: string;

  tanggalMulai: Date;

  tanggalSelesai: Date;

  /**
   * @default EPKLStatus.MENUNGGU_PERSETUJUAN
   */
  status: EPKLStatus;

  /**
   * @property `Nullable`
   */
  approvedAt: Date | null;

  /**
   * @property `Nullable`
   */
  rejectedAt: Date | null;

  /**
   * @property `Nullable`
   */
  rejectedAtSemester: number | null;

  finishedAt: Date | null;

  /**
   * @description Path to file
   * @example 'uploads/dokumen-pkl/{pklId}_dokumen_diterima.pdf'
   */
  dokumenDiterima: string;

  /**
   * @description Path to file
   * @example 'uploads/dokumen-pkl/{pklId}_dokumen_mentor.pdf'
   */
  dokumenMentor: string;

  /**
   * @description Path to file
   * @example 'uploads/dokumen-pkl/{pklId}_dokumen_pimpinan.pdf'
   */
  dokumenPimpinan: string;

  /**
   * @description Path to file
   * @example 'uploads/dokumen-pkl/{pklId}_dokumen_selesai.pdf'
   * @property `Nullable`
   */
  dokumenSelesai: string | null;

  /**
   * @description Path to file
   * @example 'uploads/dokumen-pkl/{pklId}_dokumen_laporan.pdf'
   * @property `Nullable`
   */
  dokumenLaporan: string | null;

  /**
   * @description Path to file
   * @example 'uploads/dokumen-pkl/{pklId}_dokumen_penilaian.pdf'
   * @property `Nullable`
   */
  dokumenPenilaian: string | null;

  createdAt?: Date;

  updatedAt?: Date;
}
