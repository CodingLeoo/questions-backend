import { SESSION_NOT_FOUND } from './../utils/constants';
import { sign, verify } from 'jsonwebtoken';
import { User, IUser } from './../models/auth.models';
import { v4 } from 'uuid';
const secret = process.env.SECRET || 'questi0nsApp202O*';

export function generateToken(body: any): Promise<string> {
    return new Promise((resolve, reject) => {
        sign({ data: body, iat: Math.floor(Date.now()) / 1000, exp: Math.floor(Date.now()) / 1000 + (60 * 60) }, secret, (err: any, token: string) => {
            if (err) {
                reject(err);
            }
            resolve(token);
        });
    })
}

export function refreshToken(token: string): Promise<string> {
    return new Promise((resolve, reject) => {
        verifyToken(token).then((user: IUser) => {
            user.session_id = v4();
            user.last_token_date = new Date();
            user.refresh_count += 1;
            user.save();

            generateToken({ session_id: user.session_id, email: user.email, last_bearer_date: user.last_token_date }).then((refereshedToken: string) => {
                resolve(refereshedToken);
            })
        }).catch((err: any) => {
            reject(err);
        })
    })
}

export function verifyToken(token: string): Promise<IUser> {
    return new Promise((resolve, reject) => {
        verify(token, secret, (err: any, payload: any) => {
            if (err) {
                console.log(err);
                reject(err);
            }

            User.findOne({ session_id: payload.data.session_id, last_token_date: payload.data.last_bearer_date }).then((user: IUser) => {
                if (user) {
                    resolve(user);
                }
                reject(SESSION_NOT_FOUND);

            }).catch((fail: any) => {
                console.log(fail);
                reject(fail);
            })
        })
    })

}

export function invalidateToken(token: string): Promise<void> {
    return new Promise((resolve, reject) => {
        verifyToken(token).then((user: IUser) => {
            user.session_id = null;
            user.refresh_count = 0;
            user.save();
            resolve();
        }).catch((err: any) => {
            reject(err);
        })
    })
}
