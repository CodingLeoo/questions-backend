import { ICourse } from './../models/course.models';
import { IUser } from './../models/auth.models';
import { OK } from 'http-status';
import { createCourse, enrollCourse, getStudents, getDetail } from './../services/course.service';
import { Router, Request, Response } from 'express';


export const CoursesRouter: Router = Router();

CoursesRouter.get('/all', (response: Response) => {
    response.json({ status: 'exitoso' });
})


CoursesRouter.get('/:course/detail', (request: Request, response: Response) => {
    const courseId = request.params.course;
    getDetail(courseId).then((course: ICourse) => {
        response.status(OK).json({ data: course });
    }).catch((err) => {
        response.status(err.code).json(err);
    })
})


CoursesRouter.get('/:course/students', (request: Request, response: Response) => {
    const courseId = request.params.course;
    getStudents(courseId).then((students: IUser[]) => {
        response.status(OK).json({ data: students });
    }).catch((err) => {
        response.status(err.code).json(err);
    })
})


CoursesRouter.post('/save', (request: Request, response: Response) => {
    const body = request.body;
    const sessionId = request.headers.ssid as string;
    createCourse(sessionId, body).then((result: any) => {
        response.status(OK).json(result);
    }).catch((err) => {
        response.status(err.code).json(err);
    })
})

CoursesRouter.post('/:course/enroll', (request: Request, response: Response) => {
    const courseId = request.params.course;
    const sessionId = request.headers.ssid as string;
    enrollCourse(sessionId, courseId).then((result: any) => {
        response.status(OK).json(result);
    }).catch((err) => {
        response.status(err.code).json(err);
    })
})

CoursesRouter.put('/update/:course', (request: Request, response: Response) => {
    const courseId = request.params.course;

    response.json({ status: 'exitoso' });
})

CoursesRouter.delete('/delete/:course', (request: Request, response: Response) => {
    const courseId = request.params.course;
    const body = request.body;
    console.log(`course requested : ${body} , course-id : ${courseId}`);
    response.json({ status: 'exitoso' });
})