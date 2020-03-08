import { Document, Model, model, Schema } from 'mongoose';
import { ICourse } from './course.models';

export interface IQuestion extends Document {
    course: ICourse
    detail: IQuestionDetail
}


export interface IQuestionDetail extends Document {
    type: number
    context: string
    question: string
    options: any[]
    answers: any[]
}



const question: Schema = new Schema({
    course: {
        type: Schema.Types.ObjectId,
        ref: 'course',
        required: true
    },
    detail: {
        type: Schema.Types.ObjectId,
        ref: 'questionDetail',
        required: true
    }
});


const questionDetail: Schema = new Schema({
    type: { type: Number, required: true },
    context: { type: String, required: true },
    question: { type: String, required: true },
    options: [{ type: Object, required: true }],
    answers: [{ type: Object, required: true }]
})


const Question: Model<IQuestion> = model<IQuestion>('question', question);
const QuestionDetail: Model<IQuestionDetail> = model<IQuestionDetail>('questionDetail', questionDetail);


export { Question, QuestionDetail };