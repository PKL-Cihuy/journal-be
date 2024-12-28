import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';

import { IPKL } from '@/db/interface';
import { PKL } from '@/db/schema';
import { PKLMessage } from '@/message';
import { Forbidden, NotFound } from '@/util/response.util';

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
   * @throws {NotFound} PKL with id {pklId} not found
   * @throws {Forbidden} User not in PKL
   */
  async getPKLByUserType(
    pklId: string,
    ids: { mhsId?: string; dosenId?: string },
  ) {
    const { mhsId, dosenId } = ids;

    const pkl = await this.getOneOrFail({
      _id: pklId,
    });

    if (
      (mhsId && String(pkl.mahasiswaId) !== mhsId) ||
      (dosenId && String(pkl.koordinatorId) !== dosenId)
    ) {
      throw new Forbidden(PKLMessage.FAIL_USER_NOT_IN_PKL);
    }

    return pkl;
  }
}
