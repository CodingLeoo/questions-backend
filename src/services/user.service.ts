import { User } from './../models/auth.models';

export const findUser = (sessionId: string) => {
    return User.findOne({ session_id: sessionId },
        { _id: 0, __v: 0, role: 0, password: 0, session_id: 0, last_token_date: 0 });
}