import { Router, Request, Response } from 'express';


export const CoursesRouter: Router = Router();

CoursesRouter.get('/all', (response: Response) => {
    response.json({ status: 'exitoso' });
})

CoursesRouter.get('/:course/detail', (request: Request, response: Response) => {
    const courseId = request.params.course;
    console.log(`course requested : ${courseId}`);
    response.json({ status: 'exitoso' });
})


CoursesRouter.post('/save', (request: Request, response: Response) => {
    const body = request.body;
    console.log(`course requested : ${body}`);
    response.json({ status: 'exitoso' });
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