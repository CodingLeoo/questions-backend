import { User, IUser } from './../models/auth.models';
import { BAD_REQUEST_STATUS, SESSION_NOT_FOUND } from './../utils/constants';
import { Request, Response, NextFunction } from 'express';
import { BAD_REQUEST, NOT_FOUND } from 'http-status';


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


export const trackAccess = (request: Request, response: Response, next: NextFunction) => {
    const ssid = request.headers.ssid;

    User.findOne({ session_id: ssid }).populate('role').then((user: IUser) => {
        if (!user) {
            return response.status(NOT_FOUND).json({ code: NOT_FOUND, status: SESSION_NOT_FOUND });
        }
        request.headers.test_permissions = user.role.permission_update_test.toString();
        request.headers.question_permissions = user.role.permission_update_question.toString();
        return next();
    })
}