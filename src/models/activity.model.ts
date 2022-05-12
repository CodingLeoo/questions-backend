import { getDateWithTimeZone } from './../utils/time.utils';
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
    icon: string,
    activity_date?: Date
}


const activity = new Schema({
    activity: { type: String, required: true },
    description: { type: String, required: true },
    icon: { type: String, required: true },
    activity_date: { type: Date, required: true }
});


const userActivity: Schema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    activity: [activity]
}, { timestamps: { createdAt: 'create_date', updatedAt: false } })


// TRIGGER FUNCTIONS

userActivity.post('findOne', (result: IUserActivity) => {
    result.activity.forEach((doc: IActivity) => {
        doc.activity_date = getDateWithTimeZone(doc.activity_date);
    });

    // inverted sort --> always move a (if negative a is recent than b , if positive b is recent than a if 0 doesn´t matter )
    result.activity.sort((a: IActivity, b: IActivity) => b.activity_date.getTime() - a.activity_date.getTime());
})

export const UserActivity: Model<IUserActivity> = model<IUserActivity>('userActivity', userActivity);
