import { Router, Request, Response } from 'express';
import { OK } from 'http-status';
import { EnrollCode } from './../models/inscriptioncode.model';
import { getInscriptionCode } from './../services/inscriptioncode.service';


export const InscriptionCodeRouter: Router = Router();


InscriptionCodeRouter.get('/:course_id', (request: Request, response: Response) => {
    getInscriptionCode(request.params.course_id).then((enrollCode: EnrollCode) => {
        response.status(OK).json({
            data: {
                code: enrollCode.code,
                valid_until: enrollCode.valid_until
            }
        })
    }).catch((err) => {
        console.log(err);
        response.status(err.code).json(err);
    })
})