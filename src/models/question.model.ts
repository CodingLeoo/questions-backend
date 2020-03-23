import { ICourse } from './course.models';
import { Document, Model, model, Schema } from 'mongoose';

export interface IQuestion extends Document {
    course: ICourse;
    question: string;
    options?: IOption[];
    answer: IOption;
}

export interface IOption {
    order: string;
    image?: Buffer;
    text: string;
}


const question: Schema = new Schema({
    section: {
        type: Schema.Types.ObjectId,
        ref: 'course',
        required: true
    },
    question: {
        type: String,
        required: true
    },
    options: [
        {
            type: Schema.Types.Mixed,
            required: false
        }
    ],
    answer: {
        type: Schema.Types.Mixed,
        required: true
    }
});


export const Question: Model<IQuestion> = model<IQuestion>('question', question);

