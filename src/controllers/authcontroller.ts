import { Router, Request, Response } from 'express';
import { IUser } from '../models/auth.models';
import { User } from './../models/auth.models';
import { compare, hash } from 'bcrypt';
import { v4 } from 'uuid';
import { UNAUTHORIZED, NOT_FOUND, OK, INTERNAL_SERVER_ERROR, UNPROCESSABLE_ENTITY } from 'http-status';
import { generateToken, refreshToken, invalidateToken } from './../helpers/security.helper';
import { RequireAuth } from './../middlewares/auth.midleware';

export const authRouter: Router = Router();

authRouter.post('/login', (request: Request, response: Response) => {
    const body = request.body;

    User.findOne({ email: body.email }).then((user: IUser) => {
        if (user.session_id) {
            return response.status(UNAUTHORIZED).json({ code: UNAUTHORIZED, status: 'Session initialized , please close the session for request login again.' });
        }
        compare(body.password, user.password, (err, result) => {
            if (err || !result) {
                return response.status(UNAUTHORIZED).json({ code: UNAUTHORIZED, status: 'Authentication failed.' });
            }
            user.session_id = v4();
            user.last_token_date = new Date();
            user.save();

            generateToken({ session_id: user.session_id, email: user.email, last_bearer_date: user.last_token_date }).then((token) => {
                response.status(OK).json({ bearer: token, data: { user_name: user.user_name, email: user.email } });
            }).catch(() => {
                response.status(INTERNAL_SERVER_ERROR).json({ code: INTERNAL_SERVER_ERROR, desc: 'internal_server_error' });
            })
        })
    }).catch((err) => {
        console.log(err);
        response.status(NOT_FOUND).json({ code: NOT_FOUND, status: 'user with parameters sended not found.' });
    })
})


authRouter.post('/signup', (request: Request, response: Response) => {
    const body = request.body;

    User.findOne({ email: body.email }).then((user: IUser) => {
        if (user) {
            response.status(UNPROCESSABLE_ENTITY).json({ code: UNPROCESSABLE_ENTITY, status: 'User exists.' })
        } else {
            hash(body.password, Math.floor(Math.random() * 10)).then((encryptedValue: string) => {
                User.create({ email: body.email, user_name: body.user_name, password: encryptedValue })
                    .then(() => {
                        response.status(OK).json({ code: OK, status: 'released successfully.' });
                    });
            }).catch((err) => {
                response.status(INTERNAL_SERVER_ERROR).json({ code: INTERNAL_SERVER_ERROR, desc: err.toString() });
            })
        }
    });
})

authRouter.get('/refresh', RequireAuth, (request: Request, response: Response) => {
    const token = request.headers.authorization.substr(7);
    refreshToken(token).then((refreshedToken: string) => {
        response.status(OK).json({ bearer: refreshedToken })
    }).catch((err) => {
        response.status(INTERNAL_SERVER_ERROR).json({ code: INTERNAL_SERVER_ERROR, desc: err.toString() });
    })
})

authRouter.delete('/logout', RequireAuth, (request: Request, response: Response) => {
    const token = request.headers.authorization.substr(7);
    invalidateToken(token).then(() => {
        response.status(OK).end();
    }).catch((err) => {
        response.status(INTERNAL_SERVER_ERROR).json({ code: INTERNAL_SERVER_ERROR, desc: err.toString() });
    })
})


