import { IUser } from './../models/auth.models';
import { isNotEmptyBody } from './../middlewares/common.middleware';
import { OK_STATUS } from './../utils/constants';
import { IUserActivity } from './../models/activity.model';
import { ICourse } from './../models/course.models';
import { INTERNAL_SERVER_ERROR, OK } from 'http-status';
import { findUser, getEnrolledCourses, getCreatedCourses, getActivity, updatePhoto, updateEntity, deleteAccount } from './../services/user.service';
import { Router, Request, Response } from 'express';

export const UserRouter: Router = Router();


UserRouter.get('/find', (request: Request, response: Response) => {
    const sessionId = request.headers.ssid as string;
    findUser(sessionId).then((result: IUser) => {
        response.json({
            data: result
        });
    }).catch((err: any) => {
        response.status(INTERNAL_SERVER_ERROR).json({ code: INTERNAL_SERVER_ERROR, status: err.toString() })
    })
});

UserRouter.put('/update', isNotEmptyBody, (request: Request, response: Response) => {
    const { password, user_name } = request.body;
    const sessionId = request.headers.ssid as string;
    updateEntity(sessionId, user_name, password).then((result: any) => {
        response.status(OK).json({ code: OK, status: OK_STATUS, additional_information: result });
    }).catch((err) => {
        response.status(err.code).json(err);
    })
})


UserRouter.patch('/image', (request: Request, response: Response) => {
    const body = request.body;
    const sessionId = request.headers.ssid as string;
    updatePhoto(sessionId, body).then((result: any) => {
        response.status(OK).json({ code: OK, status: OK_STATUS, additional_information: result });
    }).catch((err) => {
        response.status(err.code).json(err);
    })
})


UserRouter.delete('/delete', isNotEmptyBody, (request: Request, response: Response) => {
    const email = request.body.email;
    deleteAccount(email).then(() => {
        response.status(OK).json({ code: OK, status: OK_STATUS })
    }).catch((err) => {
        response.status(err.code).json(err);
    })
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