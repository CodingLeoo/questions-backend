import { ISection } from './section.model';
import { Document, Model, model, Schema } from 'mongoose';
import { ICourse } from './course.models';

export interface IExam extends Document {
    course: ICourse
    title: string
    minimun_approve_questions: number
    sections: ISection[]
}


const exam: Schema = new Schema({
    course: {
        type: Schema.Types.ObjectId,
        ref: 'course',
        required: true
    },
    title: { type: String, required: true },
    minimun_approve_questions: { type: Number, required: true },
    sections: [{
        type: Schema.Types.ObjectId,
        ref: 'section'
    }]
});

export const Exam: Model<IExam> = model<IExam>('exam', exam);