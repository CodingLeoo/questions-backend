import { Photo } from './shared.models';
import { ISection, Section } from './section.model';
import { QUESTION_NOT_FOUND } from './../utils/constants';
import { Document, Model, model, Schema } from 'mongoose';
import { NOT_FOUND } from 'http-status';

export interface IQuestion extends Document {
    section: ISection;
    question: string;
    options?: IOption[];
    answer?: IOption;
}

export interface IOption extends Document {
    section?: ISection;
    question?: IQuestion;
    image?: Photo;
    text: string;
    answer?: boolean;
}


const question: Schema = new Schema({
    section: {
        type: Schema.Types.ObjectId,
        ref: 'section',
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
    section: {
        type: Schema.Types.ObjectId,
        ref: 'section',
    },
    question: {
        type: Schema.Types.ObjectId,
        ref: 'question',
    },
    image: {
        content: { data: Buffer, contentType: String },
        content_type: { type: String }
    },
    text: { type: String, required: true },
    answer: Boolean
})

// TRIGGER METHODS

question.post('findOneAndDelete', (result: IQuestion, next: any) => {
    if (!result) {
        const err = { code: NOT_FOUND, status: QUESTION_NOT_FOUND }
        return next(err);
    }
    Section.findById(result.section).then((section: ISection) => {
        section.updateOne({ $pull: { questions: result._id } }).then(() => {
            Option.deleteMany({ question: result }).then(() => {
                next();
            })
        })
    })
})

export const Option: Model<IOption> = model<IOption>('option', option);
export const Question: Model<IQuestion> = model<IQuestion>('question', question);

