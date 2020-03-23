import { TOPIC_NOT_FOUND } from './../utils/constants';
import { NOT_FOUND, INTERNAL_SERVER_ERROR } from 'http-status';
import { Topic, ITopic } from './../models/topic.models';



export const findAll = (): Promise<ITopic[]> => {
    return Topic.find({}, { courses: 0, __v: 0 }).then((result: ITopic[]) => result)
        .catch((err: any) => {
            throw { code: INTERNAL_SERVER_ERROR, status: err.toString() };
        });
}


export const find = (topicId: string): Promise<ITopic | any> => {
    return Topic.findOne({ _id: topicId }, { _id: 0, __v: 0 }).populate({
        path: 'courses',
        populate: {
            path: 'owner',
            model: 'user',
            select: '-_id  -__v -session_id -refresh_count -last_token_date'
        },
        select: '-__v -students -questions -exams -topic'
    }).then((result: ITopic) => {
        if (!result) {
            throw { code: NOT_FOUND, status: TOPIC_NOT_FOUND };
        }
        return result;
    }).catch((err: any) => {
        throw { code: INTERNAL_SERVER_ERROR, status: err.toString() };
    })
}