import React, { useEffect, useState } from 'react';
import './QuizPage.scss';
import QuestionForm from '../components/forms/QuestionForm';
import { REFRESH_STATUS_INTERVAL } from '../config';
import AdminQuizForm from '../components/forms/AdminQuizForm';
import { useTranslation } from 'react-i18next';
import { AspectRatio, Language, NO_QUESTION_INDEX, QuestionType } from '../constants';
import Page from './Page';
import useServerCountdownTimer from '../hooks/useServerCountdownTimer';
import useQuiz from '../hooks/useQuiz';
import useUser from '../hooks/useUser';
import useApp from '../hooks/useApp';
import useOverlay from '../hooks/useOverlay';
import { OverlayName } from '../reducers/OverlaysReducer';
import useVote from '../hooks/useVote';

const QuizPage: React.FC = () => {  
  const { t, i18n } = useTranslation();

  const language = i18n.language as Language;

  const app = useApp();
  const quiz = useQuiz();
  const user = useUser();
  const vote = useVote(app.questionIndex);

  const loadingOverlay = useOverlay(OverlayName.Loading);
  const answerOverlay = useOverlay(OverlayName.Answer);

  const timer = useServerCountdownTimer();

  const [choice, setChoice] = useState('');

  const isReady = quiz.id !== null && quiz.questions && quiz.status && app.questionIndex !== NO_QUESTION_INDEX;



  // Handle loading overlay based on presence of data
  useEffect(() => {
    if (!isReady && !loadingOverlay.isOpen) {
      loadingOverlay.open();
    }
    if (isReady && loadingOverlay.isOpen) {
      loadingOverlay.close();
    }

  }, [isReady]);



  // Fetch initial data only once!
  useEffect(() => {
    if (isReady) {
      return;
    }

    quiz.fetchData();

  }, [isReady]);



  // Refresh questions' JSON when changing language
  useEffect(() => {
    if (quiz.id === null || quiz.name === null) {
      return;
    }

    quiz.refreshQuestions();
  }, [language]);



  // Fetch current quiz status from server when moving to next question
  useEffect(() => {
    if (!user.isAuthenticated) {
      return;
    }
    if (quiz.id === null || quiz.name === null) {
      return;
    }

    // Do not run for first question
    if (app.questionIndex === NO_QUESTION_INDEX) {
      return;
    }

    quiz.refreshStatusPlayersAndScores()
      .then(() => {
        if (timer.isEnabled) {
          timer.restart();
        }
      });

  }, [app.questionIndex]);



  // Regularly fetch current quiz status from server
  useEffect(() => {
    if (!user.isAuthenticated) {
      return;
    }
    if (quiz.id === null || quiz.name === null) {
      return;
    }

    const interval = setInterval(quiz.refreshStatusPlayersAndScores, REFRESH_STATUS_INTERVAL);
  
    return () => clearInterval(interval);
  }, []);



  // Set choice if user already voted
  useEffect(() => {
    if (!user.isAuthenticated) {
      return;
    }
    if (vote.value === null) {
      if (answerOverlay.isOpen) {
        answerOverlay.close();
      }
      return;
    }

    setChoice(vote.value);
    if (!answerOverlay.isOpen) {
      answerOverlay.open();
    }
    
  }, [vote.value]);



  // Open answer layer if quiz is over
  useEffect(() => {
    if (!user.isAuthenticated) {
      return;
    }
    if (!quiz.isOver) {
      return;
    }

    answerOverlay.open();
    
  }, [quiz.isOver]);



  // Start timer if enabled
  useEffect(() => {
    if (!user.isAuthenticated) {
      return;
    }
    if (timer.isEnabled && !timer.isRunning && quiz.isStarted) {
      timer.start();
    }
  }, [timer.isEnabled, timer.isRunning, quiz.isStarted]);



  // Show answer once timer has expired
  useEffect(() => {
    if (!user.isAuthenticated) {
      return;
    }
    if (quiz.isStarted && timer.isEnabled && timer.isDone) {
      answerOverlay.open();
    }

  }, [quiz.isStarted, timer.isEnabled, timer.isDone]);


  // Wait until data has been fetched
  if (!isReady) {
    return null;
  }


  
  const { topic, question, type, url, options } = quiz.questions![app.questionIndex];

  return (
    <Page title={t('common:COMMON:QUIZ')} className='quiz-page'>
      {!quiz.isStarted && user.isAdmin && (
        <AdminQuizForm />
      )}
      {quiz.isStarted && (
        <QuestionForm
          remainingTime={timer.isEnabled && (timer.isRunning || timer.isDone) ? timer.time : undefined}
          index={app.questionIndex}
          topic={topic}
          question={question}
          image={type === QuestionType.Image ? { url: url!, desc: `Question ${app.questionIndex + 1}` } : undefined}
          video={type === QuestionType.Video ? { url: url!, desc: `Question ${app.questionIndex + 1}` } : undefined}
          ratio={AspectRatio.FourByThree}
          options={options}
          disabled={choice === ''}
          choice={choice}
          setChoice={setChoice}
        />
      )}
    </Page>
  );
}

export default QuizPage;