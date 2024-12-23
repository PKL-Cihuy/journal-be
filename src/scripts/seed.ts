import { fakerID_ID as fk } from '@faker-js/faker';
import * as bcrypt from 'bcrypt';
import 'dotenv/config';
import 'minimist-lite';
import mongoose from 'mongoose';

import {
  EJournalStatus,
  EPKLStatus,
  EUserType,
  IDosen,
  IFakultas,
  IJournal,
  IJournalTimeline,
  IMahasiswa,
  IPKL,
  IPKLTimeline,
  IProgramStudi,
  IUser,
} from '@/db/interface';
import {
  DosenDocument,
  DosenModel,
  FakultasModel,
  JournalModel,
  JournalTimelineModel,
  MahasiswaDocument,
  MahasiswaModel,
  PKLModel,
  PKLTimelineModel,
  ProgramStudiModel,
  UserDocument,
  UserModel,
} from '@/db/schema';
import { validateConfig } from '@/util/validateConfig.util';

const argv = process.argv.slice(2);
const isConst = argv.includes('--const');

if (isConst) fk.seed(123);

const TOTAL_USER = 100;
const USER_DOSEN_CHANCE = 0.1;

const TOTAL_FAKULTAS = 3;
const TOTAL_PRODI = 5;

const MAHASISWA_MAX_PKL = 3;
const PKL_MAX_JOURNAL = 24;

enum EPKLStatusCategory {
  PENDING = 'PENDING',
  REJECTED = 'REJECTED',
  ONGOING = 'ONGOING',
  FAILED = 'FAILED',
  FINISHED = 'FINISHED',
}

function generatePhoneNumber() {
  return fk.phone.number({ style: 'international' });
}

function generatePKLStatus() {
  return fk.helpers.arrayElement(Object.values(EPKLStatus));
}

function determineEPKLStatusCategory(status: EPKLStatus): EPKLStatusCategory {
  switch (status) {
    case EPKLStatus.MENUNGGU_PERSETUJUAN:
    case EPKLStatus.MENUNGGU_VERIFIKASI:
    case EPKLStatus.VERIFIKASI_GAGAL:
    case EPKLStatus.PENGAJUAN_DITOLAK:
      return EPKLStatusCategory.PENDING;
    case EPKLStatus.DITOLAK:
      return EPKLStatusCategory.REJECTED;
    case EPKLStatus.DITERIMA:
    case EPKLStatus.MULAI_FINALISASI:
    case EPKLStatus.PROSES_FINALISASI:
    case EPKLStatus.FINALISASI_DITOLAK:
      return EPKLStatusCategory.ONGOING;
    case EPKLStatus.GAGAL:
      return EPKLStatusCategory.FAILED;
    case EPKLStatus.SELESAI:
    default:
      return EPKLStatusCategory.FINISHED;
  }
}

function generateApprovedAt(statusCategory: EPKLStatusCategory) {
  switch (statusCategory) {
    case EPKLStatusCategory.ONGOING:
    case EPKLStatusCategory.FINISHED:
    case EPKLStatusCategory.FAILED:
      return fk.date.recent();
    case EPKLStatusCategory.REJECTED:
    case EPKLStatusCategory.PENDING:
    default:
      return null;
  }
}

function generateFinalDocuments(statusCategory: EPKLStatusCategory) {
  switch (statusCategory) {
    case EPKLStatusCategory.ONGOING:
    case EPKLStatusCategory.FINISHED:
    case EPKLStatusCategory.FAILED:
      return fk.system.filePath();
    case EPKLStatusCategory.REJECTED:
    case EPKLStatusCategory.PENDING:
    default:
      return null;
  }
}

function generateRejectedAtSemester(
  statusCategory: EPKLStatusCategory,
  semester: number,
) {
  if (statusCategory === EPKLStatusCategory.REJECTED) {
    return fk.number.int({ min: 1, max: semester });
  }
  return null;
}

function generateRejectedAtDate(statusCategory: EPKLStatusCategory) {
  if (statusCategory === EPKLStatusCategory.REJECTED) {
    return fk.date.recent();
  }
  return null;
}

