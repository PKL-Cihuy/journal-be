import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';

import { IPKL } from '@/db/interface';
import { PKL } from '@/db/schema';
import { NotFound } from '@/util/response.util';

import { BaseRepository } from './base.repository';

@Injectable()
export class PKLRepository extends BaseRepository<IPKL> {
  protected GET_ONE_OR_FAIL_MESSAGE = 'PKL tidak ditemukan';
  protected FIND_OR_FAIL_MESSAGE = 'Satu atau lebih PKL tidak ditemukan';

  constructor(@InjectModel(PKL.name) model: Model<IPKL>) {
    super(model);
  }

  public async getStatus(mahasiswaId: string | Types.ObjectId) {
    const pkl = await this.findOne({ mahasiswaId }, { status: 1 });

    if (!pkl) throw new NotFound(this.GET_ONE_OR_FAIL_MESSAGE);

    return pkl.status;
  }

  /**
   * Get PKL by user type
   *
   * @param {string} pklId PKL id
   * @param {{ mhsId?: string; dosenId?: string }} ids mahasiswaId and dosenId
   *
   * @returns PKL data
   *
   * @throws {NotFound} PKL with id {pklId} not found or does not have access
   */
  async getPKLByUserType(
    pklId: string,
    ids: { mhsId?: string; dosenId?: string },
  ) {
    const { mhsId, dosenId } = ids;

    const q: FilterQuery<IPKL> = {
      _id: pklId,
    };

    if (mhsId) q['mahasiswaId'] = mhsId;
    if (dosenId) q['koordinatorId'] = dosenId;

    return await this.getOneOrFail(q);
  }
}
