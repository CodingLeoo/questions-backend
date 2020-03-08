import { IQuestion } from './question.model';
import { IExam } from './exam.models';
import { Document, Model, model, Schema } from 'mongoose';



export interface IResult extends Document {
    exam: IExam,
    results: ISingleResult[]
}


export interface ISingleResult extends Document {
    resultSet: IResult
    question: IQuestion
    answer: any
}