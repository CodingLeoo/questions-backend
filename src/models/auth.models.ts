import { USER_NOT_FOUND_STATUS } from './../utils/constants';
import { firstName } from './../utils/string.utils';
import { START_ICON, LOGIN_ICON, LOGOUT_ICON } from './../utils/icon-constants';
import { getDateWithTimeZone } from './../utils/time.utils';
import { USER_LOGIN_DESCRIPTION, USER_LOGIN_ACTIVITY, USER_LOGOUT_ACTIVITY, NEW_USER_DESCRIPTION, NEW_USER_ACTIVITY, USER_LOGOUT_DESCRIPTION } from './../utils/event-constants';
import { createRecord, registryUserActivity } from './../helpers/user.activity.helper';
import { ITopic } from './topic.models';
import { Document, Schema, Model, model } from 'mongoose';
import { IRole } from './role.model';
import { Photo } from './shared.models';

export interface IUser extends Document {
    user_name: string
    email: string
    code: number
    photo?: Photo
    password: string
    role: IRole,
    topic?: ITopic
    last_token_date?: Date
    session_id?: string
    creation_date?: Date
    last_update_date?: Date
    refresh_count?: number
}

const user: Schema = new Schema({
    email: { type: String, required: true },
    user_name: { type: String, required: true },
    code: { type: Number, required: true },
    photo: {
        content: { data: Buffer, contentType: String },
        content_type: { type: String }
    },
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
    refresh_count: Number,
    session_id: String
}, { timestamps: { createdAt: 'creation_date', updatedAt: 'last_update_date' } });


// TRIGGER METHODS 🤓

user.post('find', (docs: any) => {
    docs.forEach((doc: IUser) => {
        if (doc.creation_date || doc.last_update_date) {
            doc.creation_date = getDateWithTimeZone(doc.creation_date);
            doc.last_update_date = getDateWithTimeZone(doc.last_update_date);
        }

        if (doc.last_token_date)
            doc.last_token_date = getDateWithTimeZone(doc.last_token_date);
    })
})

user.post('findOne', (doc: IUser, next: any) => {
    if (!doc) {
        const err = new Error(USER_NOT_FOUND_STATUS);
        return next(err);
    }

    if (doc.creation_date || doc.last_update_date) {
        doc.creation_date = getDateWithTimeZone(doc.creation_date);
        doc.last_update_date = getDateWithTimeZone(doc.last_update_date);
    }

    if (doc.last_token_date)
        doc.last_token_date = getDateWithTimeZone(doc.last_token_date);
    next();
})

user.post('save', (result: IUser) => {
    if (result.session_id === undefined) {
        createRecord(result).then(() => registryUserActivity(result, NEW_USER_ACTIVITY, NEW_USER_DESCRIPTION(firstName(result.user_name)), START_ICON));
    } else {
        if (result.session_id && result.refresh_count === 0) {
            registryUserActivity(result, USER_LOGIN_ACTIVITY,
                USER_LOGIN_DESCRIPTION(firstName(result.user_name)), LOGIN_ICON);
        } else if (result.session_id == null) {
            registryUserActivity(result, USER_LOGOUT_ACTIVITY,
                USER_LOGOUT_DESCRIPTION(firstName(result.user_name)), LOGOUT_ICON);
        }
    }
})

export const User: Model<IUser> = model<IUser>("user", user);




