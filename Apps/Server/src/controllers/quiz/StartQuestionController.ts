import { RequestHandler } from 'express';
import logger from '../../logger';
import { APP_DB } from '../..';
import { successResponse } from '../../utils/calls';
import { ParamsDictionary } from 'express-serve-static-core';
import { N_QUESTIONS } from '../../constants';
import { QuizGame } from '../../types/QuizTypes';
import InvalidQuizIdError from '../../errors/InvalidQuizIdError';
import InvalidQuestionIndexError from '../../errors/InvalidQuestionIndexError';
import UserCannotStartQuestionError from '../../errors/UserCannotStartQuestionError';
import UserCannotStartUnsupervisedQuestionError from '../../errors/UserCannotStartUnsupervisedQuestionError';
import PlayersNotReadyError from '../../errors/PlayersNotReadyError';
import InvalidParamsError from '../../errors/InvalidParamsError';

const validateParams = async (params: ParamsDictionary) => {
    const { quizId, questionIndex: _questionIndex } = params;

    if (quizId === undefined || _questionIndex === undefined) {
        throw new InvalidParamsError();
    }

    if (!await APP_DB.doesQuizExist(quizId)) {
        throw new InvalidQuizIdError();
    }

    const questionIndex = Number(_questionIndex);
    if (questionIndex + 1 > N_QUESTIONS) {
        throw new InvalidQuestionIndexError();
    }

    return { quizId, questionIndex };
}



const StartQuestionController: RequestHandler = async (req, res, next) => {
    try {
        const { username, isAdmin } = req.user!;

        const { quizId, questionIndex } = await validateParams(req.params);

        // User needs to be admin to start question
        if (!isAdmin) {
            throw new UserCannotStartQuestionError();
        }

        // Starting a question requires the quiz to be supervised
        const quiz = await APP_DB.getQuiz(quizId) as QuizGame;
        if (!quiz.isSupervised) {
            throw new UserCannotStartUnsupervisedQuestionError();
        }

        // Players can only vote on next question index
        const currentQuestionIndex = await APP_DB.getQuestionIndex(quizId);
        if (questionIndex !== currentQuestionIndex + 1) {
            throw new InvalidQuestionIndexError();
        }

        // Find out whether all users have voted up until current question
        const playersWhoVoted = await APP_DB.getPlayersWhoVotedUpUntil(quizId, currentQuestionIndex);;
        const players = await APP_DB.getAllPlayers(quizId);
        logger.trace(`Players: ${players}`);
        logger.trace(`Players who voted so far (${playersWhoVoted.length}/${players.length}): ${playersWhoVoted}`);

        // If not: cannot increment quiz's current question index
        if (playersWhoVoted.length !== players.length) {
            throw new PlayersNotReadyError();
        }

        await APP_DB.incrementQuestionIndex(quizId);
        logger.info(`Question ${questionIndex + 1}/${N_QUESTIONS} of quiz '${quizId}' has been started by admin '${username}'.`);

        return res.json(successResponse());

    } catch (err: any) {
        next(err);
    }
}

export default StartQuestionController;