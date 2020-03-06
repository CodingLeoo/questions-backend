import { IUser } from './auth.models';
import { Document, Model, model, Schema } from 'mongoose';
import { ITopic } from './topic.models';
import { IExam } from './exam.models';
import { IQuestion } from './question.model';

export interface ICourse extends Document {
    owner: IUser
    topic: ITopic
    description: string
    exams: IExam[]
    questions: IQuestion[]
    students :  IUser[]
}