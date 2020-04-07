import { IResult } from './../models/result.model';
import { ICalification } from './../models/calification.model';
import { OK } from 'http-status';
import { submitAnswer, finishExam, findUserCalifications, findCourseCalifications, findExamCalifications } from './../services/calification.service';
import { Router, Request, Response } from 'express';


export const calificationRouter: Router = Router();


calificationRouter.get('/results', (request: Request, response: Response) => {
    const sessionId = request.headers.ssid as string;

    findUserCalifications(sessionId).then((result: ICalification[]) => {
        response.status(OK).json({ data: result });
    }).catch((err: any) => {
        response.status(err.code).json(err);
    })
})


calificationRouter.get('/:courseid/results', (request: Request, response: Response) => {
    const courseId = request.params.courseid;
    const sessionId = request.headers.ssid as string;

    findCourseCalifications(sessionId, courseId).then((result: ICalification) => {
        response.status(OK).json({ data: result });
    }).catch((err: any) => {
        response.status(err.code).json(err);
    })
})


calificationRouter.get('/exam/:calificationid/results', (request: Request, response: Response) => {
    const calificationId = request.params.calificationid;

    findExamCalifications(calificationId).then((result: IResult) => {
        response.status(OK).json({ data: result });
    }).catch((err: any) => {
        response.status(err.code).json(err);
    })
})


calificationRouter.post('/:calificationid/question', (request: Request, response: Response) => {
    const calificationId = request.params.calificationid;
    const body = request.body;

    submitAnswer(calificationId, body).then((result: any) => {
        response.status(OK).json(result);
    }).catch((err: any) => {
        response.status(err.code).json(err);
    })
})


calificationRouter.put('/:calificationid/finish', (request: Request, response: Response) => {
    const calificationId = request.params.calificationid;

    finishExam(calificationId).then((result: any) => {
        response.status(OK).json(result);
    }).catch((err: any) => {
        response.status(err.code).json(err);
    })
})

