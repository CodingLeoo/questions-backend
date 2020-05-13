import { trackAccess } from './../middlewares/common.middleware';
import { OK_STATUS } from './../utils/constants';
import { OK } from 'http-status';
import { IQuestion } from './../models/question.model';
import { createQuestion, findQuestion, updateQuestion, deleteQuestion, updateOption, createSharedOption } from './../services/question.service';
import { Router, Request, Response } from 'express';


export const QuestionRouter: Router = Router();


QuestionRouter.post('/:sectionId/create', (request: Request, response: Response) => {
    const sectionId = request.params.sectionId;
    const body = request.body;
    createQuestion(body, sectionId).then((result: IQuestion) => {
        response.status(OK).json({ code: OK, status: OK_STATUS, additional_info: result });
    }).catch((err) => {
        response.status(err.code).json(err);
    })
})

QuestionRouter.get('/:questionid/find', trackAccess, (request: Request, response: Response) => {
    const permissions = request.headers.question_permissions as string;
    const questionId = request.params.questionid;
    findQuestion(questionId, permissions).then((result: IQuestion) => {
        response.status(OK).json({ data: result });
    }).catch((err) => {
        response.status(err.code).json(err);
    })
})

QuestionRouter.put('/:questionid/update', trackAccess, (request: Request, response: Response) => {
    const permissions = request.headers.question_permissions as string;
    const questionId = request.params.questionid;
    const body = request.body;

    updateQuestion(questionId, body, permissions).then(() => {
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


QuestionRouter.post('/option/:sectionid/shared', (request: Request, response: Response) => {
    const sectionId = request.params.sectionid;
    const body = request.body;

    createSharedOption(body, sectionId).then((result: any) => {
        response.status(OK).json(result);
    }).catch((err) => {
        response.status(err.code).json(err);
    })
})

QuestionRouter.put('/option/:optionid/update', (request: Request, response: Response) => {
    const optionId = request.params.optionid;
    const body = request.body;

    updateOption(optionId, body).then((result: any) => {
        response.status(OK).json({ code: OK, status: OK_STATUS, additional_info: result });
    }).catch((err) => {
        response.status(err.code).json(err);
    })
})