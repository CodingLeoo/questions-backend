import { IUser } from './../models/auth.models';
import { UNAUTHORIZED } from 'http-status';
import { Request, Response, NextFunction } from 'express';
import { verifyToken } from './../helpers/security.helper';
import { UNAUTHORIZED_STATUS } from './../utils/constants';


export const RequireAuth = (request: Request, response: Response, next: NextFunction) => {
    if (request.headers.authorization) {
        next();
    } else {
        response.status(UNAUTHORIZED).json({ code: UNAUTHORIZED, status: UNAUTHORIZED_STATUS });
    }
}


export const isValidToken = (request: Request, response: Response, next: NextFunction) => {
    const token = request.headers.authorization?.substr(7);
    verifyToken(token).then((user: IUser) => {
        request.headers.ssid = user.session_id;
        next();
    }).catch((err: any) => {
        response.status(UNAUTHORIZED).json({ code: UNAUTHORIZED, status: err.toString() });
    })
}