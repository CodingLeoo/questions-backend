import { BAD_REQUEST_STATUS } from './../utils/constants';
import { Request, Response, NextFunction } from 'express';
import { BAD_REQUEST } from 'http-status';


export const isNotEmptyBody = (request: Request, response: Response, next: NextFunction) => {
    if (request.body) {
        const keys = Object.keys(request.body);

        let emptyValues = false;
        keys.forEach((key: string) => {
            if (request.body[key] === null || request.body[key] === '') {
                emptyValues = true;
            }
        })
        if (emptyValues) {
            return response.status(BAD_REQUEST).json({ code: BAD_REQUEST, status: BAD_REQUEST_STATUS });
        } else {
            next();
        }
    } else {
        return response.status(BAD_REQUEST).json({ code: BAD_REQUEST, status: BAD_REQUEST_STATUS });
    }
}