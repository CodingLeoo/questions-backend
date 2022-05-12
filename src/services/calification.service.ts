import { Question } from './../models/question.model';
import { User } from './../models/auth.models';
import { Calification } from './../models/calification.model';
import { RESULTSET_NOT_FOUND, OK_STATUS, NO_CALIFICATIONS_FOUND, BAD_REQUEST_STATUS, EXAM_FINALIZED, QUESTION_NOT_FOUND, QUESTION_VALIDATED_FAIL, QUESTION_VALIDATED_OK } from './../utils/constants';
import { NOT_FOUND, OK, INTERNAL_SERVER_ERROR, BAD_REQUEST, CONFLICT } from 'http-status';
import { SingleResult, Result } from './../models/result.model';



export const findUserCalifications = async (sessionId: string) => {
    try {
        const userResult = await User.findOne({ session_id: sessionId });
        const califications = await Calification.find({ user: userResult }, { __v: 0 }).populate({
            path: 'course',
            model: 'course',
            populate: [{
                path: 'topic',
                model: 'topic',
                select: '-courses -__v -_id'
            }],
            select: '-owner -exams -sections -students -__v -_id'
        }).populate({
            path: 'user',
            model: 'user',
            select: '-__v -_id -session_id -refresh_count -topic -role -password -photo -creation_date -last_update_date -last_token_date'
        }).populate({
            path: 'califications',
            model: 'result',
            populate: [{
                path: 'exam',
                select: '-sections -__v -_id -course'
            }],
            select: '-results -__v'
        });

        if (!califications || califications.length === 0)
            throw { code: NOT_FOUND, status: NO_CALIFICATIONS_FOUND }

        return califications;
    } catch (err) {
        if (err.code)
            throw err;
        else
            throw { code: INTERNAL_SERVER_ERROR, status: err.toString() };
    }
}


export const findCourseCalifications = async (sessionId: string, courseId: string) => {
    try {
        const userResult = await User.findOne({ session_id: sessionId });
        const califications = await Calification.findOne({ user: userResult, course: courseId }, { __v: 0 }).populate({
            path: 'course',
            model: 'course',
            populate: [{
                path: 'topic',
                model: 'topic',
                select: '-courses -__v -_id'
            }],
            select: '-owner -exams -sections -students -__v -_id'
        }).populate({
            path: 'user',
            model: 'user',
            select: '-__v -_id -session_id -refresh_count -topic -role -password -photo -creation_date -last_update_date -last_token_date'
        }).populate({
            path: 'califications',
            model: 'result',
            populate: [{
                path: 'exam',
                select: '-sections -__v -_id -course'
            }],
            select: '-results -__v'
        });

        if (!califications || califications.califications.length === 0)
            throw { code: NOT_FOUND, status: NO_CALIFICATIONS_FOUND }
        return califications;
    } catch (err) {
        if (err.code)
            throw err;
        else
            throw { code: INTERNAL_SERVER_ERROR, status: err.toString() };
    }
}


export const findExamCalifications = async (calficationId: string) => {
    try {
        const examResult = await Result.findById(calficationId, { exam: 0, __v: 0 }).populate({
            path: 'results',
            model: 'singleresult',
            populate: [{
                path: 'answer',
                model: 'option',
                select: '-__v -question -section -answer'
            }, {
                path: 'question',
                model: 'question',
                populate: [{
                    path: 'options',
                    model: 'option',
                    select: `-__v -question -section`
                }, {
                    path: 'answer',
                    model: 'option',
                    select: ' -__v -question -section'
                }],
                select: '-section -__v'
            }],
            select: '-resultSet -__v -_id'
        });

        if (!examResult)
            throw { code: BAD_REQUEST, status: BAD_REQUEST_STATUS }

        return examResult;
    } catch (err) {
        if (err.code)
            throw err;
        else
            throw { code: INTERNAL_SERVER_ERROR, status: err.toString() };
    }
}


export const submitAnswer = async (calificationId: string, request: any) => {
    const resp = { code: OK, status: QUESTION_VALIDATED_FAIL };
    try {
        const result = await Question.findById(request.question).populate('answer');

        if (!result)
            throw { code: NOT_FOUND, status: QUESTION_NOT_FOUND };

        let currentValue = 0;
        if (result.answer._id.toString() === request.selected_option) {
            currentValue = 1;
            resp.status = QUESTION_VALIDATED_OK;
        }

        const parent = await Result.findById(calificationId);

        if (!parent)
            throw { code: NOT_FOUND, status: RESULTSET_NOT_FOUND }

        if (parent.finish_date)
            throw { code: CONFLICT, status: EXAM_FINALIZED }

        const singleResult = await SingleResult.create({
            resultSet: parent,
            question: request.question,
            answer: request.selected_option
        })

        const successfullCount = parent.successfull_answers + currentValue;
        await parent.updateOne({ $set: { successfull_answers: successfullCount }, $push: { results: singleResult } });

        return resp;
    } catch (err) {
        console.log(err);
        if (err.code)
            throw err;
        else
            throw { code: INTERNAL_SERVER_ERROR, status: err.toString() };
    }
}


export const finishExam = async (calificationId: string) => {
    try {
        const result = await Result.update({ _id: calificationId }, { finish_date: new Date() });
        return { code: OK, status: OK_STATUS, additional_information: result };
    } catch (err) {
        throw { code: INTERNAL_SERVER_ERROR, status: err.toString() };
    }
}