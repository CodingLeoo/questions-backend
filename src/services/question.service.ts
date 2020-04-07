import { Section } from './../models/section.model';
import { COURSE_NOT_FOUND, QUESTION_VALIDATED_OK, QUESTION_VALIDATED_FAIL, QUESTION_NOT_FOUND, OPTION_NOT_FOUND, OK_STATUS, UNAUTHORIZED_STATUS } from './../utils/constants';
import { NOT_FOUND, INTERNAL_SERVER_ERROR, OK, UNAUTHORIZED } from 'http-status';
import { IQuestion, Question, Option, IOption } from './../models/question.model';
import { response } from 'express';


export const createQuestion = async (request: any, sectionId: string): Promise<any> => {
    try {
        const dbSection = await Section.findOne({ _id: sectionId });
        if (!dbSection) {
            throw { code: NOT_FOUND, status: COURSE_NOT_FOUND };
        }
        const question = await Question.create({
            section: dbSection,
            question: request.question,
        });
        if (!request.example)
            await dbSection.updateOne({ $push: { questions: question } });

        request.options.forEach((option: any) => {
            if (option.image) {
                option.buffer = new Buffer(option.image, 'base64');
                option.image = undefined;
            }
            option.question = question;
            option.section = sectionId;
        });
        const opts: any = await Option.create(...request.options);
        const ans = opts.find((opt: any) => opt.answer);
        const result = await question.updateOne({ $push: { options: [...opts] }, $set: { answer: ans } });
        if (result.n)
            return { result_id: question._id, option_ids: opts.map((option: IOption) => option._id) };
    }
    catch (err) {
        if (err.code)
            throw err;
        else
            throw { code: INTERNAL_SERVER_ERROR, status: err.toString() };
    }
}


export const findQuestion = async (questionId: string, access: string): Promise<IQuestion> => {
    const param = access === 'true' ? '' : '-answer';
    try {
        const result = await Question.findById(questionId, { __v: 0, course: 0, answer: 0, section: 0 }).populate("options", `${param} -question -__v -section`);
        if (!result) {
            throw { code: NOT_FOUND, status: QUESTION_NOT_FOUND };
        }
        return result;
    }
    catch (err) {
        if (err.code)
            throw err;
        else
            throw { code: INTERNAL_SERVER_ERROR, status: err.toString() };
    }
}


export const updateQuestion = async (questionId: string, request: any, access: string): Promise<void> => {
    try {
        if (access !== 'true')
            throw { code: UNAUTHORIZED, status: UNAUTHORIZED_STATUS };
        const result = await Question.findById(questionId).populate("answer");
        if (!result) {
            throw { code: NOT_FOUND, status: QUESTION_NOT_FOUND };
        }
        request.options.forEach(async (option: any) => {
            if (option.updated) {
                await Option.update({ _id: option._id }, { $set: { text: option.text, answer: option.answer } });
            }
        });
        const answerRequest = request.options.find((option: any) => option.answer);
        if (result.answer._id.toString() !== answerRequest._id) {
            result.answer.answer = undefined;
            result.answer.save();
            return result.updateOne({ $set: { answer: answerRequest._id, question: request.question } });
        }
        else {
            return result.updateOne({ $set: { question: request.question } });
            ;
        }
    }
    catch (err) {
        if (err.code)
            throw err;
        else
            throw { code: INTERNAL_SERVER_ERROR, status: err.toString() };
    }
}


export const deleteQuestion = async (questionId: string): Promise<void> => {
    try {
        Question.findOneAndDelete({ _id: questionId });
    }
    catch (err) {
        if (err.code)
            throw err;
        else
            throw { code: INTERNAL_SERVER_ERROR, status: err.toString() };
    }
}

export const createSharedOption = async (request: any, sectionId: string) => {
    try {
        const result = await Section.findById(sectionId);
        if (!result) {
            throw { code: NOT_FOUND, status: OPTION_NOT_FOUND };
        }
        const option = await Option.create({ text: request.text, answer: request.answer, section: result });
        return { code: OK, status: OK_STATUS, additional_information: { result_id: option._id } };
    }
    catch (err) {
        if (err.code)
            throw err;
        else
            throw { code: INTERNAL_SERVER_ERROR, status: err.toString() };
    }
}


export const addOptionImage = async (optionId: string, value: string): Promise<any> => {
    try {
        const result = await Option.findById(optionId);
        if (!result) {
            throw { code: NOT_FOUND, status: QUESTION_NOT_FOUND };
        }
        const data = new Buffer(value, 'base64');
        return result.updateOne({ $set: { buffer: data } });
    }
    catch (err) {
        if (err.code)
            throw err;
        else
            throw { code: INTERNAL_SERVER_ERROR, status: err.toString() };
    }
}