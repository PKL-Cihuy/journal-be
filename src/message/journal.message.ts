export enum JournalMessage {
  SUCCESS_LIST = 'List jurnal berhasil didapatkan',
  SUCCESS_DETAIL = 'Detail jurnal berhasil didapatkan',
  SUCCESS_TIMELINE = 'Timeline jurnal berhasil didapatkan',
  SUCCESS_CREATE = 'Jurnal berhasil dibuat',
  SUCCESS_UPDATE = 'Jurnal berhasil diperbarui',
  SUCCESS_UPDATE_STATUS = 'Status jurnal berhasil diperbarui',

  FAIL_CREATE_GENERIC = 'Gagal membuat jurnal',
  FAIL_UPDATE_GENERIC = 'Gagal memperbarui jurnal',

  FAIL_CREATE_JOURNAL_NOT_MAHASISWA = 'Hanya mahasiswa yang dapat membuat jurnal',
  FAIL_UPDATE_JOURNAL_NOT_MAHASISWA = 'Hanya mahasiswa yang dapat memperbarui jurnal',
  FAIL_CREATE_JOURNAL_NO_ATTACHMENT = 'Jurnal harus memiliki lampiran',
  FAIL_UPDATE_JOURNAL_STATUS_NOT_DOSEN = 'Hanya dosen yang dapat memperbarui status jurnal',

  FAIL_CREATE_JOURNAL_INCORRECT_STATUS = "PKL harus berstatus 'Diterima' untuk membuat jurnal",
  FAIL_UPDATE_JOURNAL_INCORRECT_STATUS = "Hanya jurnal berstatus 'Ditolak' yang dapat diperbarui",
  FAIL_UPDATE_PKL_STATUS_INCORRECT_TRANSITION = 'Transisi status jurnal tidak valid',
}
