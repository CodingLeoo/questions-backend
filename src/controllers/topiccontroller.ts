import { ITopic } from './../models/topic.models';
import { findAll, find } from './../services/topic.service';
import { Router, Request, Response } from 'express';


export const TopicRouter: Router = Router();


TopicRouter.get('/all', (request: Request, response: Response) => {
    findAll().then((topics: ITopic[]) => {
        response.json({ data: topics });
    }).catch((err: any) => {
        return response.status(err.code).json(err);
    })
})


TopicRouter.get('/:id/detail', (request: Request, response: Response) => {
    const id = request.params.id;
    find(id).then((topic: ITopic[]) => {
        response.json({ data: topic });
    }).catch((err: any) => {
        return response.status(err.code).json(err);
    })
})