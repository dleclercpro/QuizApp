import { RequestHandler } from 'express';
import { successResponse } from '../../utils/calls';
import { LANGUAGES, Language, QUIZ_NAMES, QuizName } from '../../constants';
import { ParamsDictionary } from 'express-serve-static-core';
import InvalidLanguageError from '../../errors/InvalidLanguageError';
import { getQuestions } from '../../utils';

const validateParams = (params: ParamsDictionary) => {
    const { lang, quizName } = params;

    if (!LANGUAGES.includes(lang as Language)) {
        throw new InvalidLanguageError();
    }

    if (!QUIZ_NAMES.includes(quizName as QuizName)) {
        // Fixme
        throw new Error('Invalid quiz name.');
    }

    return { lang: lang as Language, quizName: quizName as QuizName };
}



const GetQuestionsController: RequestHandler = async (req, res, next) => {
    try {
        const { lang, quizName } = validateParams(req.params);

        const questions = await getQuestions(quizName, lang);

        return res.json(
            successResponse(questions)
        );

    } catch (err: any) {
        next(err);
    }
}

export default GetQuestionsController;