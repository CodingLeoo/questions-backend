import { IExam } from './../models/exam.models';
import { OK } from 'http-status';
import { createExam, findExam, updateExam, deleteExam } from './../services/exam.service';
import { Router, Request, Response } from 'express';


export const ExamsRouter: Router = Router();


ExamsRouter.get('/:examid/find', (request: Request, response: Response) => {
    const examId = request.params.examid;

    findExam(examId).then((result: IExam) => {
        response.status(OK).json(result);
    }).catch((err: any) => {
        console.log(err);
        response.status(err.code).json(err);
    })
})


ExamsRouter.post('/:courseid/create', (request: Request, response: Response) => {
    const courseId = request.params.courseid;
    const body = request.body;

    createExam(body, courseId).then((result: any) => {
        response.status(OK).json(result);
    }).catch((err: any) => {
        response.status(err.code).json(err);
    })
})

ExamsRouter.put('/:examid/update', (request: Request, response: Response) => {
    const examId = request.params.examid;
    const body = request.body;

    updateExam(body, examId).then((result: any) => {
        response.status(OK).json(result);
    }).catch((err: any) => {
        response.status(err.code).json(err);
    })
})


ExamsRouter.delete('/:examid/delete', (request: Request, response: Response) => {
    const examId = request.params.examid;

    deleteExam(examId).then((result: any) => {
        response.status(OK).json(result);
    }).catch((err: any) => {
        response.status(err.code).json(err);
    })
})





