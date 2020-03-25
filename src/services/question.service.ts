import { COURSE_NOT_FOUND, QUESTION_VALIDATED_OK, QUESTION_VALIDATED_FAIL, QUESTION_NOT_FOUND } from './../utils/constants';
import { NOT_FOUND, INTERNAL_SERVER_ERROR, OK } from 'http-status';
import { Course, ICourse } from './../models/course.models';
import { IQuestion, Question, Option, IOption } from './../models/question.model';


export const createQuestion = (request: any, courseId: string): Promise<any> => {
    return Course.findOne({ _id: courseId }).then((dbCourse: ICourse) => {
        if (!dbCourse) {
            throw { code: NOT_FOUND, status: COURSE_NOT_FOUND }
        }
        return Question.create({
            course: dbCourse,
            question: request.question,
        }).then((question: IQuestion) => {
            return dbCourse.updateOne({ $push: { questions: question } }).then(() => {
                request.options.forEach((option: any) => {
                    option.question = question;
                })
                return Option.create(...request.options).then((opts: any) => {
                    const ans = opts.find((opt: any) => opt.answer);
                    return question.updateOne({ $push: { options: [...opts] }, $set: { answer: ans } });
                });
            });
        })
    }).catch((err) => {
        if (err.code)
            throw err;
        else
            throw { code: INTERNAL_SERVER_ERROR, status: err.toString() };
    })
}

export const validateQuestion = (questionId: string, optionId: string): Promise<{ code: number, status: string }> => {
    return Question.findById(questionId).populate('answer').then((result: IQuestion) => {
        if (!result) {
            throw { code: NOT_FOUND, status: QUESTION_NOT_FOUND }
        }

        if (result.answer._id.toString() === optionId) {
            return { code: OK, status: QUESTION_VALIDATED_OK }
        } else {
            return { code: OK, status: QUESTION_VALIDATED_FAIL }
        }
    }).catch((err) => {
        if (err.code)
            throw err;
        else
            throw { code: INTERNAL_SERVER_ERROR, status: err.toString() };
    })
}


export const findQuestion = (questionId: string): Promise<IQuestion> => {
    return Question.findById(questionId, { __v: 0, course: 0, answer: 0 }).populate("options", "-answer -question -__v").then((result: IQuestion) => {
        if (!result) {
            throw { code: NOT_FOUND, status: QUESTION_NOT_FOUND }
        }
        return result;
    }).catch((err) => {
        if (err.code)
            throw err;
        else
            throw { code: INTERNAL_SERVER_ERROR, status: err.toString() };
    })
}


export const updateQuestion = (questionId: string, request: any): Promise<void> => {
    return Question.findById(questionId).populate("answer").then((result: IQuestion) => {
        if (!result) {
            throw { code: NOT_FOUND, status: QUESTION_NOT_FOUND }
        }

        request.options.forEach(async (option: any) => {
            if (option.updated) {
                await Option.update({ _id: option._id }, { $set: { text: option.text, answer: option.answer } })
            }
        });

        const answerRequest = request.options.find((option: any) => option.answer);

        if (result.answer._id.toString() !== answerRequest._id) {
            result.answer.answer = undefined;
            result.answer.save();
            return result.updateOne({ $set: { answer: answerRequest._id, question: request.question } });
        } else {
            return result.updateOne({ $set: { question: request.question } });;
        }
    }).catch((err) => {
        if (err.code)
            throw err;
        else
            throw { code: INTERNAL_SERVER_ERROR, status: err.toString() };
    })
}


export const deleteQuestion = (questionId: string): Promise<void> => {
    return Question.findOneAndDelete({ _id: questionId }).catch((err) => {
        if (err.code)
            throw err;
        else
            throw { code: INTERNAL_SERVER_ERROR, status: err.toString() };
    });
}


export const addOptionImage = (optionId: string, value: string): Promise<any> => {
    return Option.findById(optionId).then((result: IOption) => {
        if (!result) {
            throw { code: NOT_FOUND, status: QUESTION_NOT_FOUND }
        }
        const data = new Buffer(value, 'base64');
        return result.updateOne({ $set: { buffer: data } });
    }).catch((err) => {
        if (err.code)
            throw err;
        else
            throw { code: INTERNAL_SERVER_ERROR, status: err.toString() };
    });
}