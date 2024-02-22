import { RequestHandler } from 'express';
import logger from '../../logger';
import { errorResponse, successResponse } from '../../utils/calls';
import { HttpStatusCode, HttpStatusMessage } from '../../types/HTTPTypes';
import { ParamsDictionary } from 'express-serve-static-core';
import { APP_DB } from '../..';

const validateParams = async (params: ParamsDictionary) => {
    const { quizId } = params;

    if (quizId === undefined) {
        throw new Error('INVALID_PARAMS');
    }

    if (!await APP_DB.doesQuizExist(quizId)) {
        throw new Error('INVALID_QUIZ_ID');
    }

    return { quizId };
}



const GetVotesController: RequestHandler = async (req, res, next) => {
    try {
        const { username } = req.user!;

        const { quizId } = await validateParams(req.params);

        const votes = await APP_DB.getUserVotes(quizId, username);

        return res.json(successResponse(votes));

    } catch (err: any) {
        if (err instanceof Error) {
            logger.warn(err.message);

            return res
                .status(HttpStatusCode.NOT_IMPLEMENTED)
                .send(errorResponse(HttpStatusMessage.NOT_IMPLEMENTED));
        }

        next(err);
    }
}

export default GetVotesController;