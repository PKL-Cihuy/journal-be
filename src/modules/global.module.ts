import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

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
  Token,
  TokenSchema,
  User,
  UserSchema,
} from '@/db/schema';
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
} from '@/repository';
import { TokenRepository } from '@/repository/token.repository';
import { validateConfig } from '@/util/validateConfig.util';

@Global()
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
      { name: Token.name, schema: TokenSchema },
    ]),
  ],
  providers: [
    TokenRepository,
    DosenRepository,
    FakultasRepository,
    JournalRepository,
    JournalTimelineRepository,
    MahasiswaRepository,
    PKLRepository,
    PKLTimelineRepository,
    ProgramStudiRepository,
    UserRepository,
  ],
  exports: [
    TokenRepository,
    DosenRepository,
    FakultasRepository,
    JournalRepository,
    JournalTimelineRepository,
    MahasiswaRepository,
    PKLRepository,
    PKLTimelineRepository,
    ProgramStudiRepository,
    UserRepository,
  ],
})
export class GlobalModule {}
