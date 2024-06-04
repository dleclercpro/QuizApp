import React from 'react';
import './HomePage.scss';
import LoginForm from '../components/forms/LoginForm';
import { Navigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Page from './Page';
import { QuizName } from '../constants';
import useUser from '../hooks/useUser';
import { URL_PARAM_QUIZ_ID, URL_PARAM_QUIZ_NAME, URL_PARAM_TEAM_ID } from '../config';
import useData from '../hooks/useData';
import useQuiz from '../hooks/useQuiz';

const HomePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  
  const { t } = useTranslation();

  const user = useUser();
  const quiz = useQuiz();
  const data = useData();
  
  const paramQuizName = searchParams.get(URL_PARAM_QUIZ_NAME);
  const paramQuizId = searchParams.get(URL_PARAM_QUIZ_ID);
  const paramTeamId = searchParams.get(URL_PARAM_TEAM_ID);

  const quizName = paramQuizName as QuizName ?? quiz.name;
  const quizId = paramQuizId ?? quiz.id;
  const teamId = paramTeamId ?? user.teamId;

  const isQuizNameValid = data.quizzes.includes(quizName);
  const isQuizIdValid = quizId !== null ? typeof quizId === 'string' : false;
  const isTeamIdValid = teamId !== null ? quiz.teams.includes(teamId) : false;
  console.log(`isQuizNameValid: ${isQuizNameValid}`);
  console.log(`isQuizIdValid: ${isQuizIdValid}`);
  console.log(`isTeamIdValid: ${isTeamIdValid}`);



  if (user.isAuthenticated) {
    return (
      <Navigate to='/quiz' />
    );
  }

  return (
    <Page title={t('common:COMMON:HOMEPAGE')} className='home-page'>
      {!user.isAuthenticated && (
        <div className='home-page-box'>
          <h1 className='home-page-title'>{t(`${quizName}:TITLE`)}</h1>
          <p className='home-page-text'>{t(`${quizName}:WELCOME_HEAD`)}</p>
          <p className='home-page-text'>{t(`${quizName}:WELCOME_TEXT`)}</p>
          <p className='home-page-text'>{t(`${quizName}:WELCOME_CTA`)}</p>
          
          <LoginForm quizId={quizId} teamId={teamId} />
        </div>
      )}
    </Page>
  );
};

export default HomePage;