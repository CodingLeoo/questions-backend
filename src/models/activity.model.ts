import { IUser } from './auth.models';
import { Document, Schema, Model, model } from 'mongoose';


export interface IUserActivity extends Document {
    user: IUser
    activity?: IActivity[]
    create_date: Date
}


export interface IActivity {
    activity: string
    description: string
    icon: string
}


const activity = new Schema({
    activity: { type: String, required: true },
    description: { type: String, required: true },
    icon: { type: String, required: true },
    activity_date: { type: Date, default: new Date() }
});


const userActivity: Schema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    activity: [activity]
}, { timestamps: { createdAt: 'create_date', updatedAt: false } })



export const UserActivity: Model<IUserActivity> = model<IUserActivity>('userActivity', userActivity);
