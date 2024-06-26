import './AnswerOverlay.scss';
import { useNavigate } from 'react-router-dom';
import RightIcon from '@mui/icons-material/Check';
import WrongIcon from '@mui/icons-material/Close';
import WaitIcon from '@mui/icons-material/Schedule';
import { useTranslation } from 'react-i18next';
import useQuiz from '../../hooks/useQuiz';
import useUser from '../../hooks/useUser';
import useApp from '../../hooks/useApp';
import useOverlay from '../../hooks/useOverlay';
import { OverlayName } from '../../reducers/OverlaysReducer';
import useQuestion from '../../hooks/useQuestion';
import { PageUrl, UserType } from '../../constants';
import useTimerContext from '../contexts/TimerContext';

const AnswerOverlay: React.FC = () => {
  const navigate = useNavigate();

  const { t } = useTranslation();

  const app = useApp();
  const quiz = useQuiz();
  const user = useUser();

  const timer = useTimerContext();

  const appQuestionIndex = app.questionIndex;
  const nextAppQuestionIndex = appQuestionIndex + 1;

  const question = useQuestion(appQuestionIndex);
  const overlay = useOverlay(OverlayName.Answer);



  // Wait until quiz data has been fetched
  if (quiz.id === null || quiz.questions === null || quiz.status === null || quiz.players.length === 0 || question.voteCount === null) {
    return null;
  }

  const correctAnswer = question.answer.correct;
  const chosenAnswer = question.answer.chosen;

  const regularPlayersCount = quiz.players.filter((player) => !player.isAdmin).length;
  const regularPlayersVoteCount = question.voteCount[UserType.Regular];

  const Icon = question.answer.isCorrect ? RightIcon : WrongIcon;
  const iconText = t(question.answer.isCorrect ? 'OVERLAYS.ANSWER.RIGHT_ANSWER_ICON_TEXT' : 'OVERLAYS.ANSWER.WRONG_ANSWER_ICON_TEXT');

  const currentVoteStatus = t('common:OVERLAYS.ANSWER.CURRENT_STATUS', { voteCount: regularPlayersVoteCount, playersCount: regularPlayersCount });
  const text = t(question.answer.isCorrect ? 'OVERLAYS.ANSWER.RIGHT_ANSWER_TEXT' : 'OVERLAYS.ANSWER.WRONG_ANSWER_TEXT');


  
  let hideAnswer = true;
  // Never hide answer for admins
  if (user.isAdmin) {
    hideAnswer = correctAnswer === null;
  // Timer is over: show answer
  } else if (timer.isEnabled && timer.isDone) {
    hideAnswer = false;
  // For regular users: wait until all players have answered question
  } else {
    hideAnswer = correctAnswer === null || chosenAnswer === null || (!quiz.isOver && !question.haveAllPlayersAnswered);
  }



  const goToScoreboard = () => {
    overlay.close();

    navigate(PageUrl.Scores);
  }



  if (!overlay.isOpen) {
    return null;
  }

  return (
    <div id='answer-overlay' data-testid='answer-overlay'>
      <div className='answer-overlay-box'>
          <div>
            <div className='answer-overlay-box-left'>
              {hideAnswer ? (
                <>
                  <WaitIcon className='answer-overlay-icon wait' data-testid='wait-icon' />
                  <p className='answer-overlay-title'>{t('common:OVERLAYS.ANSWER.PLEASE_WAIT_FOR_ALL_PLAYERS')}</p>
                </>
              ) : (
                <>
                  <Icon className={`answer-overlay-icon ${question.answer.isCorrect ? 'is-right' : 'is-wrong'}`} />
                  <h2 className='answer-overlay-title'>{iconText}</h2>
                </>
              )}
            </div>
            <div className='answer-overlay-box-right'>
              {hideAnswer ? (
                <>
                  <p className='answer-overlay-title'>{currentVoteStatus}</p>
                </>
              ) : (
                <>
                  <p className='answer-overlay-text'>{text}</p>
                  <p className='answer-overlay-value'>{correctAnswer!.value}</p>
                  <p className='answer-overlay-text'>{currentVoteStatus}</p>

                  {!quiz.isOver && (user.isAdmin && quiz.isSupervised) && (
                    <button className='answer-overlay-button' onClick={question.next.startAndGoTo}>
                      {t('common:OVERLAYS.ANSWER.START_NEXT_QUESTION')} {`(${nextAppQuestionIndex + 1}/${quiz.questions!.length})`}
                    </button>
                  )}
                  {!quiz.isOver && !(user.isAdmin && quiz.isSupervised) && (
                    <button className='answer-overlay-button' disabled={question.next.mustWaitFor} onClick={question.next.goTo}>
                      {question.next.mustWaitFor ? (
                        t('common:OVERLAYS.ANSWER.PLEASE_WAIT_FOR_NEXT_QUESTION')
                      ) : (
                        `${t('common:OVERLAYS.ANSWER.NEXT_QUESTION')} (${nextAppQuestionIndex + 1}/${quiz.questions!.length})`
                      )}
                    </button>
                  )}
                  {quiz.isOver && (
                    <button className='answer-overlay-button' onClick={goToScoreboard}>
                      {t('common:OVERLAYS.ANSWER.SEE_RESULTS')}
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
      </div>
    </div>
  );
};

export default AnswerOverlay;