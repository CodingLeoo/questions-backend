import { Router, Request, Response } from 'express';

export const UserRouter: Router = Router();


UserRouter.get('/find', (request: Request, response: Response) => {
    const email = request.query.email;
    console.log(email);
    response.json({ status: 'exitoso' });
})


UserRouter.put('/update', (request: Request, response: Response) => {
    const body = request.body;
    console.log(body);
    response.json({ status: 'exitoso' });
})


UserRouter.patch('/update/:field' ,(request: Request, response: Response)  => {
    const fieldId = request.params.field;
    const value = request.query.value;
    console.log(`field id :  ${fieldId} , value : ${value}`);
    response.json({status :  'exitoso'});
})


UserRouter.delete('/delete' , (request: Request, response: Response) => {
    const email = request.query.email;
    console.log(`user email to delete : ${email}`);
    response.json({status : 'exitoso'});
})