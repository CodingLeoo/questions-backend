import { EXAM_NOT_FOUND } from './../utils/constants';
import { getDateWithTimeZone } from './../utils/time.utils';
import { ISection } from './section.model';
import { Document, Model, model, Schema } from 'mongoose';
import { ICourse, Course } from './course.models';
import { NOT_FOUND } from 'http-status';

export interface IExam extends Document {
    course: ICourse
    title: string
    minimum_approve_questions: number
    total_questions: number
    sections: ISection[]
    create_date: Date
    last_update_date: Date
}


const exam: Schema = new Schema({
    course: {
        type: Schema.Types.ObjectId,
        ref: 'course',
        required: true
    },
    title: { type: String, required: true },
    minimum_approve_questions: { type: Number, required: true },
    total_questions: { type: Number, required: true },
    sections: [{
        type: Schema.Types.ObjectId,
        ref: 'section'
    }]
}, { timestamps: { createdAt: 'create_date', updatedAt: 'last_update_date' } });

// TRIGGER FUNCTIONS

exam.post('find', (docs: any) => {
    docs.forEach((doc: ISection) => {
        doc.create_date = getDateWithTimeZone(doc.create_date);
        doc.last_update_date = getDateWithTimeZone(doc.last_update_date);
    })
})

exam.post('findOne', (doc: IExam) => {
    doc.create_date = getDateWithTimeZone(doc.create_date);
    doc.last_update_date = getDateWithTimeZone(doc.last_update_date);
})

exam.post('findOneAndDelete', (doc: IExam, next: any) => {
    if (!doc) {
        const err = { code: NOT_FOUND, status: EXAM_NOT_FOUND };
        return next(err);
    }
    Course.updateOne({ _id: doc.course }, { $pull: { exams: doc._id } }).then(() => {
        next();
    })
})


export const Exam: Model<IExam> = model<IExam>('exam', exam);