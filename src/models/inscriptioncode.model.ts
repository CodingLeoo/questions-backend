import { Model, Schema, model, Document } from 'mongoose';


export interface EnrollCode extends Document {
    code: number
    validUntil: Date
    createdAt: Date
}


const inscriptionCode: Schema = new Schema({
    code: { type: Number, required: true },
    validUntil: { type: Date, required: true }
}, { timestamps: true });


export const InscriptionCode: Model<EnrollCode> = model('inscriptionCode', inscriptionCode);



