import { Document, Model, model, Schema } from 'mongoose';
import { ICourse } from './course.models';

export interface IQuestion extends Document {
    course: ICourse
    context: string
    question: string
    detail: IQuestionDetail

}


export interface IQuestionDetail extends Document {
    // TODO : define question types logic.
}