import { Role, IRole } from './../models/role.model';
import { Router, Request, Response } from 'express';
import { User, IUser } from './../models/auth.models';
import { compare, hash } from 'bcrypt';
import { v4 } from 'uuid';
import { UNAUTHORIZED, NOT_FOUND, OK, INTERNAL_SERVER_ERROR, UNPROCESSABLE_ENTITY } from 'http-status';
import { generateToken, refreshToken, invalidateToken } from './../helpers/security.helper';
import { RequireAuth } from './../middlewares/auth.midleware';
import { SESSION_ACTIVE_STATUS, AUTHENTICATION_FAILED_STATUS, INTERNAL_SERVER_ERROR_STATUS, USER_NOT_FOUND_STATUS, USER_EXISTS_STATUS, OK_STATUS, ROLE_NOT_FOUND_STATUS } from './../utils/constants';
import { getDateWithTimeZone } from './../utils/time.utils';

export const authRouter: Router = Router();

authRouter.post('/login', (request: Request, response: Response) => {
    const body = request.body;

    User.findOne({ email: body.email }).populate("role", "-_id -_v").then((user: IUser) => {
        if (!user) {
            throw new Error(USER_NOT_FOUND_STATUS);
        }
        if (user?.session_id) {
            return response.status(UNAUTHORIZED).json({ code: UNAUTHORIZED, status: SESSION_ACTIVE_STATUS });
        }
        compare(body.password, user.password, (err, result) => {
            if (err || !result) {
                return response.status(UNAUTHORIZED).json({ code: UNAUTHORIZED, status: AUTHENTICATION_FAILED_STATUS });
            }
            user.session_id = v4();
            const prevDate = user.last_token_date;
            user.last_token_date = new Date();
            user.save();

            generateToken({
                session_id: user.session_id,
                email: user.email,
                last_bearer_date: user.last_token_date
            }).then((token) => {
                response.status(OK).json({
                    bearer: token,
                    data: {
                        permissions: user.role,
                        last_login_date: getDateWithTimeZone(prevDate ? prevDate : user.last_token_date)
                    }
                });
            }).catch(() => {
                response.status(INTERNAL_SERVER_ERROR).json({ code: INTERNAL_SERVER_ERROR, desc: INTERNAL_SERVER_ERROR_STATUS });
            })
        })
    }).catch((err) => {
        response.status(NOT_FOUND).json({ code: NOT_FOUND, status: err.message });
    })
})

authRouter.post('/signup', (request: Request, response: Response) => {
    const body = request.body as IUser;

    User.findOne({ $or: [{ email: body.email }, { code: body.code }] }).then((data: IUser) => {
        if (data) {
            response.status(UNPROCESSABLE_ENTITY).json({ code: UNPROCESSABLE_ENTITY, status: USER_EXISTS_STATUS })
        } else {
            Role.findOne({ role_description: body.role }).then((dbRole: IRole) => {
                if (!dbRole) {
                    response.status(UNPROCESSABLE_ENTITY).json({ code: UNPROCESSABLE_ENTITY, status: ROLE_NOT_FOUND_STATUS })
                } else {
                    hash(body.password, Math.floor(Math.random() * 10)).then((encryptedValue: string) => {
                        User.create({ email: body.email, user_name: body.user_name, code: body.code, password: encryptedValue, role: dbRole, topic: body.topic })
                            .then((user: IUser) => {
                                response.status(OK).json({
                                    code: OK,
                                    status: OK_STATUS,
                                    created_at: getDateWithTimeZone(user.creation_date)
                                });
                            });
                    }).catch((err) => {
                        response.status(INTERNAL_SERVER_ERROR).json({ code: INTERNAL_SERVER_ERROR, desc: err.toString() });
                    });
                }
            }).catch((err) => {
                response.status(INTERNAL_SERVER_ERROR).json({ code: INTERNAL_SERVER_ERROR, desc: err.toString() });
            });
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


