import { INTERNAL_SERVER_ERROR } from 'http-status';
import { findUser } from './../services/user.service';
import { Router, Request, Response } from 'express';

export const UserRouter: Router = Router();


UserRouter.get('/find', (request: Request, response: Response) => {
    const sessionId = request.headers.ssid as string;
    findUser(sessionId).then((result: any) => {
        response.json({ data: result });
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