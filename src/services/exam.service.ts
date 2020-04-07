import { Calification } from './../models/calification.model';
import { User } from './../models/auth.models';
import { Result } from './../models/result.model';
import { OK_STATUS, EXAM_NOT_FOUND, BAD_REQUEST_STATUS } from './../utils/constants';
import { NOT_FOUND, INTERNAL_SERVER_ERROR, OK, BAD_REQUEST } from 'http-status';
import { Course } from './../models/course.models';
import { Exam } from './../models/exam.models';


export const findExam = async (examId: string) => {
    try {
        const exam = Exam.findById(examId, { __v: 0 }).populate('sections', '-__v -course -buffer -context -image -example -sharedOptions');
        if (!exam)
            throw { code: NOT_FOUND, status: EXAM_NOT_FOUND }
        return exam;
    } catch (err) {
        if (err.code)
            throw err;
        else
            throw { code: INTERNAL_SERVER_ERROR, status: err.toString() };
    }
}


export const initExam = async (examId: string, sessionId: string) => {
    try {
        const userResult = await User.findOne({ session_id: sessionId });
        const examResult = await Exam.findById(examId);

        if (!userResult || !examResult)
            throw { code: BAD_REQUEST, status: BAD_REQUEST_STATUS }

        const result = await Result.create({ exam: examResult, user: userResult });

        await Calification.updateOne({ user: userResult, course: examResult.course }, { $push: { califications: result } });
        return { code: OK, status: OK_STATUS, additional_information: { result_id: result._id } };
    } catch (err) {
        console.log('err : ' +  err);
        if (err.code)
            throw err;
        else
            throw { code: INTERNAL_SERVER_ERROR, status: err.toString() };
    }
}


export const createExam = async (request: any, courseId: string) => {
    try {
        const courseResult = await Course.findById(courseId);

        if (!courseResult)
            throw { code: NOT_FOUND, status: EXAM_NOT_FOUND }

        const exam = await Exam.create({
            course: courseResult,
            title: request.title,
            minimum_approve_questions: request.minimum_approve_questions,
            total_questions: request.total_questions,
            sections: request.sections
        })

        await courseResult.updateOne({ $push: { exams: exam } });

        return { code: OK, status: OK_STATUS, additional_information: { result_id: exam._id } }

    } catch (err) {
        if (err.code)
            throw err;
        else
            throw { code: INTERNAL_SERVER_ERROR, status: err.toString() };
    }
}


export const updateExam = async (request: any, examId: string) => {
    try {
        const exam = await Exam.updateOne({ _id: examId }, {
            title: request.title,
            minimum_approve_questions: request.minimum_approve_questions,
            total_questions: request.total_questions,
            sections: request.sections
        })

        return { code: OK, status: OK_STATUS, additional_information: exam }
    } catch (err) {
        if (err.code)
            throw err;
        else
            throw { code: INTERNAL_SERVER_ERROR, status: err.toString() };
    }
}


export const deleteExam = async (examId: string) => {
    try {
        const writeResult = await Exam.findOneAndDelete({ _id: examId });

        return { code: OK, status: OK_STATUS, additional_information: { _id: writeResult._id } };
    } catch (err) {
        if (err.code)
            throw err;
        else
            throw { code: INTERNAL_SERVER_ERROR, status: err.toString() };
    }
}