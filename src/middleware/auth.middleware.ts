import { HttpStatus, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { isValidObjectId } from 'mongoose';

import { AuthMessage } from '@/message';
import { sendResponse } from '@/util/response.util';

export interface JWTPayload extends jwt.JwtPayload {
  id: string;
  type: 'Mahasiswa' | 'Dosen' | 'Admin';
  mhsId: string;
  dosenId: string;
}

export class AuthMiddleware implements NestMiddleware {
  public use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split(' ')[1];
    const bearer = req.headers.authorization?.split(' ')[0];

    if (!token || bearer !== 'Bearer') {
      return sendResponse(res, {
        status: HttpStatus.UNAUTHORIZED,
        message: AuthMessage.NO_TOKEN_PROVIDED,
      });
    }

    jwt.verify(
      token,
      process.env.JWT_SECRET!,
      (err: jwt.VerifyErrors | null, decoded: JWTPayload) => {
        // Check if there's an error
        if (err) return this.catchError(err, res);

        const { id, type, mhsId, dosenId } = decoded;

        // Check if the decoded token is valid
        if (
          !id ||
          !type ||
          !isValidObjectId(id) ||
          (mhsId && !isValidObjectId(mhsId)) ||
          (dosenId && !isValidObjectId(dosenId))
        ) {
          return sendResponse(res, {
            status: HttpStatus.UNAUTHORIZED,
            message: AuthMessage.INVALID_JWT,
          });
        }

        // Embed the user data to the request
        req.user = {
          id: id,
          type: type,
          mhsId: mhsId ?? null,
          dosenId: dosenId ?? null,
        };

        next();
      },
    );
  }

  private catchError(err: jwt.VerifyErrors, res: Response) {
    let message = AuthMessage.UNAUTHORIZED;

    if (err instanceof jwt.TokenExpiredError) {
      message = AuthMessage.ACCESS_TOKEN_EXPIRED;
    }

    return sendResponse(res, {
      status: HttpStatus.UNAUTHORIZED,
      message,
    });
  }
}
