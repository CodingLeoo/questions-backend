import { QUESTION_NOT_FOUND } from './../utils/constants';
import { ICourse, Course } from './course.models';
import { Document, Model, model, Schema } from 'mongoose';
import { NOT_FOUND } from 'http-status';

export interface IQuestion extends Document {
    course: ICourse;
    question: string;
    options?: IOption[];
    answer?: IOption;
}

export interface IOption extends Document {
    question: IQuestion;
    image?: string;
    buffer?: Buffer;
    text: string;
    answer?: boolean;
}


const question: Schema = new Schema({
    course: {
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
            type: Schema.Types.ObjectId,
            ref: 'option',
        }
    ],
    answer: {
        type: Schema.Types.ObjectId,
        ref: 'option'
    }
});


const option: Schema = new Schema({
    question: {
        type: Schema.Types.ObjectId,
        ref: 'question',
        required: true,
    },
    image: { type: String },
    buffer: { type: Buffer },
    text: { type: String, required: true },
    answer: Boolean
})

// TRIGGER METHODS

question.post('findOneAndDelete', (result: IQuestion, next: any) => {
    if (!result) {
        const err = { code: NOT_FOUND, status: QUESTION_NOT_FOUND }
        next(err);
    }

    Course.findById(result.course).then((course: ICourse) => {
        course.updateOne({ $pull: { questions: result._id } }).then(() => {
            Option.deleteMany({ question: result }).then(() => {
                next();
            })
        })
    })
})

option.post('find', (docs: any) => {
    docs.forEach((doc: IOption) => {
        if (doc.buffer)
            doc.image = doc.buffer.toString('base64');
        doc.buffer = undefined;
    })
})

export const Option: Model<IOption> = model<IOption>('option', option);
export const Question: Model<IQuestion> = model<IQuestion>('question', question);

