import { RequestHandler } from 'express';
import { successResponse } from '../utils/calls';
import { QUIZ } from '../constants';

const GetQuizController: RequestHandler = async (req, res, next) => {
    try {
        return res.json(successResponse(QUIZ));

    } catch (err: any) {
        next(err);
    }
}

export default GetQuizController;