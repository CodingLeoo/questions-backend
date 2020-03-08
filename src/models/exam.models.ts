import { Document, Model, model, Schema } from 'mongoose';
import { ICourse } from './course.models';
import { IQuestion } from './question.model';

export interface IExam extends Document {
    course: ICourse
    title: string
    minimun_approve_questions: number
    questions: IQuestion[]
}


const exam: Schema = new Schema({
    course: {
        type: Schema.Types.ObjectId,
        ref: 'course',
        required: true
    },
    title: { type: String, required: true },
    minimun_approve_questions: { type: Number, required: true },
    questions: [{
        type: Schema.Types.ObjectId,
        ref: 'question'
    }]
});

export const Exam: Model<IExam> = model<IExam>('exam', exam);