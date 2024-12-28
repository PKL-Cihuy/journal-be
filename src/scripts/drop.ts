import 'dotenv/config';
import mongoose from 'mongoose';

import {
  DosenModel,
  FakultasModel,
  JournalModel,
  JournalTimelineModel,
  MahasiswaModel,
  PKLModel,
  PKLTimelineModel,
  ProgramStudiModel,
  UserModel,
} from '@/db/schema';
import { validateEnv } from '@/util/validateEnv.util';

async function main() {
  const env = validateEnv(process.env);
  await mongoose.connect(env.DATABASE_URI);

  console.time('Drop');
  console.log('Dropping all collections...');

  await UserModel.deleteMany({});
  await DosenModel.deleteMany({});
  await MahasiswaModel.deleteMany({});
  await ProgramStudiModel.deleteMany({});
  await FakultasModel.deleteMany({});
  await JournalModel.deleteMany({});
  await JournalTimelineModel.deleteMany({});
  await PKLModel.deleteMany({});
  await PKLTimelineModel.deleteMany({});

  console.log('All collections dropped.');
  console.timeEnd('Drop');
}

main()
  .catch(console.error)
  .finally(() => mongoose.disconnect());
