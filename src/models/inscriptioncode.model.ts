import { Model, Schema, model, Document } from 'mongoose';
import { getDateWithTimeZone } from './../utils/time.utils';
import { ICourse } from './course.models';


export interface EnrollCode extends Document {
    code: number
    valid_until: Date
    course: ICourse | string
    create_date: Date,
    last_update_date: Date
}


const inscriptionCode: Schema = new Schema({
    code: { type: Number, required: true },
    valid_until: { type: Date, required: true },
    course: {
        type: Schema.Types.ObjectId
        , ref: 'course',
        required: true
    }
}, { timestamps: { createdAt: 'create_date', updatedAt: 'last_update_date' } });


inscriptionCode.post('findOne', (doc: EnrollCode, next: any) => {
    if (!doc) {
        return next();
    }

        doc.create_date = getDateWithTimeZone(doc.create_date);
        doc.last_update_date = getDateWithTimeZone(doc.last_update_date);
        doc.valid_until = getDateWithTimeZone(doc.valid_until);
        next();
})

export const InscriptionCode: Model<EnrollCode> = model('inscriptionCode', inscriptionCode);



