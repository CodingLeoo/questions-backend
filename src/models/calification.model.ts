import { IUser } from './auth.models';
import { ICourse } from './course.models';
import { Document, Model, model, Schema } from 'mongoose';
import { IResult } from './result.model';


export interface ICalification extends Document {
    course: ICourse
    user: IUser
    califications: IResult[]
}


const calification: Schema = new Schema({
    course: {
        type: Schema.Types.ObjectId,
        ref: 'course',
        required: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    califications: [{
        type: Schema.Types.ObjectId,
        ref: 'result'
    }]
})


export const Calification: Model<ICalification> = model<ICalification>('calification', calification);