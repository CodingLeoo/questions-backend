import { isNotEmptyBody } from './../middlewares/common.middleware';
import { ICourse } from './../models/course.models';
import { IUser } from './../models/auth.models';
import { OK } from 'http-status';
import { createCourse, enrollCourse, getStudents, getDetail, getOwner, getExams, getSections, updateCourse, deleteCourse } from './../services/course.service';
import { Router, Request, Response } from 'express';


export const CoursesRouter: Router = Router();


CoursesRouter.get('/:course/detail', (request: Request, response: Response) => {
    const courseId = request.params.course;
    getDetail(courseId).then((course: ICourse) => {
        response.status(OK).json({ data: course });
    }).catch((err) => {
        response.status(err.code).json(err);
    })
})


CoursesRouter.get('/:course/owner', (request: Request, response: Response) => {
    const courseId = request.params.course;
    getOwner(courseId).then((ownerData: any) => {
        response.status(OK).json({ data: ownerData });
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


CoursesRouter.get('/:course/exams', (request: Request, response: Response) => {
    const courseId = request.params.course;
    getExams(courseId).then((exams: any) => {
        response.status(OK).json({ data: exams });
    }).catch((err) => {
        response.status(err.code).json(err);
    })
})

CoursesRouter.get('/:course/sections', (request: Request, response: Response) => {
    const courseId = request.params.course;
    getSections(courseId).then((sections: any) => {
        response.status(OK).json({ data: sections });
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
    const inscriptionCode = request.query.code as string;
    enrollCourse(sessionId, courseId , inscriptionCode).then((result: any) => {
        response.status(OK).json(result);
    }).catch((err) => {
        response.status(err.code).json(err);
    })
})

CoursesRouter.put('/:course/update', isNotEmptyBody, (request: Request, response: Response) => {
    const courseId = request.params.course;
    const body = request.body;
    updateCourse(courseId, body).then((result: any) => {
        response.status(OK).json(result);
    }).catch((err) => {
        response.status(err.code).json(err);
    })
})

CoursesRouter.delete('/:course/delete', (request: Request, response: Response) => {
    const courseId = request.params.course;
    deleteCourse(courseId).then((result: any) => {
        response.status(OK).json(result);
    }).catch((err) => {
        response.status(err.code).json(err);
    })
})