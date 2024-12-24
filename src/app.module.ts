import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController, PKLController } from './controller';
import {
  Dosen,
  DosenSchema,
  Fakultas,
  FakultasSchema,
  Journal,
  JournalSchema,
  JournalTimeline,
  JournalTimelineSchema,
  Mahasiswa,
  MahasiswaSchema,
  PKL,
  PKLSchema,
  PKLTimeline,
  PKLTimelineSchema,
  ProgramStudi,
  ProgramStudiSchema,
  User,
  UserSchema,
} from './db/schema';
import {
  DosenRepository,
  FakultasRepository,
  JournalRepository,
  JournalTimelineRepository,
  MahasiswaRepository,
  PKLRepository,
  PKLTimelineRepository,
  ProgramStudiRepository,
  UserRepository,
} from './repository';
import { FileService, JournalService, PKLService } from './service';
import { validateConfig } from './util/validateConfig.util';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      validate: validateConfig,
    }),
    // Should already be validated by validateConfig
    MongooseModule.forRoot(process.env.DATABASE_URI as string),
    // Register all model and schema
    MongooseModule.forFeature([
      { name: Dosen.name, schema: DosenSchema },
      { name: Fakultas.name, schema: FakultasSchema },
      { name: Journal.name, schema: JournalSchema },
      { name: JournalTimeline.name, schema: JournalTimelineSchema },
      { name: Mahasiswa.name, schema: MahasiswaSchema },
      { name: PKL.name, schema: PKLSchema },
      { name: PKLTimeline.name, schema: PKLTimelineSchema },
      { name: ProgramStudi.name, schema: ProgramStudiSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [AppController, PKLController],
  providers: [
    DosenRepository,
    FakultasRepository,
    JournalRepository,
    JournalTimelineRepository,
    MahasiswaRepository,
    PKLRepository,
    PKLTimelineRepository,
    ProgramStudiRepository,
    UserRepository,

    PKLService,
    JournalService,
    FileService,
  ],
})
export class AppModule {}
