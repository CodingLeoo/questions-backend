import { Document, Model, model, Schema } from 'mongoose';
import { ICourse } from './course.models';
import { IQuestion } from './question.model';

export interface IExam extends Document {
    course : ICourse
    title : string
    minimun_approve_questions : number
    questions : IQuestion []
}