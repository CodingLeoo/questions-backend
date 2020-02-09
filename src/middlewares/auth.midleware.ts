import { UNAUTHORIZED } from 'http-status';
import { Request, Response, NextFunction } from 'express';


export const RequireAuth = (request: Request, response: Response, next: NextFunction) => {
    if (request.headers.authorization) {
        next();
    } else {
        response.status(UNAUTHORIZED).json({ code: UNAUTHORIZED, status: 'you don´t have access to this resource.' });
    }

}