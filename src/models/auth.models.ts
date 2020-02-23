import { Document, Schema, Model, model } from 'mongoose';
import { IRole } from './role.model';

export interface IUser extends Document {
    user_name: string
    email: string
    code: number
    photoURL?: string
    password: string
    role: IRole,
    topic?: number
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
    topic: Number,
    last_token_date: Date,
    session_id: String
}, { timestamps: { createdAt: 'creation_date', updatedAt: 'last_update_date' } });


export const User: Model<IUser> = model<IUser>("user", user);




