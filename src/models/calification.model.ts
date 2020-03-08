import { IUser } from './auth.models';
import { ICourse } from './course.models';
import { Document, Model, model, Schema } from 'mongoose';
import { IResult } from './result.model';


export interface ICalification {
    course: ICourse
    user : IUser
    califications : IResult[]
}