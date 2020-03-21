import { INTERNAL_SERVER_ERROR_STATUS } from './../utils/constants';
import { INTERNAL_SERVER_ERROR } from 'http-status';
import { ITopic } from './../models/topic.models';
import { findAll, find } from './../services/topic.service';
import { Router, Request, Response } from 'express';


export const TopicRouter: Router = Router();


TopicRouter.get('/all', (request: Request, response: Response) => {
    findAll().then((topics: ITopic[]) => {
        response.json({ data: topics });
    }).catch((err: any) => {
        if (err.status) {
            return response.status(err.code).json(err);
        }
        return response.status(INTERNAL_SERVER_ERROR).json({ code: INTERNAL_SERVER_ERROR, status: INTERNAL_SERVER_ERROR_STATUS });
    })
})


TopicRouter.get('/:id/detail', (request: Request, response: Response) => {
    const id = request.params.id;
    find(id).then((topic: ITopic[]) => {
        response.json({ data: topic });
    }).catch((err: any) => {
        console.log(err);
        if (err.status) {
            return response.status(err.code).json(err);
        }
        return response.status(INTERNAL_SERVER_ERROR).json({ code: INTERNAL_SERVER_ERROR, status: INTERNAL_SERVER_ERROR_STATUS });
    })
})