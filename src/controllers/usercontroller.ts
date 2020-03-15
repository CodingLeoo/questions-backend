import { IUserActivity } from './../models/activity.model';
import { getDateWithTimeZone } from './../utils/time.utils';
import { ICourse } from './../models/course.models';
import { INTERNAL_SERVER_ERROR, OK } from 'http-status';
import { findUser, getEnrolledCourses, getCreatedCourses, getActivity } from './../services/user.service';
import { Router, Request, Response } from 'express';

export const UserRouter: Router = Router();


UserRouter.get('/find', (request: Request, response: Response) => {
    const sessionId = request.headers.ssid as string;
    findUser(sessionId).then((result: any) => {
        response.json({
            data: {
                email: result.email,
                user_name: result.user_name,
                code: result.code,
                topic: result.topic,
                creation_date: getDateWithTimeZone(result.creation_date),
                last_update_date: getDateWithTimeZone(result.last_update_date)
            }
        });
    }).catch((err: any) => {
        response.status(INTERNAL_SERVER_ERROR).json({ code: INTERNAL_SERVER_ERROR, status: err.toString() })
    })
})

UserRouter.put('/update', (request: Request, response: Response) => {
    const body = request.body;
    console.log(body);
    response.json({ status: 'exitoso' });
})


UserRouter.patch('/update', (request: Request, response: Response) => {
    const fieldId = request.body.key;
    const value = request.body.value;
    console.log(`field id :  ${fieldId} , value : ${value}`);
    response.json({ status: 'exitoso' });
})


UserRouter.delete('/delete', (request: Request, response: Response) => {
    const email = request.query.email;
    console.log(`user email to delete : ${email}`);
    response.json({ status: 'exitoso' });
})

UserRouter.get('/enrolled', (request: Request, response: Response) => {
    const sessionId = request.headers.ssid as string;
    getEnrolledCourses(sessionId).then((courses: ICourse[]) => {
        response.status(OK).json({ data: courses });
    }).catch((err) => {
        response.status(err.code).json(err);
    })
})


UserRouter.get('/own', (request: Request, response: Response) => {
    const sessionId = request.headers.ssid as string;
    getCreatedCourses(sessionId).then((courses: ICourse[]) => {
        response.status(OK).json({ data: courses });
    }).catch((err) => {
        response.status(err.code).json(err);
    })
})

UserRouter.get('/activity', (request: Request, response: Response) => {
    const sessionId = request.headers.ssid as string;
    getActivity(sessionId).then((activity: IUserActivity) => {
        response.status(OK).json({ data: activity.activity })
    }).catch((err) => {
        response.status(err.code).json(err);
    })

})