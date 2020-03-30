import { SECTION_NOT_FOUND } from './../utils/constants';
import { ICourse, Course } from './course.models';
import { IQuestion, IOption, Option, Question } from './question.model';
import { Document, Schema, Model, model } from 'mongoose';
import { NOT_FOUND } from 'http-status';


export interface ISection extends Document {
    course: ICourse
    type: number
    context: string
    buffer?: Buffer
    image?: string
    example?: IQuestion
    questions: IQuestion[]
    sharedOptions?: IOption[]
}


const section: Schema = new Schema({
    course: { type: Schema.Types.ObjectId, required: true },
    type: { type: Number, required: true },
    context: { type: String, required: true },
    buffer: { type: Buffer },
    image: { type: String },
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
        type: Schema.Types.ObjectId,
        ref: 'option'
    }]

});

// TRIGGER METHODS

section.post('find', (docs: any) => {
    docs.forEach((doc: ISection) => {
        if (doc.buffer)
            doc.image = doc.buffer.toString('base64');
        doc.buffer = undefined;
    })
})

section.post('findOne', (doc: ISection) => {
    if (doc.buffer)
        doc.image = doc.buffer.toString('base64');
    doc.buffer = undefined;
})

section.post('findOneAndDelete', (result: ISection, next: any) => {
    if (!result) {
        const err = { code: NOT_FOUND, status: SECTION_NOT_FOUND }
        next(err);
    }

    Course.findById(result.course).then((course: ICourse) => {
        course.updateOne({ $pull: { sections: result._id } }).then(async () => {
            await Question.remove({ section: result });
            await Option.remove({ section: result });
            next();
        })
    })
})


export const Section: Model<ISection> = model<ISection>('section', section);



