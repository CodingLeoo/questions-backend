import { COURSE_NOT_FOUND } from './../utils/constants';
import { ISection } from './section.model';
import { getDateWithTimeZone } from './../utils/time.utils';
import { IUser } from './auth.models';
import { Document, Model, model, Schema } from 'mongoose';
import { ITopic, Topic } from './topic.models';
import { IExam } from './exam.models';
import { NOT_FOUND } from 'http-status';

export interface ICourse extends Document {
    title: string
    owner: IUser
    topic: ITopic
    description: string
    exams?: IExam[]
    sections?: ISection[]
    students?: IUser[]
    create_date: Date,
    last_update_date: Date
}


const course: Schema = new Schema({
    title: { type: String, required: true },
    owner: {
        type: Schema.Types.ObjectId
        , ref: 'user',
        required: true
    },
    topic: {
        type: Schema.Types.ObjectId,
        ref: 'topic',
        required: true
    },
    description: { type: String, required: true },
    exams: [{
        type: Schema.Types.ObjectId,
        ref: 'exam'
    }],
    sections: [{
        type: Schema.Types.ObjectId,
        ref: 'section'
    }],
    students: [{
        type: Schema.Types.ObjectId,
        ref: 'user'
    }]
}, { timestamps: { createdAt: 'create_date', updatedAt: 'last_update_date' } });

// TRIGGER FUNCTIONS

course.post('find', (docs: any) => {
    docs.forEach((doc: ICourse) => {
        doc.create_date = getDateWithTimeZone(doc.create_date);
        doc.last_update_date = getDateWithTimeZone(doc.last_update_date);
    })
})

course.post('findOne', (doc: ICourse, next: (err?: any) => void) => {
    if (!doc) {
        next({ code: NOT_FOUND, status: COURSE_NOT_FOUND });
        return;
    }
    doc.create_date = getDateWithTimeZone(doc.create_date);
    doc.last_update_date = getDateWithTimeZone(doc.last_update_date);
    next();
})


course.post('findOneAndDelete', (doc: ICourse, next: any) => {
    if (!doc) {
        const err = { code: NOT_FOUND, status: COURSE_NOT_FOUND };
        next(err);
    }
    Topic.updateOne({ _id: doc.topic }, { $pull: { courses: doc._id } }).then(() => {
        next();
    })
})

export const Course: Model<ICourse> = model<ICourse>('course', course);
