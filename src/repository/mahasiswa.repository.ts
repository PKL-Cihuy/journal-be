import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { IMahasiswa } from '@/db/interface';
import { Mahasiswa } from '@/db/schema';

import { BaseRepository } from './base.repository';

@Injectable()
export class MahasiswaRepository extends BaseRepository<IMahasiswa> {
  protected GET_ONE_OR_FAIL_MESSAGE = 'Mahasiswa tidak ditemukan';
  protected FIND_OR_FAIL_MESSAGE = 'Satu atau lebih Mahasiswa tidak ditemukan';

  constructor(@InjectModel(Mahasiswa.name) model: Model<IMahasiswa>) {
    super(model);
  }
}
