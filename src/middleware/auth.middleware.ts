import { HttpStatus, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { isValidObjectId } from 'mongoose';

import { sendResponse } from '@/util/response.util';

export interface JWTPayload extends jwt.JwtPayload {
  id: string;
  type: 'Mahasiwa' | 'Dosen' | 'Admin';
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
        message: 'No token provided!',
      });
    }

    jwt.verify(
      token,
      process.env.JWT_KEY!,
      (err: jwt.VerifyErrors | null, decoded: JWTPayload) => {
        // Check if there's an error
        if (err) return this.catchError(err, res);

        const { id, type, mhsId, dosenId } = decoded;

        // Check if the decoded token is valid
        if (
          !id ||
          !type ||
          !isValidObjectId(id) ||
          (mhsId !== null && !isValidObjectId(mhsId)) ||
          (dosenId !== null && !isValidObjectId(dosenId))
        ) {
          return sendResponse(res, {
            status: HttpStatus.UNAUTHORIZED,
            message: 'Invalid jwt',
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
    let message = 'Unauthorized';

    if (err instanceof jwt.TokenExpiredError) {
      message = 'Access token expired';
    }

    return sendResponse(res, {
      status: HttpStatus.UNAUTHORIZED,
      message,
    });
  }
}
