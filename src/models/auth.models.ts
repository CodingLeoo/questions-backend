import { START_ICON, LOGIN_ICON, LOGOUT_ICON } from './../utils/icon-constants';
import { getDate, getHours } from './../utils/time.utils';
import { USER_LOGIN_DESCRIPTION, USER_LOGIN_ACTIVITY, USER_LOGOUT_ACTIVITY, NEW_USER_DESCRIPTION, NEW_USER_ACTIVITY, USER_LOGOUT_DESCRIPTION } from './../utils/event-constants';
import { createRecord, registryUserActivity } from './../helpers/user.activity.helper';
import { ITopic } from './topic.models';
import { Document, Schema, Model, model } from 'mongoose';
import { IRole } from './role.model';

export interface IUser extends Document {
    user_name: string
    email: string
    code: number
    photoURL?: string
    password: string
    role: IRole,
    topic?: ITopic
    last_token_date?: Date
    session_id?: string
    creation_date?: Date
    last_update_date?: Date
}

const user: Schema = new Schema({
    email: { type: String, required: true },
    user_name: { type: String, required: true },
    code: { type: Number, required: true },
    photoURL: String,
    password: { type: String, required: true },
    role: {
        type: Schema.Types.ObjectId,
        ref: 'role',
        required: true
    },
    topic: {
        type: Schema.Types.ObjectId,
        ref: 'topic',
    },
    last_token_date: Date,
    session_id: String
}, { timestamps: { createdAt: 'creation_date', updatedAt: 'last_update_date' } });


// TRIGGER METHODS

user.post('save', (result: IUser) => {
    if (result.session_id === undefined) {
        createRecord(result).then(() => registryUserActivity(result, NEW_USER_ACTIVITY, NEW_USER_DESCRIPTION(result.user_name), START_ICON));
    } else {
        if (result.session_id) {
            registryUserActivity(result, USER_LOGIN_ACTIVITY,
                USER_LOGIN_DESCRIPTION(result.user_name, getDate(result.last_token_date), getHours(result.last_token_date)), LOGIN_ICON);
        } else if (result.session_id == null) {
            registryUserActivity(result, USER_LOGOUT_ACTIVITY,
                USER_LOGOUT_DESCRIPTION(result.user_name, getDate(result.last_update_date), getHours(result.last_update_date)), LOGOUT_ICON);
        }
    }
})

export const User: Model<IUser> = model<IUser>("user", user);




