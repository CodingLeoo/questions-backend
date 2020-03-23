import { IQuestion, IOption } from './question.model';
import { Document, Schema, Model, model } from 'mongoose';


export interface ISection extends Document {
    type: number;
    context: string;
    image?: Buffer;
    example?: IQuestion;
    questions: IQuestion[];
    sharedOptions?: IOption[];
}


const section: Schema = new Schema({
    type: { type: Number, required: true },
    context: { type: String, required: true },
    image: { type: Buffer },
    example: {
        type: Schema.Types.ObjectId,
        ref: 'question',
    },
    questions: [{
        type: Schema.Types.ObjectId,
        ref: 'question',
        required: true
    }],
    sharedOptions: [{
        type: Schema.Types.Mixed,
    }]

});




export const Section: Model<ISection> = model<ISection>('section', section);



