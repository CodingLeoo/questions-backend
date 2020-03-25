import { OK_STATUS } from './../utils/constants';
import { OK } from 'http-status';
import { IQuestion, IOption } from './../models/question.model';
import { createQuestion, validateQuestion, findQuestion, updateQuestion, deleteQuestion, addOptionImage } from './../services/question.service';
import { Router, Request, Response } from 'express';


export const QuestionRouter: Router = Router();



QuestionRouter.post('/:courseid/create', (request: Request, response: Response) => {
    const courseId = request.params.courseid;
    const body = request.body;
    createQuestion(body, courseId).then((result: IQuestion) => {
        response.status(OK).json({ code: OK, status: OK_STATUS, additional_info: result });
    }).catch((err) => {
        console.log(err);
        response.status(err.code).json(err);
    })
})


QuestionRouter.post('/:questionid/validate', (request: Request, response: Response) => {
    const questionId = request.params.questionid;
    const optionId = request.body.option;
    validateQuestion(questionId, optionId).then((result: any) => {
        response.status(OK).json(result);
    }).catch((err) => {
        response.status(err.code).json(err);
    })
})


QuestionRouter.get('/:questionid/find', (request: Request, response: Response) => {
    const questionId = request.params.questionid;
    findQuestion(questionId).then((result: IQuestion) => {
        response.status(OK).json({ data: result });
    }).catch((err) => {
        response.status(err.code).json(err);
    })
})

QuestionRouter.put('/:questionid/update', (request: Request, response: Response) => {
    const questionId = request.params.questionid;
    const body = request.body;

    updateQuestion(questionId, body).then(() => {
        response.status(OK).json({ code: OK, status: OK_STATUS });
    }).catch((err) => {
        response.status(err.code).json(err);
    })
})

QuestionRouter.delete('/:questionid/delete', (request: Request, response: Response) => {
    const questionId = request.params.questionid;

    deleteQuestion(questionId).then(() => {
        response.status(OK).json({ code: OK, status: OK_STATUS });
    }).catch((err) => {
        response.status(err.code).json(err);
    })
})


QuestionRouter.patch('/option/:optionid/image', (request: Request, response: Response) => {
    const optionId = request.params.optionid;
    const value = request.body.value;

    addOptionImage(optionId, value).then((result: any) => {
        response.status(OK).json({ code: OK, status: OK_STATUS, additional_info: result });
    }).catch((err) => {
        response.status(err.code).json(err);
    })
})