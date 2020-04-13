import { TOPIC_NOT_FOUND } from './../utils/constants';
import { NOT_FOUND, INTERNAL_SERVER_ERROR } from 'http-status';
import { Topic, ITopic } from './../models/topic.models';



export const findAll = async (): Promise<ITopic[]> => {
    try {
        const result = await Topic.find({}, { courses: 0, __v: 0 });
        return result;
    }
    catch (err) {
        throw { code: INTERNAL_SERVER_ERROR, status: err.toString() };
    }
}


export const find = async (topicId: string): Promise<ITopic | any> => {
    try {
        const result = await Topic.findOne({ _id: topicId }, { _id: 0, __v: 0 }).populate({
            path: 'courses',
            populate: {
                path: 'owner',
                model: 'user',
                select: '-_id  -__v -session_id -refresh_count -password -photo -role -topic -creation_date -last_update_date'
            },
            select: '-__v -students -questions -exams -topic -sections'
        });
        if (!result) {
            throw { code: NOT_FOUND, status: TOPIC_NOT_FOUND };
        }
        return result;
    }
    catch (err) {
        throw { code: INTERNAL_SERVER_ERROR, status: err.toString() };
    }
}