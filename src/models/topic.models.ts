import { getDateWithTimeZone } from './../utils/time.utils';
import { Document, Model, model, Schema } from 'mongoose';
import { ICourse } from './course.models';

export interface ITopic extends Document {
    name: string
    numberId: number
    icon: string
    courses?: ICourse[],
    create_date: Date
    last_update_date: Date
}

const topic: Schema = new Schema({
    name: { type: String, required: true },
    numberId: { type: Number, required: true },
    icon: { type: String, required: true },
    courses: [{
        type: Schema.Types.ObjectId,
        ref: 'course'
    }]
}, { timestamps: { createdAt: 'create_date', updatedAt: 'last_update_date' } });

// TRIGGER FUNCTIONS

topic.post('find', (docs: any) => {
    docs.forEach((doc: ICourse) => {
        doc.create_date = getDateWithTimeZone(doc.create_date);
        doc.last_update_date = getDateWithTimeZone(doc.last_update_date);
    })
})

topic.post('findOne', (doc: ITopic) => {
    doc.create_date = getDateWithTimeZone(doc.create_date);
    doc.last_update_date = getDateWithTimeZone(doc.last_update_date);
})


export const Topic: Model<ITopic> = model<ITopic>('topic', topic);