async function main() {
  validateConfig(process.env);
  await mongoose.connect(process.env.DATABASE_URI as string);

  console.time('Seed');
  if (isConst) {
    console.log('Seeding with reproducible data');

    const userExist = await UserModel.findOne({}, { limit: 1 });

    if (userExist) {
      console.log(
        'Data already exist, skipping seed. Run db:seed:random to seed with random data or drop the database first using db:drop.',
      );
      return;
    }
  } else {
    console.log('Seeding with random data');
  }

  //
  // USER SEED START
  //
  console.time('Seed User');
  console.log('Seeding User...');

  const preDefUserExist = await UserModel.countDocuments({
    $or: [
      { email: 'admin@admin.com' },
      { email: 'dosen@dosen.com' },
      { email: 'mhs@mhs.com' },
    ],
  });

  let defUser: UserDocument[] = [];
  const password = await bcrypt.hash('pwd123', 10);
  if (!preDefUserExist) {
    // Insert predefined User for easy testing
    defUser = await UserModel.insertMany([
      {
        email: 'admin@admin.com',
        password: password,
        namaLengkap: 'Admin',
        nomorHandphone: generatePhoneNumber(),
        type: EUserType.ADMIN,
      },
      {
        email: 'dosen@dosen.com',
        password: password,
        namaLengkap: 'Dosen',
        nomorHandphone: generatePhoneNumber(),
        type: EUserType.DOSEN,
      },
      {
        email: 'mhs@mhs.com',
        password: password,
        namaLengkap: 'Mahasiswa',
        nomorHandphone: generatePhoneNumber(),
        type: EUserType.MAHASISWA,
      },
    ]);
  } else {
    console.log(
      'Predefined user already exist, skipping predefined user seeding',
    );
  }

  // Insert randomly generated User for population
  const genUser = await UserModel.insertMany(
    Array.from({ length: TOTAL_USER }, () => {
      const type = fk.datatype.boolean(USER_DOSEN_CHANCE)
        ? EUserType.DOSEN
        : EUserType.MAHASISWA;

      return {
        email: fk.internet.email(),
        password: password,
        namaLengkap: fk.person.fullName(),
        nomorHandphone: generatePhoneNumber(),
        type,
      } as IUser;
    }),
  );
  const users: UserDocument[] = [...defUser, ...genUser];

  console.timeEnd('Seed User');
  //
  // USER SEED END
  //

  //
  // DOSEN SEED START
  //
  console.time('Seed Dosen');
  console.log('Seeding Dosen...');

  const dosens = await DosenModel.insertMany(
    users
      .filter((user) => user.type === EUserType.DOSEN)
      .map((user) => {
        return {
          userId: user._id,
          nomorInduk: String(
            fk.number.int({ min: 1000000000, max: 9999999999 }),
          ),
        } as IDosen;
      }),
  );

  console.timeEnd('Seed Dosen');
  //
  // DOSEN SEED END
  //

  //
  // FAKULTAS SEED START
  //
  console.time('Seed Fakultas');
  console.log('Seeding Fakultas...');

  const fakultas = await FakultasModel.insertMany(
    Array.from({ length: TOTAL_FAKULTAS }, (_, i) => {
      return {
        nama: `Fakultas ${i + 1}`,
        initial: `F${i + 1}`,
      } as IFakultas;
    }),
  );

  console.timeEnd('Seed Fakultas');
  //
  // FAKULTAS SEED END
  //

  //
  // PROGRAM STUDI SEED START
  //
  console.time('Seed Program Studi');
  console.log('Seeding Program Studi...');

  const prodi = await ProgramStudiModel.insertMany(
    fakultas.flatMap((fakultas) =>
      Array.from({ length: TOTAL_PRODI }, (_, i) => {
        return {
          fakultasId: fakultas._id,
          kaprodiId: fk.helpers.arrayElement(dosens)._id,
          nama: `Program Studi ${fakultas.initial} ${i + 1}`,
        } as IProgramStudi;
      }),
    ),
  );

  console.timeEnd('Seed Program Studi');
  //
  // PROGRAM STUDI SEED END
  //

  //
  // MAHASISWA SEED START
  //
  console.time('Seed Mahasiswa');
  console.log('Seeding Mahasiswa...');

  const mahasiswa = await MahasiswaModel.insertMany(
    users
      .filter((user) => user.type === EUserType.MAHASISWA)
      .map((user) => {
        return {
          userId: user._id,
          fakultasId: fk.helpers.arrayElement(fakultas)._id,
          prodiId: fk.helpers.arrayElement(prodi)._id,
          nim: String(fk.number.int({ min: 1000000000, max: 9999999999 })),
          semester: fk.number.int({ min: 1, max: 8 }),
        } as IMahasiswa;
      }),
  );

  console.timeEnd('Seed Mahasiswa');
  //
  // MAHASISWA SEED END
  //

  //
  // PKL SEED START
  //
  console.time('Seed PKL');
  console.log('Seeding PKL...');

  const pkl = await PKLModel.insertMany(
    mahasiswa.flatMap((mhs) => {
      return Array.from(
        { length: fk.number.int({ max: MAHASISWA_MAX_PKL }) },
        () => {
          const status = generatePKLStatus();
          const statusCategory = determineEPKLStatusCategory(status);
          return {
            mahasiswaId: mhs._id,
            koordinatorId: fk.helpers.arrayElement(dosens)._id,
            fakultasId: mhs.fakultasId,
            prodiId: mhs.prodiId,
            namaInstansi: fk.company.name(),
            tanggalMulai: fk.date.recent(),
            tanggalSelesai: fk.date.future(),
            status: status,
            approvedAt: generateApprovedAt(statusCategory),
            rejectedAt: generateRejectedAtDate(statusCategory),
            rejectedAtSemester: generateRejectedAtSemester(
              statusCategory,
              mhs.semester,
            ),
            finishedAt:
              statusCategory === EPKLStatusCategory.FINISHED
                ? fk.date.recent()
                : null,
            dokumenDiterima: fk.system.filePath(),
            dokumenMentor: fk.system.filePath(),
            dokumenPimpinan: fk.system.filePath(),
            dokumenSelesai: generateFinalDocuments(statusCategory),
            dokumenLaporan: generateFinalDocuments(statusCategory),
            dokumenPenilaian: generateFinalDocuments(statusCategory),
          } as IPKL;
        },
      );
    }),
  );

  console.timeEnd('Seed PKL');
  //
  // PKL SEED END
  //

  //
  // PKL TIMELINE SEED START
  //
  console.time('Seed PKL Timeline');
  console.log('Seeding PKL Timeline...');

  await PKLTimelineModel.insertMany(
    pkl.flatMap((pkl) => {
      const userPick = fk.helpers.arrayElement([
        { id: pkl.mahasiswaId, type: EUserType.MAHASISWA },
        { id: pkl.koordinatorId, type: EUserType.DOSEN },
        { id: null, type: null },
      ]);

      let user: MahasiswaDocument | DosenDocument | null;
      if (userPick.type === EUserType.MAHASISWA) {
        user = mahasiswa.find((mhs) => mhs._id.equals(userPick.id))!;
      } else if (userPick.type === EUserType.DOSEN) {
        user = dosens.find((dosen) => dosen._id.equals(userPick.id))!;
      } else {
        user = null;
      }

      return {
        pklId: pkl._id,
        userId: user ? user.userId : null,
        deskripsi: fk.lorem.sentence(),
        status: fk.helpers.arrayElement(Object.values(EPKLStatus)),
      } as IPKLTimeline;
    }),
  );

  console.timeEnd('Seed PKL Timeline');
  //
  // PKL TIMELINE SEED END
  //

  //
  // JOURNAL SEED START
  //
  console.time('Seed Journal');
  console.log('Seeding Journal...');

  const journal = await JournalModel.insertMany(
    pkl
      // Filter out PKL with status that hasn't been approved
      .filter(
        (pkl) =>
          determineEPKLStatusCategory(pkl.status) !==
            EPKLStatusCategory.PENDING &&
          determineEPKLStatusCategory(pkl.status) !==
            EPKLStatusCategory.REJECTED,
      )
      .flatMap((pkl) => {
        return Array.from(
          { length: fk.number.int({ max: PKL_MAX_JOURNAL }) },
          () => {
            return {
              pklId: pkl._id,
              status: fk.helpers.arrayElement(Object.values(EJournalStatus)),
              konten: fk.lorem.paragraph(),
              attachments: [fk.system.filePath()],
              tanggalMulai: fk.date.recent(),
              tanggalSelesai: fk.date.recent(),
            } as IJournal;
          },
        );
      }),
  );

  console.timeEnd('Seed Journal');
  //
  // JOURNAL SEED END
  //

  //
  // JOURNAL TIMELINE SEED START
  //
  console.time('Seed Journal Timeline');
  console.log('Seeding Journal Timeline...');

  await JournalTimelineModel.insertMany(
    journal.flatMap((journal) => {
      const _pkl = pkl.find((pkl) => pkl._id.equals(journal.pklId));

      const userPick = fk.helpers.arrayElement([
        { id: _pkl!.mahasiswaId, type: EUserType.MAHASISWA },
        { id: _pkl!.koordinatorId, type: EUserType.DOSEN },
      ]);

      let user: MahasiswaDocument | DosenDocument;
      if (userPick.type === EUserType.MAHASISWA) {
        user = mahasiswa.find((mhs) => mhs._id.equals(userPick.id))!;
      } else {
        user = dosens.find((dosen) => dosen._id.equals(userPick.id))!;
      }

      return {
        journalId: journal._id,
        userId: user.userId,
        deskripsi: fk.lorem.sentence(),
        status: fk.helpers.arrayElement(Object.values(EJournalStatus)),
      } as IJournalTimeline;
    }),
  );

  console.timeEnd('Seed Journal Timeline');
  //
  // JOURNAL TIMELINE SEED END
  //

  console.log('Seeding completed');
  console.timeEnd('Seed');
}

main()
  .catch(console.error)
  .finally(() => mongoose.disconnect());
