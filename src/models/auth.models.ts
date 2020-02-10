import { Document, Schema, Model, model } from 'mongoose';

export interface IUserLogin {
    email: string
    password: string
}

export interface IUser extends Document {
    user_name: string
    email: string
    photoURL?: string
    password?: string
    role?: string
    last_token_date?: Date
    session_id?: string
    creation_date: Date
    last_update_date : Date
}

export interface IUserSignUp {
    user_name: string
    email: string
    password: string
}

const user: Schema = new Schema({
    email: { type: String, required: true },
    user_name: { type: String, required: true },
    photoURL: String,
    password: { type: String, required: true },
    role: String,
    last_token_date: Date,
    session_id: String
}, { timestamps: { createdAt: 'creation_date', updatedAt: 'last_update_date' } });



export const User: Model<IUser> = model<IUser>("user", user);




