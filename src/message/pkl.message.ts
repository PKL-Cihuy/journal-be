export enum PKLMessage {
  SUCCESS_LIST = 'List PKL berhasil didapatkan',
  SUCCESS_DETAIL = 'Detail PKL berhasil didapatkan',
  SUCCESS_TIMELINE = 'Timeline PKL berhasil didapatkan',
  SUCCESS_GET_CREATE_DATA = 'Data pembuatan PKL berhasil didapatkan',
  SUCCESS_CREATE = 'PKL berhasil dibuat',
  SUCCESS_UPDATE = 'PKL berhasil diperbarui',
  SUCCESS_UPDATE_STATUS = 'Status PKL berhasil diperbarui',
  SUCCESS_FINALIZE = 'PKL berhasil di finalisasi',

  FAIL_CREATE_GENERIC = 'Gagal membuat PKL',
  FAIL_UPDATE_GENERIC = 'Gagal memperbarui PKL',
  FAIL_FINALIZE_GENERIC = 'Gagal finalisasi PKL',

  FAIL_CREATE_PKL_NOT_MAHASISWA = 'Hanya mahasiswa yang dapat membuat PKL',
  FAIL_UPDATE_PKL_NOT_MAHASISWA = 'Hanya mahasiswa yang dapat memperbarui PKL',
  FAIL_UPDATE_PKL_STATUS_NOT_DOSEN = 'Hanya dosen yang dapat memperbarui status PKL',
  FAIL_UPDATE_PKL_STATUS_INCORRECT_TRANSITION = 'Transisi status PKL tidak valid',

  FAIL_PKL_FINALIZE_NOT_MAHASISWA = 'Hanya mahasiswa yang dapat finalisasi PKL',
  FAIL_PKL_FINALIZE_INCORRECT_STATUS = 'PKL hanya bisa difinalisasi saat statusnya "Mulai Finalisasi" atau "Finalisasi Ditolak',
  FAIL_PKL_FINALIZE_MISSING_FILES = 'Dokumen finalisasi tidak lengkap',

  FAIL_USER_NOT_IN_PKL = 'PKL hanya bisa diakses oleh mahasiswa dan koordinator yang bersangkutan',

  FAIL_PKL_UPDATE_INCORRECT_STATUS = 'PKL hanya bisa diperbarui saat statusnya "Pengajuan Ditolak" atau "Verifikasi Gagal"',
}
