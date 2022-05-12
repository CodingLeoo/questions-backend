import { IQuestion, IOption } from './question.model';
import { IExam } from './exam.models';
import { Document, Model, model, Schema } from 'mongoose';


export interface IResult extends Document {
    exam: IExam,
    results: ISingleResult[]
    successfull_answers: number
    init_date: Date;
    finish_date: Date;
}


export interface ISingleResult extends Document {
    resultSet: IResult
    question: IQuestion
    answer: IOption
}


const result: Schema = new Schema({
    exam: {
        type: Schema.Types.ObjectId,
        ref: 'exam',
        required: true
    },
    results: [{
        type: Schema.Types.ObjectId,
        ref: 'singleresult'
    }],
    successfull_answers: { type: Number, default: 0 },
    finish_date: { type: Date }
}, { timestamps: { createdAt: 'init_date', updatedAt: false } })


const singleResult: Schema = new Schema({
    resultSet: {
        type: Schema.Types.ObjectId,
        ref: 'result',
        required: true
    },
    question: {
        type: Schema.Types.ObjectId,
        ref: 'question',
        required: true
    },
    answer: {
        type: Schema.Types.ObjectId,
        ref: 'answer',
        required: true
    }
})


export const Result: Model<IResult> = model<IResult>('result', result);
export const SingleResult: Model<ISingleResult> = model<ISingleResult>('singleresult', singleResult);