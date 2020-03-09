import { OK } from 'http-status';
import { createCourse, enrollCourse } from './../services/course.service';
import { Router, Request, Response } from 'express';


export const CoursesRouter: Router = Router();

CoursesRouter.get('/all', (response: Response) => {
    response.json({ status: 'exitoso' });
})

// TODO : add detail method for get course detail
CoursesRouter.get('/:course/detail', (request: Request, response: Response) => {
    const courseId = request.params.course;
    console.log(`course requested : ${courseId}`);
    response.json({ status: 'exitoso' });
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
    const body = request.body;
    console.log(`course requested : ${body} , course-id : ${courseId}`);
    response.json({ status: 'exitoso' });
})

CoursesRouter.delete('/delete/:course', (request: Request, response: Response) => {
    const courseId = request.params.course;
    const body = request.body;
    console.log(`course requested : ${body} , course-id : ${courseId}`);
    response.json({ status: 'exitoso' });
})